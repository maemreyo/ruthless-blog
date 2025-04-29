#!/usr/bin/env node

/**
 * Script để upload ảnh lên repository hình ảnh và tạo URL jsDelivr
 * Sử dụng: node scripts/upload-images.js --image path/to/image.jpg --folder posts/2023/05
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Cấu hình repository hình ảnh
const IMAGE_REPO_URL = 'git@github.com:maemreyo/wehttam-blog-images.git';
const IMAGE_REPO_NAME = 'wehttam-blog-images';
const IMAGE_REPO_BRANCH = 'main';
const GITHUB_USERNAME = 'maemreyo';

// URL cho các dịch vụ khác nhau
// jsDelivr có nhiều cách định dạng URL:
// 1. Sử dụng tag/release: https://cdn.jsdelivr.net/gh/user/repo@tag/file
// 2. Sử dụng commit: https://cdn.jsdelivr.net/gh/user/repo@hash/file
// 3. Sử dụng branch: https://cdn.jsdelivr.net/gh/user/repo@branch/file (không khuyến nghị cho production)
// 4. Không chỉ định version: https://cdn.jsdelivr.net/gh/user/repo/file (luôn lấy từ master/main)
const JSDELIVR_BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${IMAGE_REPO_NAME}`;
const JSDELIVR_VERSIONED_URL = `${JSDELIVR_BASE_URL}@${IMAGE_REPO_BRANCH}`;
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${IMAGE_REPO_NAME}/${IMAGE_REPO_BRANCH}`;
const GITHUB_BLOB_URL = `https://github.com/${GITHUB_USERNAME}/${IMAGE_REPO_NAME}/blob/${IMAGE_REPO_BRANCH}`;

// Cấu hình mặc định
const DEFAULT_IMAGE_SERVICE = 'jsdelivr-latest'; // 'jsdelivr-latest', 'jsdelivr-versioned', 'github-raw', 'github-blob'

// Cấu hình command line options
program
  .option('-i, --image <path>', 'Đường dẫn đến ảnh cần upload')
  .option('-d, --directory <directory>', 'Đường dẫn đến thư mục chứa nhiều ảnh')
  .option('-f, --folder <folder>', 'Thư mục đích trong repository hình ảnh (nếu không giữ cấu trúc)', 'uploads')
  .option('-m, --message <message>', 'Commit message', 'Add new images')
  .option('-c, --copy', 'Tự động copy URL vào clipboard', false)
  .option('-p, --prefix <prefix>', 'Tiền tố cho tên file', '')
  .option('--optimize', 'Tối ưu hóa ảnh trước khi upload', false)
  .option('--preserve-structure', 'Giữ nguyên cấu trúc thư mục trong thư mục đích', false)
  .option('--service <service>', 'Dịch vụ URL hình ảnh (jsdelivr, github-raw, github-blob)', DEFAULT_IMAGE_SERVICE)
  .option('--force-git', 'Force push lên Git repository nếu cần', false)
  .option('--check-repo', 'Kiểm tra xem repository có phải là public không', false);

program.parse(process.argv);

const options = program.opts();

// Kiểm tra xem có ảnh được chỉ định không
if (!options.image && !options.directory) {
  console.error('Lỗi: Bạn phải chỉ định ảnh (--image) hoặc thư mục chứa ảnh (--directory)');
  program.help();
  process.exit(1);
}

// Tạo thư mục tạm để clone repository
const tempDir = path.join(process.cwd(), '.temp-image-repo');

// Hàm để tạo tên file ngẫu nhiên nếu cần
function generateRandomFileName(originalName) {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(4).toString('hex');
  
  if (options.prefix) {
    return `${options.prefix}-${baseName}-${timestamp}-${randomString}${ext}`;
  }
  
  return `${baseName}-${timestamp}-${randomString}${ext}`;
}

// Hàm để tối ưu hóa ảnh (cần cài đặt sharp)
function optimizeImage(imagePath) {
  try {
    // Kiểm tra xem sharp đã được cài đặt chưa
    require.resolve('sharp');
    
    const sharp = require('sharp');
    const optimizedPath = imagePath + '.optimized';
    
    // Tối ưu hóa ảnh với sharp
    sharp(imagePath)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(optimizedPath)
      .then(() => {
        fs.renameSync(optimizedPath, imagePath);
        console.log(`✅ Đã tối ưu hóa ảnh: ${imagePath}`);
      })
      .catch(err => {
        console.error(`❌ Lỗi khi tối ưu hóa ảnh: ${err.message}`);
      });
  } catch (error) {
    console.warn('⚠️ Thư viện sharp chưa được cài đặt. Bỏ qua bước tối ưu hóa ảnh.');
    console.warn('   Cài đặt sharp: npm install sharp --save-dev');
  }
}

// Hàm để upload một ảnh
function uploadImage(imagePath, destFolder) {
  try {
    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Không tìm thấy file: ${imagePath}`);
      return null;
    }
    
    // Tạo tên file mới nếu cần
    const fileName = options.prefix ? generateRandomFileName(path.basename(imagePath)) : path.basename(imagePath);
    
    // Tối ưu hóa ảnh nếu được yêu cầu
    if (options.optimize) {
      optimizeImage(imagePath);
    }
    
    let finalDestFolder = destFolder;
    let destFilePath;
    
    // Nếu giữ cấu trúc thư mục và đường dẫn có chứa cấu trúc thư mục
    if (options.preserveStructure) {
      // Lấy đường dẫn tương đối từ thư mục gốc
      const relativePath = path.relative(options.directory, path.dirname(imagePath));
      
      if (relativePath && relativePath !== '.') {
        // Nếu ảnh nằm trong thư mục con, sử dụng cấu trúc thư mục đó
        finalDestFolder = relativePath.replace(/\\/g, '/');
      }
      
      // Tạo thư mục đích trong repository
      const destPath = path.join(tempDir, finalDestFolder);
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      // Copy ảnh vào repository
      destFilePath = path.join(destPath, fileName);
    } else {
      // Tạo thư mục đích trong repository
      const destPath = path.join(tempDir, destFolder);
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      // Copy ảnh vào repository
      destFilePath = path.join(destPath, fileName);
    }
    
    // Copy ảnh vào repository
    fs.copyFileSync(imagePath, destFilePath);
    
    // Tạo URL cho ảnh
    const relativePath = path.join(finalDestFolder, fileName).replace(/\\/g, '/');
    const jsdelivrLatestUrl = `${JSDELIVR_BASE_URL}/${relativePath}`;
    const jsdelivrVersionedUrl = `${JSDELIVR_VERSIONED_URL}/${relativePath}`;
    const githubRawUrl = `${GITHUB_RAW_URL}/${relativePath}`;
    const githubBlobUrl = `${GITHUB_BLOB_URL}/${relativePath}`;
    
    // Xác định URL dựa trên service được chọn
    let imageUrl;
    switch (options.service.toLowerCase()) {
      case 'github-raw':
        imageUrl = githubRawUrl;
        break;
      case 'github-blob':
        imageUrl = githubBlobUrl;
        break;
      case 'jsdelivr-versioned':
        imageUrl = jsdelivrVersionedUrl;
        break;
      case 'jsdelivr-latest':
      case 'jsdelivr':
      default:
        imageUrl = jsdelivrLatestUrl;
        break;
    }
    
    return {
      fileName,
      relativePath,
      jsdelivrLatestUrl,
      jsdelivrVersionedUrl,
      githubRawUrl,
      githubBlobUrl,
      imageUrl,
      selectedService: options.service,
      markdownLink: `![${path.basename(fileName, path.extname(fileName))}](${imageUrl})`
    };
  } catch (error) {
    console.error(`❌ Lỗi khi upload ảnh ${imagePath}: ${error.message}`);
    return null;
  }
}

// Hàm để kiểm tra xem repository có phải là public không
async function checkRepositoryVisibility() {
  try {
    // Sử dụng GitHub API để kiểm tra
    const { execSync } = require('child_process');
    const repoApiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${IMAGE_REPO_NAME}`;
    
    console.log(`🔍 Đang kiểm tra trạng thái repository...`);
    
    // Sử dụng curl để gọi GitHub API
    const result = execSync(`curl -s ${repoApiUrl}`, { encoding: 'utf8' });
    const repoInfo = JSON.parse(result);
    
    if (repoInfo.private === true) {
      console.warn(`⚠️ Repository ${IMAGE_REPO_NAME} là private.`);
      
      if (options.service === 'jsdelivr') {
        console.warn(`⚠️ jsDelivr có thể không hoạt động với private repository.`);
        console.warn(`   Bạn nên chuyển repository sang public hoặc sử dụng service khác.`);
        
        // Hỏi người dùng có muốn tiếp tục không
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        return new Promise((resolve) => {
          readline.question('Bạn có muốn tiếp tục? (y/N): ', (answer) => {
            readline.close();
            if (answer.toLowerCase() !== 'y') {
              console.log('❌ Đã hủy upload.');
              process.exit(0);
            }
            resolve();
          });
        });
      }
    } else {
      console.log(`✅ Repository ${IMAGE_REPO_NAME} là public, phù hợp với jsDelivr.`);
    }
  } catch (error) {
    console.warn(`⚠️ Không thể kiểm tra trạng thái repository: ${error.message}`);
    console.warn(`   Tiếp tục mà không kiểm tra...`);
  }
}

// Hàm chính để thực hiện upload
async function main() {
  try {
    // Kiểm tra repository nếu được yêu cầu
    if (options.checkRepo) {
      await checkRepositoryVisibility();
    }
    
    // Xóa thư mục tạm nếu đã tồn tại
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    // Clone repository hình ảnh
    console.log(`🔄 Đang clone repository ${IMAGE_REPO_URL}...`);
    try {
      execSync(`git clone ${IMAGE_REPO_URL} ${tempDir}`, { stdio: 'inherit' });
      
      // Kiểm tra xem repository có trống không
      const isEmptyRepo = fs.readdirSync(tempDir).filter(item => item !== '.git').length === 0;
      
      if (isEmptyRepo) {
        console.log('ℹ️ Repository trống, đang khởi tạo...');
        
        // Tạo file README.md
        fs.writeFileSync(path.join(tempDir, 'README.md'), 
          `# ${IMAGE_REPO_NAME}\n\nRepository lưu trữ hình ảnh cho blog.\n`);
        
        // Tạo thư mục uploads
        fs.mkdirSync(path.join(tempDir, 'uploads'), { recursive: true });
        
        // Commit file README.md
        process.chdir(tempDir);
        execSync('git add README.md', { stdio: 'inherit' });
        execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
        
        // Kiểm tra xem nhánh đã tồn tại chưa
        const branches = execSync('git branch -a', { encoding: 'utf8' });
        const hasBranch = branches.includes(`remotes/origin/${IMAGE_REPO_BRANCH}`);
        
        if (!hasBranch) {
          // Tạo nhánh mới nếu chưa tồn tại
          console.log(`ℹ️ Đang tạo nhánh ${IMAGE_REPO_BRANCH}...`);
          execSync(`git checkout -b ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
        }
        
        execSync(`git push -u origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
        process.chdir(process.cwd());
      }
    } catch (error) {
      console.error(`❌ Lỗi khi clone repository: ${error.message}`);
      console.log('ℹ️ Đảm bảo bạn đã thiết lập SSH key và có quyền truy cập vào repository.');
      process.exit(1);
    }
    
    // Danh sách kết quả
    const results = [];
    
    // Upload một ảnh hoặc nhiều ảnh
    if (options.image) {
      // Upload một ảnh
      const result = uploadImage(options.image, options.folder);
      if (result) {
        results.push(result);
      }
    } else if (options.directory) {
      // Upload nhiều ảnh từ thư mục
      const dirPath = options.directory;
      if (!fs.existsSync(dirPath)) {
        console.error(`❌ Không tìm thấy thư mục: ${dirPath}`);
        process.exit(1);
      }
      
      // Hàm đệ quy để tìm tất cả các file ảnh trong thư mục và các thư mục con
      function findAllImages(dir) {
        let results = [];
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            // Đệ quy vào thư mục con
            results = results.concat(findAllImages(itemPath));
          } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item)) {
            // Thêm file ảnh vào kết quả
            results.push(itemPath);
          }
        }
        
        return results;
      }
      
      // Tìm tất cả các file ảnh trong thư mục và các thư mục con
      const imageFiles = findAllImages(dirPath);
      
      if (imageFiles.length === 0) {
        console.warn('⚠️ Không tìm thấy ảnh nào trong thư mục.');
        process.exit(0);
      }
      
      console.log(`🔍 Tìm thấy ${imageFiles.length} ảnh trong thư mục.`);
      
      for (const filePath of imageFiles) {
        // Xác định thư mục đích dựa trên cấu trúc thư mục gốc
        const relativePath = path.relative(dirPath, path.dirname(filePath));
        const destFolder = options.preserveStructure && relativePath !== '' 
          ? path.join(options.folder, relativePath).replace(/\\/g, '/') 
          : options.folder;
          
        const result = uploadImage(filePath, destFolder);
        if (result) {
          results.push(result);
        }
      }
    }
    
    // Nếu không có ảnh nào được upload thành công
    if (results.length === 0) {
      console.error('❌ Không có ảnh nào được upload thành công.');
      process.exit(1);
    }
    
    // Commit và push thay đổi
    console.log(`🔄 Đang commit và push thay đổi...`);
    process.chdir(tempDir);
    
    // Kiểm tra xem có thay đổi nào không
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim() === '') {
      console.log('ℹ️ Không có thay đổi nào để commit.');
    } else {
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "${options.message}"`, { stdio: 'inherit' });
      
      // Kiểm tra xem nhánh hiện tại là gì
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      
      // Kiểm tra xem nhánh đã tồn tại trên remote chưa
      try {
        const remoteBranches = execSync('git branch -r', { encoding: 'utf8' });
        const hasRemoteBranch = remoteBranches.includes(`origin/${IMAGE_REPO_BRANCH}`);
        
        if (currentBranch !== IMAGE_REPO_BRANCH) {
          if (hasRemoteBranch) {
            // Nếu nhánh đã tồn tại trên remote, checkout và pull
            console.log(`ℹ️ Đang chuyển sang nhánh ${IMAGE_REPO_BRANCH}...`);
            execSync(`git checkout ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
            console.log(`ℹ️ Đang pull các thay đổi mới nhất...`);
            execSync(`git pull origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          } else {
            // Nếu nhánh chưa tồn tại trên remote, tạo mới
            console.log(`ℹ️ Đang tạo nhánh mới ${IMAGE_REPO_BRANCH}...`);
            execSync(`git checkout -b ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          }
        } else if (hasRemoteBranch) {
          // Nếu đang ở đúng nhánh và nhánh đã tồn tại trên remote, pull
          console.log(`ℹ️ Đang pull các thay đổi mới nhất...`);
          try {
            execSync(`git pull origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          } catch (pullError) {
            console.warn(`⚠️ Không thể pull từ remote: ${pullError.message}`);
            console.log(`ℹ️ Thử pull với --allow-unrelated-histories...`);
            execSync(`git pull --allow-unrelated-histories origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          }
        }
        
        // Push lên remote
        console.log(`ℹ️ Đang push lên remote...`);
        try {
          execSync(`git push -u origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
        } catch (pushError) {
          console.warn(`⚠️ Không thể push lên remote: ${pushError.message}`);
          
          // Kiểm tra xem có tùy chọn force push không
          if (options.forceGit) {
            console.log(`ℹ️ Đang thực hiện force push theo yêu cầu...`);
            execSync(`git push -f -u origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          } else {
            console.error(`❌ Push thất bại. Thử lại với tùy chọn --force-git để force push.`);
            console.error(`   Lưu ý: Force push có thể gây mất dữ liệu trên remote.`);
            process.exit(1);
          }
        }
      } catch (error) {
        console.error(`❌ Lỗi khi làm việc với Git: ${error.message}`);
        process.exit(1);
      }
    }
    
    // Hiển thị kết quả
    console.log('\n✅ Upload thành công!');
    console.log('\n📋 Danh sách URL:');
    
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.fileName}:`);
      console.log(`   jsDelivr Latest URL: ${result.jsdelivrLatestUrl}`);
      console.log(`   jsDelivr Versioned URL: ${result.jsdelivrVersionedUrl}`);
      console.log(`   GitHub Raw URL: ${result.githubRawUrl}`);
      console.log(`   GitHub Blob URL: ${result.githubBlobUrl}`);
      console.log(`   Đang sử dụng: ${result.selectedService} (${result.imageUrl})`);
      console.log(`   Markdown: ${result.markdownLink}`);
      
      // Hiển thị thông tin về jsDelivr
      if (result.selectedService.includes('jsdelivr')) {
        console.log('   ℹ️ Lưu ý về jsDelivr:');
        console.log('      - Có thể mất vài phút để jsDelivr cập nhật cache sau khi push');
        console.log('      - Nếu gặp lỗi "Failed to fetch version info", hãy thử lại sau hoặc sử dụng GitHub Raw URL');
        console.log('      - Đảm bảo repository là public để jsDelivr hoạt động');
      }
      
      // Copy URL vào clipboard nếu được yêu cầu
      if (options.copy && index === 0) {
        try {
          const clipboardy = require('clipboardy');
          clipboardy.writeSync(result.markdownLink);
          console.log('   ✅ Đã copy Markdown link vào clipboard!');
        } catch (error) {
          console.warn('   ⚠️ Không thể copy vào clipboard. Cài đặt clipboardy: npm install clipboardy --save-dev');
        }
      }
    });
    
    // Xóa thư mục tạm
    process.chdir(process.cwd());
    fs.rmSync(tempDir, { recursive: true, force: true });
    
  } catch (error) {
    console.error(`❌ Lỗi: ${error.message}`);
    
    // Xóa thư mục tạm nếu có lỗi
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    process.exit(1);
  }
}

// Chạy hàm chính
main();