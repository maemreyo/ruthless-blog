#!/usr/bin/env node

/**
 * Script để tự động xử lý ảnh trong bài viết Markdown
 * - Tìm tất cả ảnh local trong bài viết
 * - Upload ảnh lên repository hình ảnh
 * - Cập nhật đường dẫn ảnh trong bài viết
 * 
 * Sử dụng: node scripts/process-post-images.js --post path/to/post.md
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { execSync } = require('child_process');
const matter = require('gray-matter');

// Cấu hình command line options
program
  .option('-p, --post <path>', 'Đường dẫn đến bài viết Markdown')
  .option('-a, --all', 'Xử lý tất cả các bài viết trong thư mục blog', false)
  .option('-f, --folder <folder>', 'Thư mục đích trong repository hình ảnh', '')
  .option('-o, --optimize', 'Tối ưu hóa ảnh trước khi upload', true)
  .option('-k, --keep', 'Giữ lại ảnh gốc sau khi upload', false)
  .option('--force', 'Xóa cả ảnh trong thư mục public', true)
  .option('--force-git', 'Force push lên Git repository nếu cần', true)
  .option('--no-preserve-structure', 'Không giữ cấu trúc thư mục gốc', false)
  .option('--service <service>', 'Dịch vụ URL hình ảnh (jsdelivr-latest, jsdelivr-versioned, github-raw, github-blob)', 'github-raw')
  .option('--check-repo', 'Kiểm tra xem repository có phải là public không', true)
  .option('--update-all-langs', 'Cập nhật tất cả các phiên bản ngôn ngữ của bài viết', true)
  .option('--lang <lang>', 'Chỉ xử lý bài viết của ngôn ngữ cụ thể (vi, en)', '');

program.parse(process.argv);

const options = program.opts();

// Kiểm tra xem có bài viết được chỉ định hoặc tùy chọn --all được sử dụng không
if (!options.post && !options.all) {
  console.error('Lỗi: Bạn phải chỉ định bài viết (--post) hoặc sử dụng tùy chọn --all');
  program.help();
  process.exit(1);
}

// Nếu có chỉ định bài viết cụ thể, kiểm tra xem file có tồn tại không
if (options.post && !fs.existsSync(options.post)) {
  console.error(`Lỗi: Không tìm thấy file bài viết: ${options.post}`);
  process.exit(1);
}

// Hàm để tìm tất cả các bài viết Markdown trong thư mục blog
function findAllPosts() {
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const posts = [];
  
  // Kiểm tra xem thư mục blog có tồn tại không
  if (!fs.existsSync(blogDir)) {
    console.error(`Lỗi: Không tìm thấy thư mục blog: ${blogDir}`);
    process.exit(1);
  }
  
  // Lấy danh sách các thư mục ngôn ngữ
  const langDirs = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Lọc theo ngôn ngữ nếu được chỉ định
  const filteredLangDirs = options.lang ? langDirs.filter(lang => lang === options.lang) : langDirs;
  
  // Duyệt qua từng thư mục ngôn ngữ
  for (const lang of filteredLangDirs) {
    const langDir = path.join(blogDir, lang);
    
    // Lấy danh sách các file Markdown trong thư mục ngôn ngữ
    const mdFiles = fs.readdirSync(langDir)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    // Thêm đường dẫn đầy đủ vào danh sách
    for (const mdFile of mdFiles) {
      posts.push(path.join(langDir, mdFile));
    }
  }
  
  return posts;
}

// Hàm để tìm tất cả ảnh local trong bài viết
function findLocalImages(content, postDir, frontmatter) {
  const images = [];
  
  // Đường dẫn gốc của project
  const projectRoot = process.cwd();
  const publicDir = path.join(projectRoot, 'public');
  
  // 1. Tìm ảnh trong frontmatter
  if (frontmatter) {
    // Các trường có thể chứa đường dẫn ảnh
    const imageFields = ['thumbnail', 'image', 'cover', 'banner', 'featured_image', 'hero_image'];
    
    for (const field of imageFields) {
      if (frontmatter[field] && typeof frontmatter[field] === 'string') {
        const imagePath = frontmatter[field];
        
        // Bỏ qua ảnh đã có URL
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || 
            imagePath.includes('cdn.jsdelivr.net')) {
          continue;
        }
        
        // Xác định đường dẫn đầy đủ đến ảnh
        let fullPath;
        let isPublicImage = false;
        
        // Xử lý đường dẫn bắt đầu bằng /images/
        if (imagePath.startsWith('/images/') || imagePath.startsWith('/')) {
          fullPath = path.join(publicDir, imagePath);
          isPublicImage = true;
        } else if (path.isAbsolute(imagePath)) {
          fullPath = imagePath;
          isPublicImage = false;
        } else {
          fullPath = path.resolve(postDir, imagePath);
          isPublicImage = false;
        }
        
        // Kiểm tra xem ảnh có tồn tại không
        if (fs.existsSync(fullPath)) {
          images.push({
            altText: field, // Sử dụng tên trường làm alt text
            imagePath,
            fullPath,
            match: null, // Không có match vì đây là frontmatter
            isPublicImage,
            originalFolder: isPublicImage ? path.dirname(imagePath).replace(/^\//, '') : null,
            inFrontmatter: true,
            frontmatterField: field
          });
          console.log(`✅ Đã tìm thấy ảnh trong frontmatter (${field}): ${fullPath}`);
        } else {
          console.warn(`⚠️ Không tìm thấy ảnh từ frontmatter (${field}): ${fullPath}`);
          
          // Thử tìm trong thư mục public nếu đường dẫn không bắt đầu bằng /
          if (!imagePath.startsWith('/') && !path.isAbsolute(imagePath)) {
            // Thử tìm trong thư mục public/images
            const publicImagePath = path.join(publicDir, 'images', imagePath);
            if (fs.existsSync(publicImagePath)) {
              images.push({
                altText: field,
                imagePath,
                fullPath: publicImagePath,
                match: null,
                isPublicImage: true,
                originalFolder: `images/${path.dirname(imagePath)}`,
                inFrontmatter: true,
                frontmatterField: field
              });
              console.log(`✅ Đã tìm thấy ảnh từ frontmatter trong thư mục public/images: ${publicImagePath}`);
            } 
            // Thử tìm trực tiếp trong thư mục public
            else {
              const directPublicPath = path.join(publicDir, imagePath);
              if (fs.existsSync(directPublicPath)) {
                images.push({
                  altText: field,
                  imagePath,
                  fullPath: directPublicPath,
                  match: null,
                  isPublicImage: true,
                  originalFolder: path.dirname(imagePath),
                  inFrontmatter: true,
                  frontmatterField: field
                });
                console.log(`✅ Đã tìm thấy ảnh từ frontmatter trong thư mục public: ${directPublicPath}`);
              }
            }
          }
        }
      }
    }
  }
  
  // 2. Tìm ảnh trong nội dung Markdown
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const altText = match[1];
    const imagePath = match[2];
    
    // Bỏ qua ảnh đã có URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || 
        imagePath.includes('cdn.jsdelivr.net')) {
      continue;
    }
    
    // Xác định đường dẫn đầy đủ đến ảnh
    let fullPath;
    let isPublicImage = false;
    
    // Xử lý đường dẫn bắt đầu bằng /images/
    if (imagePath.startsWith('/images/')) {
      fullPath = path.join(publicDir, imagePath);
      isPublicImage = true;
    } else if (path.isAbsolute(imagePath)) {
      fullPath = imagePath;
      isPublicImage = false;
    } else {
      fullPath = path.resolve(postDir, imagePath);
      isPublicImage = false;
    }
    
    // Kiểm tra xem ảnh có tồn tại không
    if (fs.existsSync(fullPath)) {
      images.push({
        altText,
        imagePath,
        fullPath,
        match: match[0],
        isPublicImage,
        originalFolder: isPublicImage ? path.dirname(imagePath).replace(/^\//, '') : null,
        inFrontmatter: false
      });
      console.log(`✅ Đã tìm thấy ảnh trong nội dung: ${fullPath}`);
    } else {
      console.warn(`⚠️ Không tìm thấy ảnh từ nội dung: ${fullPath}`);
      
      // Thử tìm trong thư mục public nếu đường dẫn không bắt đầu bằng /
      if (!imagePath.startsWith('/') && !path.isAbsolute(imagePath)) {
        // Thử tìm trong thư mục public/images
        const publicImagePath = path.join(publicDir, 'images', imagePath);
        if (fs.existsSync(publicImagePath)) {
          images.push({
            altText,
            imagePath,
            fullPath: publicImagePath,
            match: match[0],
            isPublicImage: true,
            originalFolder: `images/${path.dirname(imagePath)}`,
            inFrontmatter: false
          });
          console.log(`✅ Đã tìm thấy ảnh trong thư mục public/images: ${publicImagePath}`);
        } 
        // Thử tìm trực tiếp trong thư mục public
        else {
          const directPublicPath = path.join(publicDir, imagePath);
          if (fs.existsSync(directPublicPath)) {
            images.push({
              altText,
              imagePath,
              fullPath: directPublicPath,
              match: match[0],
              isPublicImage: true,
              originalFolder: path.dirname(imagePath),
              inFrontmatter: false
            });
            console.log(`✅ Đã tìm thấy ảnh trong thư mục public: ${directPublicPath}`);
          }
        }
      }
    }
  }
  
  return images;
}

// Hàm để tìm tất cả các phiên bản ngôn ngữ của bài viết
function findAllLanguageVersions(postPath) {
  try {
    // Phân tích đường dẫn để lấy thông tin
    const parsedPath = path.parse(postPath);
    const fileName = parsedPath.base;
    
    // Xác định thư mục gốc của blog
    // Đường dẫn thường có dạng: /path/to/blog/{lang}/{filename}.md
    const langDir = path.dirname(postPath);
    const blogDir = path.dirname(langDir);
    
    // Lấy tên ngôn ngữ hiện tại
    const currentLang = path.basename(langDir);
    
    // Tìm tất cả các thư mục ngôn ngữ
    const langDirs = fs.readdirSync(blogDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Tìm tất cả các phiên bản ngôn ngữ của bài viết
    const langVersions = [];
    
    for (const lang of langDirs) {
      const langPostPath = path.join(blogDir, lang, fileName);
      if (fs.existsSync(langPostPath)) {
        langVersions.push({
          lang,
          path: langPostPath,
          isCurrent: lang === currentLang
        });
      }
    }
    
    return langVersions;
  } catch (error) {
    console.warn(`⚠️ Không thể tìm các phiên bản ngôn ngữ: ${error.message}`);
    return [{ lang: 'unknown', path: postPath, isCurrent: true }];
  }
}

// Hàm để cập nhật đường dẫn ảnh trong bài viết
function updateImagePathsInPost(postPath, imageUrlMap) {
  try {
    // Đọc nội dung bài viết
    const postContent = fs.readFileSync(postPath, 'utf8');
    
    // Parse frontmatter và content
    const { data: frontmatter, content: markdownContent } = matter(postContent);
    
    // Tạo bản sao của frontmatter để cập nhật
    const newFrontmatter = { ...frontmatter };
    let frontmatterUpdated = false;
    let newContent = markdownContent;
    
    // Cập nhật đường dẫn ảnh trong frontmatter
    for (const [field, value] of Object.entries(imageUrlMap.frontmatter || {})) {
      if (frontmatter[field]) {
        newFrontmatter[field] = value;
        frontmatterUpdated = true;
        console.log(`✅ Đã cập nhật ảnh trong frontmatter (${field}) của ${path.basename(postPath)}`);
      }
    }
    
    // Cập nhật đường dẫn ảnh trong nội dung
    for (const [pattern, replacement] of Object.entries(imageUrlMap.content || {})) {
      if (newContent.includes(pattern)) {
        newContent = newContent.replace(pattern, replacement);
        console.log(`✅ Đã cập nhật ảnh trong nội dung của ${path.basename(postPath)}`);
      }
    }
    
    // Lưu lại nội dung bài viết nếu có thay đổi
    if (frontmatterUpdated || newContent !== markdownContent) {
      const newPostContent = matter.stringify(newContent, newFrontmatter);
      fs.writeFileSync(postPath, newPostContent);
      console.log(`✅ Đã lưu bài viết ${path.basename(postPath)}`);
      return true;
    } else {
      console.log(`ℹ️ Không có thay đổi nào trong bài viết ${path.basename(postPath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật bài viết ${path.basename(postPath)}: ${error.message}`);
    return false;
  }
}

// Hàm để xử lý một bài viết
async function processPost(postPath) {
  try {
    console.log(`\n🔄 Đang xử lý bài viết: ${postPath}`);
    
    // Đọc nội dung bài viết
    const postDir = path.dirname(postPath);
    const postContent = fs.readFileSync(postPath, 'utf8');
    
    // Parse frontmatter và content
    const { data: frontmatter, content } = matter(postContent);
    
    // Tìm tất cả các phiên bản ngôn ngữ của bài viết nếu được yêu cầu
    const langVersions = options.updateAllLangs 
      ? findAllLanguageVersions(postPath)
      : [{ lang: 'current', path: postPath, isCurrent: true }];
    
    if (langVersions.length > 1) {
      console.log(`🔍 Tìm thấy ${langVersions.length} phiên bản ngôn ngữ của bài viết:`);
      langVersions.forEach(version => {
        console.log(`   - ${version.lang}: ${path.basename(version.path)}${version.isCurrent ? ' (hiện tại)' : ''}`);
      });
    }
    
    // Tạo thư mục đích dựa trên thông tin bài viết
    let destFolder = options.folder;
    if (!destFolder) {
      // Nếu không chỉ định thư mục, tạo thư mục dựa trên slug và ngày
      const slug = path.basename(postPath, path.extname(postPath)).replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const date = frontmatter.date ? new Date(frontmatter.date) : new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      destFolder = `posts/${year}/${month}/${slug}`;
    }
    
    // Tìm tất cả ảnh local trong bài viết
    const images = findLocalImages(content, postDir, frontmatter);
    
    // Tạo map để lưu thư mục đích cho từng ảnh
    const imageDestFolders = {};
    
    // Xác định thư mục đích cho từng ảnh
    for (const image of images) {
      if (image.isPublicImage && image.originalFolder && options.preserveStructure !== false) {
        // Nếu là ảnh từ thư mục public và cần giữ cấu trúc thư mục
        imageDestFolders[image.fullPath] = image.originalFolder;
      } else {
        // Sử dụng thư mục đích mặc định
        imageDestFolders[image.fullPath] = destFolder;
      }
    }
    
    if (images.length === 0) {
      console.log('✅ Không tìm thấy ảnh local nào trong bài viết.');
      return true;
    }
    
    console.log(`🔍 Tìm thấy ${images.length} ảnh local trong bài viết.`);
    
    // Tạo thư mục tạm để lưu ảnh
    const tempDir = path.join(process.cwd(), '.temp-images');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    } else {
      // Xóa nội dung thư mục tạm trước khi sử dụng
      fs.rmSync(tempDir, { recursive: true, force: true });
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Copy ảnh vào thư mục tạm với cấu trúc thư mục đích
    for (const image of images) {
      const destFolder = imageDestFolders[image.fullPath];
      const destPath = path.join(tempDir, destFolder);
      
      // Tạo thư mục đích nếu chưa tồn tại
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      // Copy ảnh vào thư mục tạm
      const destFilePath = path.join(destPath, path.basename(image.fullPath));
      fs.copyFileSync(image.fullPath, destFilePath);
      console.log(`✅ Đã copy ảnh ${image.fullPath} vào ${destFilePath}`);
    }
    
    // Upload tất cả ảnh lên repository hình ảnh
    console.log(`🔄 Đang upload ${images.length} ảnh lên repository hình ảnh...`);
    
    // Tạo command để upload ảnh
    let uploadCommand = `node scripts/upload-images.js --directory "${tempDir}" --message "Add images for ${path.basename(postPath)}" --preserve-structure`;
    
    if (options.optimize) {
      uploadCommand += ' --optimize';
    }
    
    if (options.service) {
      uploadCommand += ` --service ${options.service}`;
    }
    
    if (options.forceGit) {
      uploadCommand += ' --force-git';
    }
    
    if (options.checkRepo) {
      uploadCommand += ' --check-repo';
    }
    
    // Liệt kê các file trong thư mục tạm để debug
    console.log(`🔍 Danh sách file trong thư mục tạm (${tempDir}):`);
    try {
      const files = execSync(`find ${tempDir} -type f | sort`, { encoding: 'utf8' });
      console.log(files);
    } catch (error) {
      console.log(`⚠️ Không thể liệt kê file: ${error.message}`);
    }
    
    let urls = [];
    
    try {
      // Sử dụng stdio: 'pipe' để có thể lấy output
      const output = execSync(uploadCommand, { encoding: 'utf8' });
      
      // Parse output để lấy thông tin URL
      const urlRegex = /Markdown: !\[([^\]]*)\]\(([^)]+)\)/g;
      let urlMatch;
      
      while ((urlMatch = urlRegex.exec(output)) !== null) {
        const altText = urlMatch[1];
        const url = urlMatch[2];
        urls.push({ altText, url });
      }
      
      console.log(`✅ Đã tìm thấy ${urls.length} URL từ output.`);
      
      // Nếu không tìm thấy URL nào, hiển thị output để debug
      if (urls.length === 0) {
        console.log('⚠️ Không tìm thấy URL nào từ output. Dưới đây là output đầy đủ:');
        console.log(output);
      }
    } catch (error) {
      console.error(`❌ Lỗi khi upload ảnh: ${error.message}`);
      return false;
    }
    
    // Tạo map để lưu URL mới cho từng ảnh
    const imageUrlMap = {
      frontmatter: {},
      content: {}
    };
    
    // Map URL mới cho từng ảnh
    for (let i = 0; i < images.length && i < urls.length; i++) {
      const image = images[i];
      const url = urls[i].url;
      
      if (image.inFrontmatter) {
        // Nếu là ảnh trong frontmatter
        imageUrlMap.frontmatter[image.frontmatterField] = url;
        console.log(`✅ Đã cập nhật ảnh trong frontmatter (${image.frontmatterField}): ${path.basename(image.fullPath)} -> ${url}`);
      } else {
        // Nếu là ảnh trong nội dung
        imageUrlMap.content[image.match] = `![${image.altText}](${url})`;
        console.log(`✅ Đã cập nhật ảnh trong nội dung: ${path.basename(image.fullPath)} -> ${url}`);
      }
    }
    
    // Cập nhật đường dẫn ảnh trong tất cả các phiên bản ngôn ngữ của bài viết
    for (const version of langVersions) {
      const updated = updateImagePathsInPost(version.path, imageUrlMap);
      if (updated) {
        console.log(`✅ Đã cập nhật bài viết: ${version.path}`);
      }
    }
    
    // Xóa ảnh gốc nếu không giữ lại
    if (!options.keep) {
      for (const image of images) {
        if (fs.existsSync(image.fullPath)) {
          fs.unlinkSync(image.fullPath);
          console.log(`🗑️ Đã xóa ảnh gốc: ${image.fullPath}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi xử lý bài viết ${postPath}: ${error.message}`);
    return false;
  }
}

// Hàm chính để xử lý ảnh trong bài viết
async function main() {
  try {
    // Tạo thư mục tạm để lưu ảnh
    const tempDir = path.join(process.cwd(), '.temp-images');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    if (options.all) {
      // Xử lý tất cả các bài viết
      const posts = findAllPosts();
      
      if (posts.length === 0) {
        console.log('⚠️ Không tìm thấy bài viết nào.');
        process.exit(0);
      }
      
      console.log(`🔍 Tìm thấy ${posts.length} bài viết để xử lý.`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < posts.length; i++) {
        const postPath = posts[i];
        console.log(`\n[${i + 1}/${posts.length}] Đang xử lý bài viết: ${postPath}`);
        
        const success = await processPost(postPath);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      console.log(`\n✅ Đã xử lý ${successCount}/${posts.length} bài viết thành công.`);
      if (failCount > 0) {
        console.log(`⚠️ Có ${failCount} bài viết xử lý thất bại.`);
      }
    } else {
      // Xử lý một bài viết cụ thể
      await processPost(options.post);
    }
    
    // Xóa thư mục tạm nếu còn tồn tại
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
  } catch (error) {
    console.error(`❌ Lỗi: ${error.message}`);
    process.exit(1);
  }
}

// Chạy hàm chính
main();