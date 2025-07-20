#!/usr/bin/env node

/**
 * Script để tạo một series mới với nhiều bài viết
 * Sử dụng: node scripts/create-series.js --name "Tên Series" --locale vi --parts 3
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const slugify = require('slugify');
const { execSync } = require('child_process');

// Cấu hình command line options
program
  .option('-n, --name <name>', 'Tên series')
  .option('-l, --locale <locale>', 'Ngôn ngữ (vi hoặc en)', 'vi')
  .option('-p, --parts <parts>', 'Số lượng bài viết trong series', '3') // Change default to string
  .option('-c, --category <category>', 'Category cho tất cả bài viết trong series', 'Technology')
  .option('-a, --author <author>', 'Tác giả', 'Wehttam')
  .option('-d, --draft', 'Tạo bài viết ở chế độ nháp', false);

program.parse(process.argv);

const options = program.opts();
options.parts = parseInt(options.parts); // Parse parts to integer
console.log(`Debug: options.parts = ${options.parts}, type = ${typeof options.parts}`);

// Kiểm tra tên series
if (!options.name) {
  console.error('Lỗi: Tên series là bắt buộc');
  program.help();
  process.exit(1);
}

// Tạo ngày hiện tại theo định dạng YYYY-MM-DD
const today = new Date();

// Tạo các bài viết trong series
for (let i = 1; i <= options.parts; i++) {
  // Tạo ngày cho bài viết (mỗi bài cách nhau 1 ngày)
  const postDate = new Date(today);
  postDate.setDate(today.getDate() + i - 1);
  const dateString = postDate.toISOString().split('T')[0];
  
  // Tạo tiêu đề cho bài viết
  const postTitle = `${options.name} - Phần ${i}`;
  
  // Tạo mô tả cho bài viết
  let excerpt;
  if (i === 1) {
    excerpt = `Giới thiệu về series ${options.name} và các kiến thức cơ bản.`;
  } else if (i === options.parts) {
    excerpt = `Phần cuối cùng của series ${options.name} với các kỹ thuật nâng cao.`;
  } else {
    excerpt = `Phần ${i} của series ${options.name} với các kỹ thuật và ví dụ thực tế.`;
  }
  
  // Tạo lệnh để tạo bài viết
  let command = `node scripts/create-post.js --title "${postTitle}" --locale ${options.locale} --category "${options.category}" --series "${options.name}" --series-part ${i} --excerpt "${excerpt}" --author "${options.author}"`;
  
  if (options.draft) {
    command += ' --draft';
  }
  
  // Thực thi lệnh tạo bài viết
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Lỗi khi tạo bài viết phần ${i}:`, error.message);
  }
}

console.log(`\n✅ Đã tạo series "${options.name}" với ${options.parts} bài viết`);
console.log('🔗 Bạn có thể xem series này tại:');
console.log(`   /series/${encodeURIComponent(options.name)}`);

// Hiển thị gợi ý các lệnh hữu ích
console.log('\n📝 Các lệnh hữu ích:');
console.log(`- Liệt kê tất cả bài viết trong series: node scripts/list-posts.js --series "${options.name}"`);
console.log(`- Liệt kê tất cả series: node scripts/list-posts.js --sort series`);