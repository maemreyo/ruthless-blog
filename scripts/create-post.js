#!/usr/bin/env node

/**
 * Script để tạo bài viết blog mới nhanh chóng
 * Sử dụng: node scripts/create-post.js --title "Tiêu đề bài viết" --locale vi
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const slugify = require('slugify');

// Cấu hình command line options
program
  .option('-t, --title <title>', 'Tiêu đề bài viết')
  .option('-l, --locale <locale>', 'Ngôn ngữ (vi hoặc en)', 'vi')
  .option('-c, --category <category>', 'Category của bài viết', 'Technology')
  .option('-s, --series <series>', 'Tên series (nếu có)')
  .option('-p, --series-part <part>', 'Phần của series (nếu có)', parseInt)
  .option('-e, --excerpt <excerpt>', 'Mô tả ngắn về bài viết')
  .option('-a, --author <author>', 'Tác giả', 'Wehttam')
  .option('-i, --image <image>', 'Đường dẫn ảnh thumbnail', '/images/uploads/default-thumbnail.jpg')
  .option('-d, --draft', 'Tạo bài viết ở chế độ nháp', false);

program.parse(process.argv);

const options = program.opts();

// Kiểm tra tiêu đề bài viết
if (!options.title) {
  console.error('Lỗi: Tiêu đề bài viết là bắt buộc');
  program.help();
  process.exit(1);
}

// Tạo slug từ tiêu đề
const slug = slugify(options.title, {
  lower: true,
  strict: true,
  locale: options.locale === 'vi' ? 'vi' : 'en'
});

// Tạo ngày hiện tại theo định dạng YYYY-MM-DD
const today = new Date();
const dateString = today.toISOString().split('T')[0];

// Tạo tên file
const fileName = `${dateString}-${slug}.md`;

// Xác định thư mục lưu trữ bài viết
const contentDir = path.join(process.cwd(), 'src', 'content', 'blog', options.locale);

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Tạo nội dung frontmatter
let frontmatter = `---
title: '${options.title}'
date: '${dateString}'
author: '${options.author}'
excerpt: '${options.excerpt || `Đây là bài viết về ${options.title}`}'
tags: []
thumbnail: '${options.image}'
`;

if (options.category) {
  frontmatter += `category: '${options.category}'\n`;
}

if (options.series) {
  frontmatter += `series: '${options.series}'\n`;
  
  if (options.seriesPart) {
    frontmatter += `seriesPart: ${options.seriesPart}\n`;
  }
}

if (options.draft) {
  frontmatter += `draft: true\n`;
}

frontmatter += `---

# ${options.title}

Nội dung bài viết của bạn ở đây...
`;

// Đường dẫn đầy đủ đến file
const filePath = path.join(contentDir, fileName);

// Kiểm tra xem file đã tồn tại chưa
if (fs.existsSync(filePath)) {
  console.error(`Lỗi: File ${fileName} đã tồn tại`);
  process.exit(1);
}

// Ghi file
fs.writeFileSync(filePath, frontmatter);

console.log(`✅ Đã tạo bài viết mới: ${filePath}`);
console.log(`🔗 Đường dẫn URL: /blog/${slug}`);