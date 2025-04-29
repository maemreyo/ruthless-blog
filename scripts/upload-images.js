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
const JSDELIVR_BASE_URL = `https://cdn.jsdelivr.net/gh/maemreyo/${IMAGE_REPO_NAME}@${IMAGE_REPO_BRANCH}`;

// Cấu hình command line options
program
  .option('-i, --image <path>', 'Đường dẫn đến ảnh cần upload')
  .option('-d, --directory <directory>', 'Đường dẫn đến thư mục chứa nhiều ảnh')
  .option('-f, --folder <folder>', 'Thư mục đích trong repository hình ảnh (nếu không giữ cấu trúc)', 'uploads')
  .option('-m, --message <message>', 'Commit message', 'Add new images')
  .option('-c, --copy', 'Tự động copy URL vào clipboard', false)
  .option('-p, --prefix <prefix>', 'Tiền tố cho tên file', '')
  .option('--optimize', 'Tối ưu hóa ảnh trước khi upload', false)
  .option('--preserve-structure', 'Giữ nguyên cấu trúc thư mục trong thư mục đích', false);

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
    
    // Tạo URL jsDelivr
    const relativePath = path.join(finalDestFolder, fileName).replace(/\\/g, '/');
    const jsdelivrUrl = `${JSDELIVR_BASE_URL}/${relativePath}`;
    
    return {
      fileName,
      relativePath,
      jsdelivrUrl,
      markdownLink: `![${path.basename(fileName, path.extname(fileName))}](${jsdelivrUrl})`
    };
  } catch (error) {
    console.error(`❌ Lỗi khi upload ảnh ${imagePath}: ${error.message}`);
    return null;
  }
}

// Hàm chính để thực hiện upload
async function main() {
  try {
    // Xóa thư mục tạm nếu đã tồn tại
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    // Clone repository hình ảnh
    console.log(`🔄 Đang clone repository ${IMAGE_REPO_URL}...`);
    execSync(`git clone ${IMAGE_REPO_URL} ${tempDir}`, { stdio: 'inherit' });
    
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
      
      const files = fs.readdirSync(dirPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
      
      if (files.length === 0) {
        console.warn('⚠️ Không tìm thấy ảnh nào trong thư mục.');
        process.exit(0);
      }
      
      console.log(`🔍 Tìm thấy ${files.length} ảnh trong thư mục.`);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const result = uploadImage(filePath, options.folder);
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
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${options.message}"`, { stdio: 'inherit' });
    execSync(`git push origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
    
    // Hiển thị kết quả
    console.log('\n✅ Upload thành công!');
    console.log('\n📋 Danh sách URL:');
    
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.fileName}:`);
      console.log(`   URL: ${result.jsdelivrUrl}`);
      console.log(`   Markdown: ${result.markdownLink}`);
      
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