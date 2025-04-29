#!/usr/bin/env node

/**
 * Script để cài đặt các dependencies cần thiết cho các script
 * Sử dụng: node scripts/install-dependencies.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Danh sách các dependencies cần thiết
const dependencies = [
  'commander',
  'slugify',
  'gray-matter',
  'cli-table3'
];

console.log('📦 Đang cài đặt các dependencies cần thiết cho scripts...');

try {
  // Cài đặt các dependencies
  execSync(`npm install --save-dev ${dependencies.join(' ')}`, { stdio: 'inherit' });
  
  console.log('\n✅ Đã cài đặt thành công các dependencies:');
  dependencies.forEach(dep => console.log(`- ${dep}`));
  
  // Cập nhật quyền thực thi cho các script
  const scriptsDir = path.join(process.cwd(), 'scripts');
  const scriptFiles = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.js'));
  
  scriptFiles.forEach(file => {
    const filePath = path.join(scriptsDir, file);
    try {
      fs.chmodSync(filePath, '755');
      console.log(`✅ Đã cập nhật quyền thực thi cho ${file}`);
    } catch (error) {
      console.error(`❌ Không thể cập nhật quyền thực thi cho ${file}:`, error.message);
    }
  });
  
  console.log('\n🚀 Bạn có thể sử dụng các lệnh sau:');
  console.log('- npm run new-post -- --title "Tiêu đề bài viết" --locale vi');
  console.log('- npm run new-series -- --name "Tên Series" --parts 3');
  console.log('- npm run new-category -- --name "Tên Category" --posts 3');
  console.log('- npm run list-posts -- --locale vi');
  
} catch (error) {
  console.error('❌ Lỗi khi cài đặt dependencies:', error.message);
  process.exit(1);
}