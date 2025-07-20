# Ruthless Blog

Một blog cá nhân được xây dựng bằng Next.js, hỗ trợ đa ngôn ngữ, và có nhiều tính năng hiện đại.

## Tính Năng

- 🌐 Hỗ trợ đa ngôn ngữ (Tiếng Việt và Tiếng Anh)
- 🎨 Giao diện hiện đại, responsive với Tailwind CSS
- 🌓 Chế độ sáng/tối
- 📝 Viết bài bằng Markdown
- 🔍 Tìm kiếm bài viết
- 📊 Phân loại bài viết theo categories
- 📚 Tổ chức bài viết theo series
- 🏷️ Hỗ trợ tags cho bài viết
- 🔄 Tự động tạo sitemap
- 📱 Trải nghiệm mobile tối ưu

## Bắt Đầu

Đầu tiên, cài đặt các dependencies:

```bash
npm install
```

Sau đó, chạy server phát triển:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) với trình duyệt để xem kết quả.

## Scripts Tiện Ích

Dự án này đi kèm với các scripts tiện ích để giúp quản lý nội dung blog một cách hiệu quả. Trước tiên, cài đặt các dependencies cần thiết:

```bash
node scripts/install-dependencies.js
```

### Quản Lý Hình Ảnh

Dự án sử dụng GitHub repository riêng (`maemreyo/ruthless-blog-images`) để lưu trữ hình ảnh và jsDelivr làm CDN. Cài đặt dependencies cho quản lý hình ảnh:

```bash
npm run setup-images
```

Xem thêm thông tin chi tiết về quản lý hình ảnh trong [scripts/IMAGES-README.md](scripts/IMAGES-README.md).

### Tạo Bài Viết Mới

```bash
npm run new-post -- --title "Tiêu đề bài viết" --locale vi
```

### Tạo Series Mới

```bash
npm run new-series -- --name "Tên Series" --parts 3
```

### Tạo Category Mới

```bash
npm run new-category -- --name "Tên Category" --posts 3
```

### Liệt Kê Bài Viết

```bash
npm run list-posts -- --locale vi
```

Xem thêm thông tin chi tiết về các scripts trong [scripts/README.md](scripts/README.md).

## Cấu Trúc Dự Án

```
ruthless-blog/
├── public/             # Tài nguyên tĩnh
├── scripts/            # Scripts tiện ích
├── src/
│   ├── app/            # Các trang của ứng dụng (App Router)
│   ├── components/     # Components React
│   ├── content/        # Nội dung blog (Markdown)
│   ├── i18n/           # Cấu hình đa ngôn ngữ
│   ├── lib/            # Thư viện và tiện ích
│   └── messages/       # File ngôn ngữ
└── ...
```

## Triển Khai

Cách dễ nhất để triển khai ứng dụng Next.js là sử dụng [Vercel Platform](https://vercel.com/new) từ các nhà sáng tạo của Next.js.

Xem thêm [tài liệu triển khai Next.js](https://nextjs.org/docs/app/building-your-application/deploying) để biết thêm chi tiết.
