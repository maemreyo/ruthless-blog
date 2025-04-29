#!/usr/bin/env node

/**
 * Script để liệt kê tất cả bài viết blog
 * Sử dụng: node scripts/list-posts.js --locale vi
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const matter = require('gray-matter');
const Table = require('cli-table3');

// Cấu hình command line options
program
  .option('-l, --locale <locale>', 'Ngôn ngữ (vi hoặc en hoặc all)', 'all')
  .option('-c, --category <category>', 'Lọc theo category')
  .option('-s, --series <series>', 'Lọc theo series')
  .option('-d, --drafts', 'Chỉ hiển thị bài viết nháp', false)
  .option('-p, --published', 'Chỉ hiển thị bài viết đã xuất bản', false)
  .option('--sort <field>', 'Sắp xếp theo trường (date, title)', 'date')
  .option('--desc', 'Sắp xếp giảm dần', false);

program.parse(process.argv);

const options = program.opts();

// Hàm đọc tất cả bài viết từ một thư mục
function readPostsFromDirectory(locale) {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'blog', locale);
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      
      return {
        title: data.title,
        date: data.date,
        author: data.author,
        category: data.category || 'Uncategorized',
        series: data.series || '',
        seriesPart: data.seriesPart || 0,
        draft: data.draft || false,
        slug: file.replace(/\.md$/, '').substring(11), // Bỏ ngày và .md
        locale,
        filePath
      };
    });
}

// Đọc bài viết từ tất cả các locale hoặc locale cụ thể
let allPosts = [];
if (options.locale === 'all') {
  allPosts = [
    ...readPostsFromDirectory('vi'),
    ...readPostsFromDirectory('en')
  ];
} else {
  allPosts = readPostsFromDirectory(options.locale);
}

// Lọc theo category nếu có
if (options.category) {
  allPosts = allPosts.filter(post => 
    post.category && post.category.toLowerCase() === options.category.toLowerCase()
  );
}

// Lọc theo series nếu có
if (options.series) {
  allPosts = allPosts.filter(post => 
    post.series && post.series.toLowerCase() === options.series.toLowerCase()
  );
}

// Lọc theo trạng thái nháp/xuất bản
if (options.drafts) {
  allPosts = allPosts.filter(post => post.draft === true);
}

if (options.published) {
  allPosts = allPosts.filter(post => post.draft !== true);
}

// Sắp xếp bài viết
allPosts.sort((a, b) => {
  if (options.sort === 'date') {
    return new Date(a.date) - new Date(b.date);
  } else if (options.sort === 'title') {
    return a.title.localeCompare(b.title);
  }
  return 0;
});

// Đảo ngược thứ tự nếu cần
if (options.desc) {
  allPosts.reverse();
}

// Hiển thị kết quả dưới dạng bảng
const table = new Table({
  head: ['Title', 'Date', 'Category', 'Series', 'Part', 'Author', 'Status', 'Locale'],
  colWidths: [40, 12, 15, 20, 6, 15, 10, 8]
});

allPosts.forEach(post => {
  table.push([
    post.title.substring(0, 37) + (post.title.length > 37 ? '...' : ''),
    post.date,
    post.category,
    post.series || '-',
    post.seriesPart || '-',
    post.author,
    post.draft ? 'Draft' : 'Published',
    post.locale
  ]);
});

console.log(table.toString());
console.log(`\nTổng số bài viết: ${allPosts.length}`);

// Hiển thị thống kê
const categories = {};
const series = {};
const locales = { vi: 0, en: 0 };
const statuses = { draft: 0, published: 0 };

allPosts.forEach(post => {
  // Đếm theo category
  categories[post.category] = (categories[post.category] || 0) + 1;
  
  // Đếm theo series
  if (post.series) {
    series[post.series] = (series[post.series] || 0) + 1;
  }
  
  // Đếm theo locale
  locales[post.locale]++;
  
  // Đếm theo trạng thái
  statuses[post.draft ? 'draft' : 'published']++;
});

console.log('\nThống kê theo Category:');
Object.keys(categories).forEach(category => {
  console.log(`- ${category}: ${categories[category]} bài viết`);
});

if (Object.keys(series).length > 0) {
  console.log('\nThống kê theo Series:');
  Object.keys(series).forEach(s => {
    console.log(`- ${s}: ${series[s]} bài viết`);
  });
}

console.log('\nThống kê theo Ngôn ngữ:');
Object.keys(locales).forEach(locale => {
  if (locales[locale] > 0) {
    console.log(`- ${locale}: ${locales[locale]} bài viết`);
  }
});

console.log('\nThống kê theo Trạng thái:');
console.log(`- Đã xuất bản: ${statuses.published} bài viết`);
console.log(`- Bản nháp: ${statuses.draft} bài viết`);