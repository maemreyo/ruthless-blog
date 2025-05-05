# Hướng Dẫn Quản Lý Hình Ảnh cho Wehttam Blog

Tài liệu này hướng dẫn cách sử dụng các script để quản lý hình ảnh trong blog, sử dụng GitHub repository riêng làm nơi lưu trữ và jsDelivr làm CDN.

## Cài Đặt Ban Đầu

Trước khi sử dụng các script, bạn cần cài đặt các dependencies cần thiết:

```bash
npm run setup-images
```

## 1. Upload Ảnh Đơn Lẻ

Để upload một ảnh lên repository hình ảnh:

```bash
npm run upload-image -- --image path/to/image.jpg --folder posts/2023/05
```

Các tùy chọn:
- `--image` hoặc `-i`: Đường dẫn đến ảnh cần upload (bắt buộc)
- `--folder` hoặc `-f`: Thư mục đích trong repository hình ảnh (mặc định: uploads)
- `--message` hoặc `-m`: Commit message (mặc định: Add new images)
- `--copy` hoặc `-c`: Tự động copy URL vào clipboard
- `--prefix` hoặc `-p`: Tiền tố cho tên file
- `--optimize`: Tối ưu hóa ảnh trước khi upload

Ví dụ:
```bash
npm run upload-image -- --image src/content/blog/vi/images/example.jpg --folder posts/2023/05 --optimize --copy
```

## 2. Upload Nhiều Ảnh

Để upload nhiều ảnh từ một thư mục:

```bash
npm run upload-images -- path/to/images/folder --folder posts/2023/05
```

Các tùy chọn tương tự như upload ảnh đơn lẻ.

## 3. Xử Lý Ảnh Trong Bài Viết

Script này sẽ tự động tìm tất cả ảnh local trong bài viết Markdown, upload lên repository hình ảnh và cập nhật đường dẫn trong bài viết:

```bash
npm run process-post -- --post path/to/post.md
```

Các tùy chọn:
- `--post` hoặc `-p`: Đường dẫn đến bài viết Markdown (bắt buộc)
- `--folder` hoặc `-f`: Thư mục đích trong repository hình ảnh (mặc định: tự động tạo dựa trên thông tin bài viết)
- `--optimize` hoặc `-o`: Tối ưu hóa ảnh trước khi upload
- `--keep` hoặc `-k`: Giữ lại ảnh gốc sau khi upload (mặc định: xóa ảnh gốc)
- `--force`: Xóa cả ảnh trong thư mục public (mặc định: không xóa ảnh trong public)
- `--no-preserve-structure`: Không giữ cấu trúc thư mục gốc (mặc định: giữ cấu trúc thư mục)

Script này có thể xử lý tất cả các loại ảnh trong bài viết:
- Ảnh trong frontmatter (các trường như `thumbnail`, `image`, `cover`, v.v.)
- Ảnh local trong nội dung bài viết (cú pháp Markdown `![alt](url)`)
- Ảnh trong thư mục public (ví dụ: `/images/uploads/`, `/images/blog/`, v.v.)
- Ảnh trong bất kỳ thư mục nào khác mà bài viết tham chiếu đến

Mặc định, script sẽ giữ nguyên cấu trúc thư mục gốc khi upload lên repository hình ảnh. Ví dụ, ảnh từ `/images/blog/example.jpg` sẽ được upload lên `images/blog/example.jpg` trong repository hình ảnh.

Ví dụ:
```bash
# Xử lý ảnh trong bài viết và tối ưu hóa
npm run process-post -- --post src/content/blog/vi/2023-05-01-bai-viet-moi.md --optimize

# Xử lý ảnh trong bài viết và giữ lại ảnh gốc
npm run process-post -- --post src/content/blog/en/2024-01-15-getting-started-with-nextjs.md --keep
```

## 4. Tích Hợp Với Quy Trình Tạo Bài Viết

Khi tạo bài viết mới, bạn có thể tự động xử lý ảnh:

```bash
# Tạo bài viết mới
npm run new-post -- --title "Tiêu đề bài viết" --locale vi

# Thêm ảnh vào thư mục bài viết
# (Ví dụ: copy ảnh vào src/content/blog/vi/images/)

# Xử lý ảnh trong bài viết
npm run process-post -- --post src/content/blog/vi/2023-05-01-tieu-de-bai-viet.md

npm run process-post -- --post src/content/blog/en/2024-01-20-styling-with-tailwind-css.md --optimize --service github-raw --check-repo --force-git --update-all-langs
```

## 5. Tích Hợp Với Decap CMS

Để cấu hình Decap CMS sử dụng GitHub repository cho hình ảnh:

```bash
npm run setup-cms-images
```

Sau khi chạy script này:
1. Decap CMS sẽ được cấu hình để upload ảnh lên repository hình ảnh
2. Ảnh sẽ được phân phối qua jsDelivr CDN
3. Bạn cần tạo GitHub Personal Access Token với quyền "repo" và nhập vào form đăng nhập Decap CMS

## Cấu Trúc Repository Hình Ảnh

Repository hình ảnh (`maemreyo/wehttam-blog-images`) được tổ chức như sau:

```
wehttam-blog-images/
├── posts/                  # Ảnh cho bài viết
│   ├── 2023/               # Năm
│   │   ├── 05/             # Tháng
│   │   │   ├── post-slug/  # Slug của bài viết
│   │   │   │   ├── image1.jpg
│   │   │   │   └── image2.png
├── categories/             # Ảnh cho categories
├── series/                 # Ảnh cho series
└── uploads/                # Ảnh upload từ Decap CMS
```

## URL jsDelivr

Các ảnh được upload lên repository hình ảnh sẽ có URL dạng:

```
https://cdn.jsdelivr.net/gh/maemreyo/wehttam-blog-images@main/path/to/image.jpg
```

## Lưu Ý

1. **Tối ưu hóa ảnh**: Luôn tối ưu hóa ảnh trước khi upload để giảm dung lượng và cải thiện tốc độ tải trang.
2. **Giới hạn GitHub**: GitHub có giới hạn kích thước repository (thường là 1GB), nên hãy sử dụng ảnh có kích thước hợp lý.
3. **Backup**: Nên sao lưu ảnh quan trọng ở nơi khác để đề phòng vấn đề với repository.
4. **Tên file**: Sử dụng tên file không có ký tự đặc biệt và dấu cách để tránh vấn đề với URL.

## Xử Lý Sự Cố

### Không thể upload ảnh
- Kiểm tra quyền truy cập vào repository hình ảnh
- Kiểm tra kết nối mạng
- Kiểm tra GitHub token (nếu sử dụng Decap CMS)

### Ảnh không hiển thị
- Kiểm tra URL jsDelivr
- Kiểm tra xem ảnh đã được push lên repository chưa
- Đợi vài phút để jsDelivr cập nhật cache

### Lỗi khi xử lý ảnh trong bài viết
- Kiểm tra đường dẫn đến bài viết
- Kiểm tra định dạng Markdown của ảnh trong bài viết