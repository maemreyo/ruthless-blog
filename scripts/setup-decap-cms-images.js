#!/usr/bin/env node

/**
 * Script để cấu hình Decap CMS sử dụng GitHub repository cho hình ảnh
 * Sử dụng: node scripts/setup-decap-cms-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cấu hình repository hình ảnh
const IMAGE_REPO_OWNER = 'maemreyo';
const IMAGE_REPO_NAME = 'ruthless-blog-images';
const IMAGE_REPO_BRANCH = 'main';
const JSDELIVR_BASE_URL = `https://cdn.jsdelivr.net/gh/${IMAGE_REPO_OWNER}/${IMAGE_REPO_NAME}@${IMAGE_REPO_BRANCH}`;

// Đường dẫn đến file cấu hình Decap CMS
const CMS_CONFIG_PATH = path.join(process.cwd(), 'public', 'admin', 'config.yml');

// Kiểm tra xem file cấu hình có tồn tại không
if (!fs.existsSync(CMS_CONFIG_PATH)) {
  console.error(`❌ Không tìm thấy file cấu hình Decap CMS: ${CMS_CONFIG_PATH}`);
  console.log('Bạn cần tạo file cấu hình Decap CMS trước khi chạy script này.');
  process.exit(1);
}

// Đọc nội dung file cấu hình
const configContent = fs.readFileSync(CMS_CONFIG_PATH, 'utf8');

// Kiểm tra xem đã cấu hình media_folder chưa
if (configContent.includes('media_folder:')) {
  console.log('⚠️ File cấu hình đã có cấu hình media_folder.');
  console.log('Bạn có muốn cập nhật cấu hình này không? (y/n)');
  
  // Đọc input từ người dùng
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Đã hủy cập nhật cấu hình.');
      readline.close();
      process.exit(0);
    }
    
    updateConfig();
    readline.close();
  });
} else {
  updateConfig();
}

// Hàm để cập nhật cấu hình
function updateConfig() {
  try {
    // Tạo cấu hình media cho Decap CMS
    const mediaConfig = `
# Media configuration
media_folder: ".media" # Local folder for uploaded media (temporary)
public_folder: ".media" # URL to access media in the CMS (temporary)

# Custom media library using GitHub repository
media_library:
  name: "custom"
  config:
    publicPath: "${JSDELIVR_BASE_URL}"
    mediaPath: ""
    customUploadUrl: "https://api.github.com/repos/${IMAGE_REPO_OWNER}/${IMAGE_REPO_NAME}/contents"
    customUploadHeaders:
      Authorization: "token \${process.env.GITHUB_TOKEN}"
    customUploadParams:
      message: "Upload image from Decap CMS"
      branch: "${IMAGE_REPO_BRANCH}"
`;
    
    // Tạo file JavaScript để xử lý upload ảnh
    const uploadHandlerPath = path.join(process.cwd(), 'public', 'admin', 'upload-handler.js');
    const uploadHandlerContent = `
// Custom upload handler for Decap CMS
window.CMS_MANUAL_INIT = true;

// Initialize CMS with custom config
window.initCMS = function() {
  const config = {};
  
  // Custom upload handler
  config.config = {
    load_config_file: true,
    media_library: {
      name: 'custom',
      config: {
        uploadUrl: 'https://api.github.com/repos/${IMAGE_REPO_OWNER}/${IMAGE_REPO_NAME}/contents',
        publicPath: '${JSDELIVR_BASE_URL}',
        customUpload: async function(file, options) {
          // Get file content as base64
          const reader = new FileReader();
          const fileContent = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
          
          // Extract base64 content
          const base64Content = fileContent.split(',')[1];
          
          // Generate path for the file
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const timestamp = Date.now();
          const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
          const filePath = \`uploads/\${year}/\${month}/\${timestamp}-\${fileName}\`;
          
          // Prepare request data
          const data = {
            message: 'Upload image from Decap CMS',
            content: base64Content,
            branch: '${IMAGE_REPO_BRANCH}'
          };
          
          // Get GitHub token from localStorage
          const token = localStorage.getItem('github_token');
          if (!token) {
            alert('GitHub token not found. Please set it in the CMS settings.');
            throw new Error('GitHub token not found');
          }
          
          // Send request to GitHub API
          const response = await fetch(\`https://api.github.com/repos/${IMAGE_REPO_OWNER}/${IMAGE_REPO_NAME}/contents/\${filePath}\`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`token \${token}\`
            },
            body: JSON.stringify(data)
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(\`GitHub API error: \${error.message}\`);
          }
          
          const result = await response.json();
          
          // Return the jsDelivr URL
          return {
            url: \`${JSDELIVR_BASE_URL}/\${filePath}\`,
            path: filePath
          };
        }
      }
    }
  };
  
  // Initialize CMS
  window.CMS.init(config);
  
  // Add GitHub token input to login page
  const loginPage = document.querySelector('.nc-githubAuthenticationPage');
  if (loginPage) {
    const tokenInput = document.createElement('div');
    tokenInput.innerHTML = \`
      <div style="margin-top: 20px;">
        <label for="github_token" style="display: block; margin-bottom: 5px;">GitHub Personal Access Token:</label>
        <input type="password" id="github_token" style="width: 100%; padding: 8px; margin-bottom: 10px;" 
               value="\${localStorage.getItem('github_token') || ''}" />
        <button id="save_token" style="padding: 8px 16px; background: #798291; color: white; border: none; cursor: pointer;">
          Save Token
        </button>
      </div>
    \`;
    
    loginPage.appendChild(tokenInput);
    
    document.getElementById('save_token').addEventListener('click', function() {
      const token = document.getElementById('github_token').value;
      localStorage.setItem('github_token', token);
      alert('Token saved!');
    });
  }
};

// Call init function when CMS is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.initCMS();
});
`;
    
    // Tạo thư mục admin nếu chưa tồn tại
    const adminDir = path.dirname(uploadHandlerPath);
    if (!fs.existsSync(adminDir)) {
      fs.mkdirSync(adminDir, { recursive: true });
    }
    
    // Ghi file upload handler
    fs.writeFileSync(uploadHandlerPath, uploadHandlerContent);
    console.log(`✅ Đã tạo file upload handler: ${uploadHandlerPath}`);
    
    // Cập nhật file index.html để include upload handler
    const indexPath = path.join(process.cwd(), 'public', 'admin', 'index.html');
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Kiểm tra xem đã include upload handler chưa
      if (!indexContent.includes('upload-handler.js')) {
        // Thêm script tag trước script CMS
        indexContent = indexContent.replace(
          /<script src="https:\/\/unpkg\.com\/netlify-cms@\^2\.0\.0\/dist\/netlify-cms\.js"><\/script>/,
          `<script src="upload-handler.js"></script>\n  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>`
        );
        
        // Thêm CMS_MANUAL_INIT
        indexContent = indexContent.replace(
          /<script src="https:\/\/unpkg\.com\/netlify-cms@\^2\.0\.0\/dist\/netlify-cms\.js"><\/script>/,
          `<script>window.CMS_MANUAL_INIT = true;</script>\n  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>`
        );
        
        fs.writeFileSync(indexPath, indexContent);
        console.log(`✅ Đã cập nhật file index.html: ${indexPath}`);
      }
    }
    
    // Cập nhật file config.yml
    let newConfigContent = configContent;
    
    // Thay thế hoặc thêm cấu hình media
    if (configContent.includes('media_folder:')) {
      // Thay thế cấu hình media hiện tại
      newConfigContent = configContent.replace(
        /media_folder:.*(\r?\n)public_folder:.*/g,
        mediaConfig
      );
    } else {
      // Thêm cấu hình media vào đầu file
      newConfigContent = mediaConfig + configContent;
    }
    
    fs.writeFileSync(CMS_CONFIG_PATH, newConfigContent);
    console.log(`✅ Đã cập nhật file cấu hình Decap CMS: ${CMS_CONFIG_PATH}`);
    
    console.log('\n🎉 Hoàn tất cấu hình Decap CMS với GitHub repository cho hình ảnh!');
    console.log('\n⚠️ Lưu ý:');
    console.log('1. Bạn cần tạo GitHub Personal Access Token với quyền "repo" để upload ảnh.');
    console.log('2. Nhập token này vào form đăng nhập Decap CMS.');
    console.log('3. Ảnh sẽ được upload lên repository hình ảnh và sử dụng jsDelivr CDN.');
    
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật cấu hình: ${error.message}`);
    process.exit(1);
  }
}