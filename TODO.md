# TODO: Danh sách công việc cho Blog Cá nhân

## 1. Thiết lập dự án Next.js
- [ ] Khởi tạo dự án Next.js với App Router
- [ ] Cài đặt các dependencies cần thiết (Tailwind CSS, Framer Motion, next-intl, v.v.)
- [ ] Thiết lập cấu trúc thư mục cơ bản (app/, components/, lib/, public/, content/, data/, messages/)
- [ ] Cấu hình Tailwind CSS (tailwind.config.js)
- [ ] Thiết lập hỗ trợ đa ngôn ngữ với next-intl
  - [ ] Tạo file i18n.ts và navigation.ts
  - [ ] Tạo middleware.ts cho định tuyến đa ngôn ngữ
  - [ ] Tạo thư mục messages/ với các file ngôn ngữ (en.json, vi.json)

## 2. Xây dựng cấu trúc App Router
- [ ] Tạo root layout (app/layout.tsx) với các thẻ HTML và body
- [ ] Tạo layout cho đa ngôn ngữ (app/[locale]/layout.tsx)
- [ ] Tạo template.tsx cho hiệu ứng chuyển trang
- [ ] Thiết lập các trang cơ bản:
  - [ ] Trang chủ (app/[locale]/page.tsx)
  - [ ] Trang danh sách bài viết (app/[locale]/blog/page.tsx)
  - [ ] Trang chi tiết bài viết (app/[locale]/blog/[slug]/page.tsx)
  - [ ] Trang giới thiệu (app/[locale]/about/page.tsx)
  - [ ] Trang liên hệ (app/[locale]/contact/page.tsx)
- [ ] Tạo các file loading.tsx cho mỗi route
- [ ] Tạo các file error.tsx cho mỗi route
- [ ] Tạo file not-found.tsx

## 3. Xây dựng các components UI
- [ ] Tạo components layout:
  - [ ] Header/Navbar với chuyển đổi ngôn ngữ
  - [ ] Footer
  - [ ] Sidebar (nếu cần)
- [ ] Tạo components hiển thị bài viết:
  - [ ] BlogPostCard (hiển thị tóm tắt bài viết)
  - [ ] BlogPostDetail (hiển thị nội dung đầy đủ bài viết)
  - [ ] BlogPostList (danh sách các bài viết)
  - [ ] Pagination (phân trang)
- [ ] Tạo components UI chung:
  - [ ] Button (với animation Framer Motion)
  - [ ] Card
  - [ ] Tag
  - [ ] Alert/Notification
  - [ ] Loading Spinner/Skeleton
  - [ ] Modal/Dialog

## 4. Thiết lập Decap CMS
- [ ] Tạo thư mục public/admin/
- [ ] Tạo file index.html cho Decap CMS
- [ ] Tạo file config.yml với cấu hình:
  - [ ] Backend (GitHub, GitLab, hoặc Git Gateway)
  - [ ] Media folder và public folder
  - [ ] Collections cho bài viết (posts)
  - [ ] Collections cho trang tĩnh (pages)
  - [ ] Collections cho cấu hình (settings)
- [ ] Thiết lập xác thực cho CMS (OAuth hoặc Netlify Identity)

## 5. Xây dựng các utility functions
- [ ] Tạo các hàm đọc và xử lý file Markdown:
  - [ ] getPostList (lấy danh sách tất cả bài viết)
  - [ ] getPostBySlug (lấy chi tiết bài viết theo slug)
  - [ ] getSortedPostsData (lấy và sắp xếp bài viết)
- [ ] Tạo các hàm xử lý đa ngôn ngữ
- [ ] Tạo các hàm tiện ích khác (format date, slugify, v.v.)

## 6. Tích hợp Framer Motion
- [ ] Thiết lập animation chuyển trang trong template.tsx
- [ ] Tạo các animation cho components:
  - [ ] Hiệu ứng hover cho các nút và card
  - [ ] Hiệu ứng xuất hiện cho danh sách bài viết
  - [ ] Hiệu ứng loading
- [ ] Tạo các variants animation có thể tái sử dụng

## 7. Thiết kế giao diện với Tailwind CSS
- [ ] Thiết kế theme chung (màu sắc, typography, spacing)
- [ ] Áp dụng phong cách Neobrutalism (nếu chọn):
  - [ ] Thiết lập màu sắc tương phản cao
  - [ ] Tạo các đổ bóng cứng, rõ nét
  - [ ] Sử dụng font chữ đậm, đơn giản
  - [ ] Tạo các đường viền sắc nét
- [ ] Đảm bảo responsive design cho tất cả các màn hình

## 8. Tạo nội dung mẫu
- [ ] Tạo các bài viết mẫu bằng Markdown
- [ ] Tạo các trang tĩnh mẫu (About, Contact)
- [ ] Tạo các file JSON cấu hình trong thư mục data/

## 9. Triển khai lên Vercel
- [ ] Tạo tài khoản Vercel (nếu chưa có)
- [ ] Kết nối repository Git với Vercel
- [ ] Cấu hình các biến môi trường cần thiết
- [ ] Thiết lập tên miền tùy chỉnh (nếu có)
- [ ] Cấu hình webhook từ Git đến Vercel

## 10. Tối ưu hóa và SEO
- [ ] Tối ưu hóa hiệu năng:
  - [ ] Sử dụng Image Optimization của Next.js
  - [ ] Tối ưu hóa font loading
  - [ ] Tối ưu hóa JavaScript với code splitting
- [ ] Cấu hình SEO:
  - [ ] Tạo component Metadata cho mỗi trang
  - [ ] Tạo sitemap.xml
  - [ ] Tạo robots.txt
  - [ ] Thêm các thẻ meta cần thiết
- [ ] Đảm bảo accessibility (a11y)

## 11. Kiểm thử
- [ ] Kiểm thử trên các trình duyệt khác nhau
- [ ] Kiểm thử trên các thiết bị khác nhau
- [ ] Kiểm thử các tính năng đa ngôn ngữ
- [ ] Kiểm thử quy trình Decap CMS (tạo, chỉnh sửa, xuất bản bài viết)
- [ ] Kiểm thử hiệu năng (Lighthouse, Web Vitals)

## 12. Tài liệu hóa
- [ ] Cập nhật file README.md với hướng dẫn cài đặt và sử dụng
- [ ] Tạo tài liệu hướng dẫn sử dụng CMS cho người quản trị
- [ ] Tạo tài liệu phát triển cho nhà phát triển

## 13. Tính năng bổ sung (tùy chọn)
- [ ] Thêm chức năng tìm kiếm
- [ ] Thêm chức năng bình luận (với Disqus hoặc giải pháp khác)
- [ ] Thêm chức năng chia sẻ mạng xã hội
- [ ] Thêm chức năng đăng ký nhận thông báo/newsletter
- [ ] Thêm chức năng dark mode/light mode
- [ ] Thêm chức năng phân tích (Google Analytics, Plausible, v.v.)

## 14. Bảo trì và cập nhật
- [ ] Thiết lập quy trình cập nhật dependencies
- [ ] Thiết lập quy trình backup dữ liệu
- [ ] Lên kế hoạch cho các tính năng tương lai