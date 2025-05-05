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
    
    console.log(`🔍 Đang xử lý ảnh: ${imagePath}`);
    
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
        console.log(`✅ Đã tạo thư mục: ${destPath}`);
      }
      
      // Copy ảnh vào repository
      destFilePath = path.join(destPath, fileName);
    } else {
      // Tạo thư mục đích trong repository
      const destPath = path.join(tempDir, destFolder);
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
        console.log(`✅ Đã tạo thư mục: ${destPath}`);
      }
      
      // Copy ảnh vào repository
      destFilePath = path.join(destPath, fileName);
    }
    
    // Copy ảnh vào repository
    try {
      // Kiểm tra xem file đích đã tồn tại chưa
      const fileExists = fs.existsSync(destFilePath);
      
      console.log(`🔍 Đang copy ảnh từ ${imagePath} (${fs.statSync(imagePath).size} bytes) vào ${destFilePath}`);
      
      // Copy ảnh vào repository
      fs.copyFileSync(imagePath, destFilePath);
      
      // Kiểm tra xem file đã được copy thành công chưa
      if (fs.existsSync(destFilePath)) {
        const fileSize = fs.statSync(destFilePath).size;
        console.log(`✅ Đã copy ảnh thành công: ${destFilePath} (${fileSize} bytes)`);
      } else {
        console.error(`❌ Copy thất bại: File đích không tồn tại sau khi copy`);
        return null;
      }
      
      // Kiểm tra xem file có thay đổi không nếu đã tồn tại
      if (fileExists) {
        try {
          // Thêm file vào git để theo dõi thay đổi
          console.log(`🔍 Đang thêm file vào git: ${destFilePath}`);
          execSync(`git add "${destFilePath}"`, { stdio: 'inherit' });
          
          // Kiểm tra xem file có thay đổi không
          const fileStatus = execSync(`git status --porcelain "${destFilePath}"`, { encoding: 'utf8' });
          
          if (fileStatus.trim() === '') {
            console.log(`ℹ️ File ${path.basename(destFilePath)} không có thay đổi.`);
          } else {
            console.log(`✅ File ${path.basename(destFilePath)} đã thay đổi và sẽ được commit: ${fileStatus}`);
          }
        } catch (gitError) {
          console.error(`❌ Không thể kiểm tra trạng thái git cho file: ${gitError.message}`);
          // Thử lại với đường dẫn tương đối
          try {
            const relativeFilePath = path.relative(tempDir, destFilePath);
            console.log(`🔍 Thử lại với đường dẫn tương đối: ${relativeFilePath}`);
            execSync(`git add "${relativeFilePath}"`, { stdio: 'inherit', cwd: tempDir });
          } catch (retryError) {
            console.error(`❌ Vẫn không thể thêm file vào git: ${retryError.message}`);
          }
        }
      } else {
        console.log(`✅ Đã thêm file mới: ${path.basename(destFilePath)}`);
        
        // Thêm file mới vào git
        try {
          console.log(`🔍 Đang thêm file mới vào git: ${destFilePath}`);
          execSync(`git add "${destFilePath}"`, { stdio: 'inherit' });
          
          // Kiểm tra xem file đã được thêm vào git chưa
          const gitStatus = execSync(`git status --porcelain "${destFilePath}"`, { encoding: 'utf8' });
          console.log(`🔍 Trạng thái git của file: ${gitStatus || 'Không có thay đổi'}`);
        } catch (gitError) {
          console.error(`❌ Không thể thêm file vào git: ${gitError.message}`);
          // Thử lại với đường dẫn tương đối
          try {
            const relativeFilePath = path.relative(tempDir, destFilePath);
            console.log(`🔍 Thử lại với đường dẫn tương đối: ${relativeFilePath}`);
            execSync(`git add "${relativeFilePath}"`, { stdio: 'inherit', cwd: tempDir });
          } catch (retryError) {
            console.error(`❌ Vẫn không thể thêm file vào git: ${retryError.message}`);
          }
        }
      }
    } catch (copyError) {
      console.error(`❌ Lỗi khi copy ảnh: ${copyError.message}`);
      return null;
    }
    
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
      // Xóa thư mục tạm nếu đã tồn tại
      if (fs.existsSync(tempDir)) {
        console.log(`🔄 Xóa thư mục tạm cũ: ${tempDir}`);
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      
      // Clone repository với --verbose để xem chi tiết
      console.log(`🔄 Clone repository với lệnh: git clone ${IMAGE_REPO_URL} ${tempDir}`);
      execSync(`git clone ${IMAGE_REPO_URL} ${tempDir}`, { stdio: 'inherit' });
      
      // Kiểm tra xem clone thành công không
      if (!fs.existsSync(path.join(tempDir, '.git'))) {
        throw new Error('Clone không thành công, không tìm thấy thư mục .git');
      }
      
      // Kiểm tra remote URL
      process.chdir(tempDir);
      const remoteUrl = execSync('git remote -v', { encoding: 'utf8' });
      console.log(`🔍 Remote URL: ${remoteUrl}`);
      
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
        console.log('🔄 Commit file README.md...');
        execSync('git add README.md', { stdio: 'inherit' });
        execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
        
        // Kiểm tra xem nhánh đã tồn tại chưa
        const branches = execSync('git branch -a', { encoding: 'utf8' });
        console.log(`🔍 Các nhánh hiện có: ${branches}`);
        const hasBranch = branches.includes(`remotes/origin/${IMAGE_REPO_BRANCH}`);
        
        if (!hasBranch) {
          // Tạo nhánh mới nếu chưa tồn tại
          console.log(`ℹ️ Đang tạo nhánh ${IMAGE_REPO_BRANCH}...`);
          execSync(`git checkout -b ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
        }
        
        console.log(`🔄 Push lên nhánh ${IMAGE_REPO_BRANCH}...`);
        execSync(`git push -u origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
      } else {
        // Kiểm tra các nhánh hiện có
        const branches = execSync('git branch -a', { encoding: 'utf8' });
        console.log(`🔍 Các nhánh hiện có: ${branches}`);
        
        // Chuyển sang nhánh main
        console.log(`🔄 Chuyển sang nhánh ${IMAGE_REPO_BRANCH}...`);
        
        // Kiểm tra xem nhánh local đã tồn tại chưa
        const hasLocalBranch = branches.includes(`* ${IMAGE_REPO_BRANCH}`) || branches.includes(`  ${IMAGE_REPO_BRANCH}`);
        
        if (hasLocalBranch) {
          execSync(`git checkout ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
        } else {
          // Kiểm tra xem nhánh remote đã tồn tại chưa
          const hasRemoteBranch = branches.includes(`remotes/origin/${IMAGE_REPO_BRANCH}`);
          
          if (hasRemoteBranch) {
            execSync(`git checkout -b ${IMAGE_REPO_BRANCH} origin/${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          } else {
            execSync(`git checkout -b ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          }
        }
        
        // Pull các thay đổi mới nhất
        console.log(`🔄 Pull các thay đổi mới nhất từ nhánh ${IMAGE_REPO_BRANCH}...`);
        try {
          execSync(`git pull origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
        } catch (pullError) {
          console.warn(`⚠️ Không thể pull từ remote: ${pullError.message}`);
        }
      }
      
      // Trở về thư mục gốc
      process.chdir(process.cwd());
      
      // Liệt kê các file trong repository
      console.log('🔍 Danh sách file trong repository:');
      const files = execSync(`find ${tempDir} -type f -not -path "*/\\.git/*" | sort`, { encoding: 'utf8' });
      console.log(files || 'Không có file nào.');
      
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
      // Liệt kê các file trong thư mục để debug
      console.log('🔍 Danh sách file trong thư mục:');
      const files = execSync('find . -type f -not -path "*/\\.git/*" | sort', { encoding: 'utf8' });
      console.log(files);
      
      // Thử thêm tất cả các file một lần nữa
      console.log('🔄 Thử thêm tất cả các file một lần nữa...');
      execSync('git add -A', { stdio: 'inherit' });
      
      // Kiểm tra lại
      const newStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (newStatus.trim() === '') {
        console.log('ℹ️ Vẫn không có thay đổi nào để commit.');
        
        // Tạo một file tạm để đảm bảo có thay đổi
        const tempFile = path.join(tempDir, '.upload-timestamp');
        fs.writeFileSync(tempFile, `Upload timestamp: ${new Date().toISOString()}\nUploaded images: ${results.map(r => r.fileName).join(', ')}`);
        execSync(`git add "${tempFile}"`, { stdio: 'inherit' });
        
        console.log('✅ Đã tạo file tạm để đảm bảo có thay đổi.');
      } else {
        console.log('✅ Đã tìm thấy thay đổi sau khi thêm lại:');
        console.log(newStatus);
      }
    } else {
      console.log('🔄 Các thay đổi được phát hiện:');
      console.log(status);
    }
    
    // Thêm tất cả các file một lần nữa để đảm bảo
    execSync('git add -A', { stdio: 'inherit' });
    
    // Thêm tất cả các file và commit
    console.log('🔄 Thêm tất cả các file vào git...');
    execSync('git add -A', { stdio: 'inherit' });
    
    console.log('🔄 Đang commit với message:', options.message);
    
    // Đảm bảo git config được thiết lập
    try {
      const userEmail = execSync('git config user.email', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
      const userName = execSync('git config user.name', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
      
      if (!userEmail || !userName) {
        console.log('ℹ️ Thiết lập cấu hình git tạm thời...');
        execSync('git config --local user.email "temp@example.com"', { stdio: 'inherit' });
        execSync('git config --local user.name "Temporary User"', { stdio: 'inherit' });
      }
    } catch (configError) {
      console.log('ℹ️ Thiết lập cấu hình git tạm thời...');
      execSync('git config --local user.email "temp@example.com"', { stdio: 'inherit' });
      execSync('git config --local user.name "Temporary User"', { stdio: 'inherit' });
    }
    
    try {
      // Thử commit bình thường
      execSync(`git commit -m "${options.message}"`, { stdio: 'inherit' });
      console.log('✅ Commit thành công!');
    } catch (commitError) {
      console.log(`ℹ️ Lỗi khi commit: ${commitError.message}`);
      
      // Kiểm tra xem có thay đổi nào để commit không
      const statusAfterAdd = execSync('git status --porcelain', { encoding: 'utf8' });
      if (statusAfterAdd.trim() === '') {
        console.log('ℹ️ Không có thay đổi nào để commit sau khi git add.');
        // Tạo một file tạm khác để đảm bảo có thay đổi
        const tempFile = path.join(tempDir, '.commit-timestamp');
        fs.writeFileSync(tempFile, `Commit timestamp: ${new Date().toISOString()}\nForced commit for: ${results.map(r => r.fileName).join(', ')}`);
        execSync(`git add "${tempFile}"`, { stdio: 'inherit' });
        console.log('✅ Đã tạo file tạm mới để đảm bảo có thay đổi.');
        
        // Thử commit lại
        
        try {
          execSync(`git commit -m "${options.message} (forced commit)"`, { stdio: 'inherit' });
          console.log('✅ Commit thành công với file tạm mới!');
        } catch (forcedCommitError) {
          console.error(`❌ Vẫn không thể commit: ${forcedCommitError.message}`);
          // Tiếp tục với push dù không có commit mới
        }
      } else {
        console.log('ℹ️ Có thay đổi nhưng không thể commit:');
        console.log(statusAfterAdd);
        
        // Thử commit với --allow-empty
        console.log('🔄 Thử commit với --allow-empty...');
        try {
          execSync(`git commit --allow-empty -m "${options.message} (empty commit)"`, { stdio: 'inherit' });
          console.log('✅ Commit thành công với --allow-empty!');
        } catch (emptyCommitError) {
          console.error(`❌ Vẫn không thể commit: ${emptyCommitError.message}`);
          // Tiếp tục với push dù không có commit mới
        }
      }
    }
      
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
        
        // Kiểm tra xem có commit nào để push không
        let localCommits = '';
        try {
    // Kiểm tra xem nhánh remote có tồn tại không
          const remoteBranchExists = execSync(`git ls-remote --heads origin ${IMAGE_REPO_BRANCH}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim() !== '';
          
          if (remoteBranchExists) {
            localCommits = execSync(`git log origin/${IMAGE_REPO_BRANCH}..HEAD --oneline`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
          } else {
            // Nếu nhánh remote không tồn tại, lấy tất cả commit
            localCommits = execSync(`git log --oneline`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
            console.log(`ℹ️ Nhánh ${IMAGE_REPO_BRANCH} chưa tồn tại trên remote, sẽ push tất cả commit.`);
          }
        } catch (logError) {
          console.log(`ℹ️ Không thể kiểm tra commit cần push: ${logError.message}`);
          console.log(`ℹ️ Có thể nhánh remote chưa tồn tại hoặc không có commit nào.`);
          
          // Đặt localCommits thành một giá trị không rỗng để đảm bảo push được thực hiện
          localCommits = "force-push-required";
        }
        
        if (localCommits) {
          if (localCommits === "force-push-required") {
            console.log(`ℹ️ Không thể xác định commit cần push, sẽ thực hiện force push.`);
          } else {
                  console.log(`✅ Có ${localCommits.split('\n').length} commit(s) cần push:`);
            console.log(localCommits);
          }
        } else {
          console.log(`⚠️ Không có commit nào cần push. Kiểm tra lại quá trình commit.`);
          
          // Hiển thị lịch sử commit gần đây
          console.log(`ℹ️ Lịch sử commit gần đây:`);
          try {
            const recentCommits = execSync(`git log -n 5 --oneline`, { encoding: 'utf8' });
            console.log(recentCommits || 'Không có commit nào.');
            
            // Đặt localCommits thành một giá trị không rỗng để đảm bảo push được thực hiện
            if (recentCommits) {
              localCommits = "force-push-required";
              console.log(`ℹ️ Có commit nhưng không thể xác định cần push, sẽ thực hiện force push.`);
            }
          } catch (logError) {
            console.log(`Không thể hiển thị lịch sử commit: ${logError.message}`);
          }
        }
        
        try {
          // Thử pull trước để đảm bảo không có xung đột
          try {
            console.log(`ℹ️ Đang pull các thay đổi mới nhất trước khi push...`);
            execSync(`git pull --rebase origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
          } catch (pullError) {
            console.warn(`⚠️ Không thể pull từ remote: ${pullError.message}`);
            console.log(`ℹ️ Tiếp tục mà không pull...`);
          }
          
          // Kiểm tra trạng thái git trước khi push
          console.log(`🔍 Kiểm tra trạng thái git trước khi push...`);
          const gitStatus = execSync('git status', { encoding: 'utf8' });
          console.log(gitStatus);
          
          // Kiểm tra xem có gì để commit không
          const hasChanges = execSync('git status --porcelain', { encoding: 'utf8' }).trim() !== '';
          
          if (hasChanges) {
            console.log(`⚠️ Vẫn còn thay đổi chưa được commit. Thử commit lại...`);
            try {
              execSync('git add -A', { stdio: 'inherit' });
              execSync(`git commit -m "Add remaining changes"`, { stdio: 'inherit' });
            } catch (lastCommitError) {
              console.warn(`⚠️ Không thể commit các thay đổi còn lại: ${lastCommitError.message}`);
            }
          }
          
          // Kiểm tra lại xem có commit nào để push không
          try {
            const commitsToPush = execSync('git log @{u}..HEAD --oneline', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
            if (commitsToPush) {
              console.log(`✅ Có commit cần push: ${commitsToPush}`);
            } else {
              console.log(`⚠️ Không có commit nào cần push. Tạo empty commit...`);
              try {
                execSync('git commit --allow-empty -m "Force update repository"', { stdio: 'inherit' });
              } catch (emptyCommitError) {
                console.warn(`⚠️ Không thể tạo empty commit: ${emptyCommitError.message}`);
              }
            }
          } catch (logError) {
            console.warn(`⚠️ Không thể kiểm tra commit cần push: ${logError.message}`);
          }
          
          // Thử push
          console.log(`🔄 Đang push lên nhánh ${IMAGE_REPO_BRANCH}...`);
          
          // Nếu localCommits là "force-push-required" hoặc options.forceGit là true, thực hiện force push
          if (localCommits === "force-push-required" || options.forceGit) {
            console.log(`ℹ️ Đang thực hiện force push...`);
            execSync(`git push -f -u origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
            console.log(`✅ Force push thành công!`);
          } else {
            // Thử push bình thường trước
            try {
              execSync(`git push -u origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
              console.log(`✅ Push thành công!`);
            } catch (normalPushError) {
              console.warn(`⚠️ Không thể push bình thường: ${normalPushError.message}`);
              
              // Thử force push nếu push bình thường thất bại
              console.log(`ℹ️ Đang thử force push...`);
              execSync(`git push -f -u origin ${IMAGE_REPO_BRANCH}`, { stdio: 'inherit' });
              console.log(`✅ Force push thành công!`);
            }
          }
        } catch (pushError) {
          console.error(`❌ Không thể push lên remote: ${pushError.message}`);
          console.error(`   Kiểm tra lại kết nối mạng và quyền truy cập vào repository.`);
          process.exit(1);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi làm việc với Git: ${error.message}`);
        process.exit(1);
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