#!/usr/bin/env node

/**
 * Script để tạo một category mới và các bài viết mẫu
 * Sử dụng: node scripts/create-category.js --name "Tên Category" --locale vi --posts 3
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const slugify = require('slugify');
const { execSync } = require('child_process');

// Cấu hình command line options
program
  .option('-n, --name <name>', 'Tên category')
  .option('-l, --locale <locale>', 'Ngôn ngữ (vi hoặc en)', 'vi')
  .option('-p, --posts <posts>', 'Số lượng bài viết mẫu', parseInt, 3)
  .option('-a, --author <author>', 'Tác giả', 'Ruthless')
  .option('-d, --draft', 'Tạo bài viết ở chế độ nháp', false);

program.parse(process.argv);

const options = program.opts();

// Kiểm tra tên category
if (!options.name) {
  console.error('Lỗi: Tên category là bắt buộc');
  program.help();
  process.exit(1);
}

// Tạo ngày hiện tại theo định dạng YYYY-MM-DD
const today = new Date();

// Danh sách các tiêu đề mẫu cho từng category
const sampleTitles = {
  'Technology': [
    'Giới thiệu về công nghệ mới nhất',
    'Cách áp dụng công nghệ vào cuộc sống',
    'Tương lai của công nghệ',
    'Những xu hướng công nghệ đáng chú ý',
    'Công nghệ và tác động đến xã hội'
  ],
  'Design': [
    'Nguyên tắc thiết kế hiệu quả',
    'Xu hướng thiết kế mới nhất',
    'Cách tạo thiết kế thu hút người dùng',
    'Màu sắc và tâm lý trong thiết kế',
    'Thiết kế UX/UI hiện đại'
  ],
  'Development': [
    'Hướng dẫn lập trình cho người mới bắt đầu',
    'Các kỹ thuật tối ưu hóa code',
    'Kiến trúc phần mềm hiện đại',
    'DevOps và CI/CD pipeline',
    'Phát triển ứng dụng di động'
  ],
  'Business': [
    'Chiến lược kinh doanh hiệu quả',
    'Xây dựng thương hiệu cá nhân',
    'Marketing trong kỷ nguyên số',
    'Quản lý dự án và tổ chức',
    'Khởi nghiệp và đổi mới'
  ]
};

// Sử dụng tiêu đề mẫu cho category hoặc tạo tiêu đề mặc định
const titles = sampleTitles[options.name] || [
  `Giới thiệu về ${options.name}`,
  `Các xu hướng mới trong ${options.name}`,
  `Cách áp dụng ${options.name} vào thực tế`,
  `Tương lai của ${options.name}`,
  `${options.name} và tác động đến cuộc sống`
];

// Tạo các bài viết trong category
for (let i = 1; i <= options.posts; i++) {
  // Tạo ngày cho bài viết (mỗi bài cách nhau 1 ngày)
  const postDate = new Date(today);
  postDate.setDate(today.getDate() + i - 1);
  const dateString = postDate.toISOString().split('T')[0];
  
  // Chọn tiêu đề cho bài viết
  const titleIndex = (i - 1) % titles.length;
  const postTitle = titles[titleIndex];
  
  // Tạo mô tả cho bài viết
  const excerpt = `Bài viết về ${postTitle.toLowerCase()} trong lĩnh vực ${options.name}.`;
  
  // Tạo lệnh để tạo bài viết
  let command = `node scripts/create-post.js --title "${postTitle}" --locale ${options.locale} --category "${options.name}" --excerpt "${excerpt}" --author "${options.author}"`;
  
  if (options.draft) {
    command += ' --draft';
  }
  
  // Thực thi lệnh tạo bài viết
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Lỗi khi tạo bài viết ${i}:`, error.message);
  }
}

console.log(`\n✅ Đã tạo category "${options.name}" với ${options.posts} bài viết mẫu`);
console.log('🔗 Bạn có thể xem category này tại:');
console.log(`   /categories/${encodeURIComponent(options.name)}`);

// Hiển thị gợi ý các lệnh hữu ích
console.log('\n📝 Các lệnh hữu ích:');
console.log(`- Liệt kê tất cả bài viết trong category: node scripts/list-posts.js --category "${options.name}"`);
console.log(`- Liệt kê tất cả categories: node scripts/list-posts.js --sort category`);