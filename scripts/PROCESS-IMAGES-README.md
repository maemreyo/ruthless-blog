# Hướng Dẫn Xử Lý Hình Ảnh Trong Bài Viết

Tài liệu này hướng dẫn cách sử dụng script `process-post-images-new.js` để tự động xử lý hình ảnh trong bài viết Markdown.

## Tính Năng Chính

- Tìm tất cả ảnh local trong bài viết (cả trong frontmatter và nội dung)
- Upload ảnh lên repository hình ảnh GitHub
- Cập nhật đường dẫn ảnh trong bài viết
- Hỗ trợ xử lý nhiều bài viết cùng lúc
- Hỗ trợ xử lý các phiên bản ngôn ngữ khác nhau của bài viết

## Các Lệnh Có Sẵn

Các lệnh sau đã được cấu hình trong `package.json`:

```bash
# Xử lý một bài viết cụ thể
npm run process-post -- --post path/to/post.md

# Xử lý một bài viết với tối ưu hóa ảnh
npm run process-post-optimize -- --post path/to/post.md

# Xử lý tất cả các bài viết
npm run process-all-posts

# Xử lý tất cả các bài viết tiếng Anh
npm run process-all-posts-en

# Xử lý tất cả các bài viết tiếng Việt
npm run process-all-posts-vi

# Xử lý tất cả các bài viết trong một series cụ thể
npm run process-series -- --series "Tên Series"
```

## Các Tùy Chọn

Script hỗ trợ nhiều tùy chọn để tùy chỉnh quá trình xử lý:

```
Options:
  -p, --post <path>       Đường dẫn đến bài viết Markdown
  -a, --all               Xử lý tất cả các bài viết trong thư mục blog (default: false)
  -s, --series <series>   Chỉ xử lý bài viết thuộc series cụ thể
  -f, --folder <folder>   Thư mục đích trong repository hình ảnh (default: "")
  -o, --optimize          Tối ưu hóa ảnh trước khi upload (default: true)
  -k, --keep              Giữ lại ảnh gốc sau khi upload (default: false)
  --force                 Xóa cả ảnh trong thư mục public (default: true)
  --force-git             Force push lên Git repository nếu cần (default: true)
  --no-preserve-structure Không giữ cấu trúc thư mục gốc (default: false)
  --service <service>     Dịch vụ URL hình ảnh (jsdelivr-latest, jsdelivr-versioned, github-raw, github-blob) (default: "github-raw")
  --check-repo            Kiểm tra xem repository có phải là public không (default: true)
  --update-all-langs      Cập nhật tất cả các phiên bản ngôn ngữ của bài viết (default: true)
  --lang <lang>           Chỉ xử lý bài viết của ngôn ngữ cụ thể (vi, en) (default: "")
  -h, --help              display help for command
```

## Ví Dụ Sử Dụng

### 1. Xử lý một bài viết cụ thể

```bash
npm run process-post -- --post src/content/blog/en/2024-01-20-styling-with-tailwind-css.md
```

### 2. Xử lý một bài viết và giữ lại ảnh gốc

```bash
npm run process-post -- --post src/content/blog/en/2024-01-20-styling-with-tailwind-css.md --keep
```

### 3. Xử lý một bài viết với dịch vụ URL khác

```bash
npm run process-post -- --post src/content/blog/en/2024-01-20-styling-with-tailwind-css.md --service jsdelivr-latest
```

### 4. Xử lý tất cả các bài viết tiếng Việt

```bash
npm run process-all-posts-vi
```

### 5. Xử lý tất cả các bài viết và không tối ưu hóa ảnh

```bash
npm run process-all-posts -- --no-optimize
```

## Quy Trình Làm Việc Đề Xuất

1. Viết bài và thêm ảnh vào thư mục phù hợp (ví dụ: `public/images/uploads/`)
2. Khi hoàn thành bài viết, chạy lệnh xử lý ảnh:
   ```bash
   npm run process-post -- --post src/content/blog/vi/2024-05-01-bai-viet-moi.md
   ```
3. Kiểm tra bài viết để đảm bảo ảnh đã được cập nhật đúng
4. Commit và push các thay đổi lên repository

## Lưu Ý

- Mặc định, script sẽ xóa ảnh gốc sau khi upload thành công. Sử dụng tùy chọn `--keep` nếu muốn giữ lại ảnh gốc.
- Mặc định, script sẽ tối ưu hóa ảnh trước khi upload. Sử dụng tùy chọn `--no-optimize` nếu không muốn tối ưu hóa.
- Mặc định, script sẽ cập nhật tất cả các phiên bản ngôn ngữ của bài viết. Sử dụng tùy chọn `--no-update-all-langs` nếu chỉ muốn cập nhật bài viết hiện tại.