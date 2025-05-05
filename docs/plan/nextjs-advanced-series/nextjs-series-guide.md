# Hướng dẫn quản lý series "Next.js App Router Deep Dive"

Tài liệu này cung cấp hướng dẫn chi tiết về cách quản lý và phát triển series bài viết "Next.js App Router Deep Dive".

## Cấu trúc Series

Series này gồm 8 bài viết, mỗi bài tập trung vào một khía cạnh quan trọng của Next.js App Router:

1. **React Server Components và Server Actions**
   - Phân tích sâu về RSC
   - Server Actions
   - Streaming UI với RSC & Suspense
   - Patterns & Best Practices

2. **Chiến lược Caching Nâng cao trong Next.js**
   - Các lớp Caching trong Next.js
   - Kiểm soát Cache
   - Debugging Cache
   - Chiến lược Invalidation

3. **Tính năng Nâng cao của App Router**
   - Parallel Routes & Intercepting Routes
   - Route Handlers (Nâng cao)
   - Layouts & Templates
   - Error Handling & Not Found
   - Loading UI

4. **Tối ưu hóa Performance trong Next.js**
   - Phân tích Bundle Size
   - Tối ưu Third-party Scripts
   - Tối ưu Font & Image
   - Edge Functions & Middleware

5. **State Management với App Router**
   - Thách thức với Server Components
   - Các giải pháp (Context API, Zustand, Jotai, Redux)
   - Truyền state từ server xuống client

6. **Authentication & Authorization Nâng cao**
   - Tích hợp với Server Components/Actions
   - Bảo vệ Route Handlers & Server Actions
   - Role-based access control (RBAC)
   - So sánh các thư viện/dịch vụ

7. **Testing Ứng dụng Next.js**
   - Testing Server Components & Server Actions
   - End-to-End testing với Playwright/Cypress
   - Integration Testing
   - Mocking Next.js features

8. **Monorepo & Next.js**
   - Thiết lập và quản lý dự án Next.js trong monorepo
   - Chia sẻ code giữa các package/app
   - Tối ưu build và deployment trong monorepo

## Quy trình làm việc

### 1. Nghiên cứu và chuẩn bị

Trước khi viết mỗi bài, hãy:

- Đọc kỹ tài liệu chính thức của Next.js về chủ đề
- Tìm hiểu các bài viết, video liên quan
- Thử nghiệm code để hiểu rõ các khái niệm
- Tạo các ví dụ đơn giản, dễ hiểu

### 2. Viết bài

Mỗi bài viết nên có cấu trúc:

- **Giới thiệu**: Tổng quan về chủ đề và tại sao nó quan trọng
- **Nội dung chính**: Chia thành các phần nhỏ, mỗi phần tập trung vào một khía cạnh
- **Ví dụ code**: Cung cấp ví dụ thực tế, rõ ràng
- **Best practices**: Các mẫu thiết kế và cách làm tốt nhất
- **Kết luận**: Tóm tắt và giới thiệu bài tiếp theo
- **Tài liệu tham khảo**: Liệt kê các nguồn tham khảo

### 3. Thêm hình ảnh

Sử dụng script `process-post` để xử lý hình ảnh:

```bash
npm run process-post -- --post src/content/blog/vi/2025-05-05-react-server-components-va-server-actions.md
```

### 4. Xuất bản

Khi bài viết đã sẵn sàng:

1. Xóa flag `draft: true` trong frontmatter
2. Cập nhật ngày xuất bản nếu cần
3. Commit và push lên repository

## Lịch trình xuất bản

Dự kiến xuất bản 1 bài/tuần:

1. **React Server Components và Server Actions** - Tuần 1
2. **Chiến lược Caching Nâng cao trong Next.js** - Tuần 2
3. **Tính năng Nâng cao của App Router** - Tuần 3
4. **Tối ưu hóa Performance trong Next.js** - Tuần 4
5. **State Management với App Router** - Tuần 5
6. **Authentication & Authorization Nâng cao** - Tuần 6
7. **Testing Ứng dụng Next.js** - Tuần 7
8. **Monorepo & Next.js** - Tuần 8

## Các lệnh hữu ích

### Liệt kê tất cả bài viết trong series

```bash
node scripts/list-posts.js --series "Next.js App Router Deep Dive"
```

### Tạo bài viết mới trong series

```bash
node scripts/create-post.js --title "Tiêu đề bài viết" --locale vi --category "Web Development" --series "Next.js App Router Deep Dive" --series-part X --draft
```

### Xử lý hình ảnh trong bài viết

```bash
npm run process-post -- --post src/content/blog/vi/path-to-post.md
```

### Xử lý hình ảnh cho tất cả bài viết trong series

```bash
npm run process-series -- --series "Next.js App Router Deep Dive"
```

## Tài nguyên

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)
- [Vercel Blog](https://vercel.com/blog)