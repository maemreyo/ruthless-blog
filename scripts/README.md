# Scripts Tiện Ích cho Ruthless Blog

Thư mục này chứa các script tiện ích để giúp quản lý và tạo nội dung cho blog một cách nhanh chóng và hiệu quả.

## Cài đặt

Trước khi sử dụng các script, bạn cần cài đặt các dependencies cần thiết:

```bash
node scripts/install-dependencies.js
```

## Các Script Có Sẵn

### 1. Tạo Bài Viết Mới

```bash
npm run new-post -- --title "Tiêu đề bài viết" --locale vi
```

Các tùy chọn:
- `--title` hoặc `-t`: Tiêu đề bài viết (bắt buộc)
- `--locale` hoặc `-l`: Ngôn ngữ (vi hoặc en, mặc định: vi)
- `--category` hoặc `-c`: Category của bài viết (mặc định: Technology)
- `--series` hoặc `-s`: Tên series (nếu bài viết thuộc một series)
- `--series-part` hoặc `-p`: Phần của series (nếu bài viết thuộc một series)
- `--excerpt` hoặc `-e`: Mô tả ngắn về bài viết
- `--author` hoặc `-a`: Tác giả (mặc định: Ruthless)
- `--image` hoặc `-i`: Đường dẫn ảnh thumbnail
- `--draft` hoặc `-d`: Tạo bài viết ở chế độ nháp

### 2. Tạo Series Mới

```bash
npm run new-series -- --name "Tên Series" --parts 3
```

Các tùy chọn:
- `--name` hoặc `-n`: Tên series (bắt buộc)
- `--locale` hoặc `-l`: Ngôn ngữ (vi hoặc en, mặc định: vi)
- `--parts` hoặc `-p`: Số lượng bài viết trong series (mặc định: 3)
- `--category` hoặc `-c`: Category cho tất cả bài viết trong series (mặc định: Technology)
- `--author` hoặc `-a`: Tác giả (mặc định: Ruthless)
- `--draft` hoặc `-d`: Tạo bài viết ở chế độ nháp

### 3. Tạo Category Mới

```bash
npm run new-category -- --name "Tên Category" --posts 3
```

Các tùy chọn:
- `--name` hoặc `-n`: Tên category (bắt buộc)
- `--locale` hoặc `-l`: Ngôn ngữ (vi hoặc en, mặc định: vi)
- `--posts` hoặc `-p`: Số lượng bài viết mẫu (mặc định: 3)
- `--author` hoặc `-a`: Tác giả (mặc định: Ruthless)
- `--draft` hoặc `-d`: Tạo bài viết ở chế độ nháp

### 4. Liệt Kê Bài Viết

```bash
npm run list-posts -- --locale vi
```

Các tùy chọn:
- `--locale` hoặc `-l`: Ngôn ngữ (vi, en hoặc all, mặc định: all)
- `--category` hoặc `-c`: Lọc theo category
- `--series` hoặc `-s`: Lọc theo series
- `--drafts` hoặc `-d`: Chỉ hiển thị bài viết nháp
- `--published` hoặc `-p`: Chỉ hiển thị bài viết đã xuất bản
- `--sort`: Sắp xếp theo trường (date, title, mặc định: date)
- `--desc`: Sắp xếp giảm dần

## Ví Dụ Sử Dụng

### Tạo bài viết mới bằng tiếng Việt

```bash
npm run new-post -- --title "Hướng dẫn sử dụng Next.js" --category "Development" --excerpt "Bài viết hướng dẫn chi tiết về Next.js"
```

### Tạo series mới về React

```bash
npm run new-series -- --name "React Fundamentals" --parts 5 --locale en
```

### Liệt kê tất cả bài viết trong một category

```bash
npm run list-posts -- --category "Development" --sort date --desc
```

### Liệt kê tất cả bài viết nháp

```bash
npm run list-posts -- --drafts
```