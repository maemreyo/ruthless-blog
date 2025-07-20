# TODO: Danh sách công việc cho Blog Cá nhân

## 🔍 NGHIÊN CỨU ADMIN UI SYSTEM (ĐANG THỰC HIỆN)

### Phase 1: Phân tích hiện tại (✅ HOÀN THÀNH)
- [x] Nghiên cứu cấu trúc blog management hiện tại
- [x] Phân tích workflow quản lý bài viết trong src/lib/blog.ts
- [x] Kiểm tra cấu trúc content trong src/content/blog/
- [x] Phân tích Decap CMS configuration
- [x] Đánh giá các components form và UI hiện có
- [x] Nghiên cứu scripts quản lý (create-post.js, etc.)

### Phase 2: Lập kế hoạch triển khai Admin UI (🔄 ĐANG THỰC HIỆN)
- [ ] Thiết kế kiến trúc Admin UI system
- [ ] Xác định CRUD operations cần thiết
- [ ] Lập kế hoạch integration với existing architecture
- [ ] Xác định components cần tạo mới
- [ ] Thiết kế data flow và state management

## 1. Thiết lập dự án Next.js
- [ ] Khởi tạo dự án Next.js với App Router
- [ ] Cài đặt các dependencies cần thiết (Tailwind CSS, Framer Motion, next-intl, v.v.)
- [ ] Thiết lập cấu trúc thư mục cơ bản (app/, components/, lib/, public/, content/, data/, messages/)
- [ ] Cấu hình Tailwind CSS (tailwind.config.js)
- [ ] Thiết lập hỗ trợ đa ngôn ngữ với next-intl
  - [ ] Tạo file i18n.ts và navigation.ts
  - [ ] Tạo middleware.ts cho định tuyến đa ngôn ngữ
  - [ ] Tạo thư mục messages/ với các file ngôn ngữ (en.json, vi.json)
- [ ] Đảm bảo tương thích với Next.js 15
  - [ ] Cập nhật các tham số params trong các hàm async để sử dụng await

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
  - [ ] getFeaturedPosts (lấy bài viết nổi bật)
  - [ ] getRelatedPosts (lấy bài viết liên quan)
  - [ ] getAllPostSlugs (lấy tất cả các slug của bài viết)
- [ ] Tạo các hàm xử lý đa ngôn ngữ
- [ ] Tạo các hàm tiện ích khác:
  - [ ] formatDate (định dạng ngày tháng theo locale)
  - [ ] getReadingTime (tính thời gian đọc bài viết)
  - [ ] slugify (tạo slug từ chuỗi)
  - [ ] parseMarkdown (phân tích cú pháp Markdown)

## 6. Tích hợp Framer Motion
- [ ] Thiết lập animation chuyển trang trong template.tsx
- [ ] Tạo các animation cho components:
  - [ ] Hiệu ứng hover cho các nút và card
  - [ ] Hiệu ứng xuất hiện cho danh sách bài viết
  - [ ] Hiệu ứng loading
  - [ ] Hiệu ứng scroll-triggered
- [ ] Tạo các variants animation có thể tái sử dụng:
  - [ ] fadeInUp (hiệu ứng xuất hiện từ dưới lên)
  - [ ] staggerContainer (hiệu ứng xuất hiện tuần tự)
  - [ ] hoverScale (hiệu ứng phóng to khi hover)
  - [ ] buttonHover (hiệu ứng cho nút)

## 7. Thiết kế giao diện với Tailwind CSS
- [ ] Thiết kế theme chung (màu sắc, typography, spacing)
- [ ] Tạo các custom utilities trong tailwind.config.js:
  - [ ] Tạo shadow-elegant và shadow-float cho hiệu ứng đổ bóng
  - [ ] Tạo các màu primary, accent, và các biến thể
  - [ ] Tạo các gradient tùy chỉnh
- [ ] Áp dụng phong cách Neobrutalism (nếu chọn):
  - [ ] Thiết lập màu sắc tương phản cao
  - [ ] Tạo các đổ bóng cứng, rõ nét
  - [ ] Sử dụng font chữ đậm, đơn giản
  - [ ] Tạo các đường viền sắc nét
- [ ] Thiết lập dark mode với Tailwind:
  - [ ] Tạo các biến thể dark cho các màu sắc
  - [ ] Tạo các biến thể dark cho các component
- [ ] Đảm bảo responsive design cho tất cả các màn hình:
  - [ ] Mobile-first approach
  - [ ] Breakpoints cho tablet và desktop
  - [ ] Tối ưu hóa layout cho các kích thước màn hình khác nhau

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
<!-- 
## 10. Tối ưu hóa và SEO
- [ ] Tối ưu hóa hiệu năng:
  - [ ] Sử dụng Image Optimization của Next.js
  - [ ] Tối ưu hóa font loading
  - [ ] Tối ưu hóa JavaScript với code splitting
  - [ ] Sử dụng Incremental Static Regeneration (ISR) cho nội dung thay đổi
  - [ ] Tối ưu hóa Server Components và Client Components
  - [ ] Sử dụng React.lazy() cho các component lớn
- [ ] Cấu hình SEO:
  - [ ] Tạo component Metadata cho mỗi trang
  - [ ] Tạo sitemap.xml
  - [ ] Tạo robots.txt
  - [ ] Thêm các thẻ meta cần thiết
  - [ ] Tối ưu hóa OpenGraph và Twitter Cards
  - [ ] Tạo structured data (JSON-LD) cho các bài viết
- [ ] Đảm bảo accessibility (a11y):
  - [ ] Kiểm tra và cải thiện ARIA attributes
  - [ ] Đảm bảo đủ contrast ratio
  - [ ] Hỗ trợ keyboard navigation
  - [ ] Tối ưu hóa cho screen readers
 -->


## 13. Tính năng bổ sung (tùy chọn)
- [ ] Thêm chức năng tìm kiếm:
  - [ ] Tạo component SearchBar
  - [ ] Tạo API route cho tìm kiếm
  - [ ] Tạo trang kết quả tìm kiếm
- [ ] Thêm chức năng bình luận (với Disqus hoặc giải pháp khác):
  - [ ] Tích hợp Disqus hoặc Giscus (GitHub Discussions)
  - [ ] Tạo component Comments
- [ ] Thêm chức năng chia sẻ mạng xã hội:
  - [ ] Tạo component ShareButtons
  - [ ] Hỗ trợ các nền tảng phổ biến (Facebook, Twitter, LinkedIn)
- [ ] Thêm chức năng đăng ký nhận thông báo/newsletter:
  - [ ] Tạo form đăng ký
  - [ ] Tích hợp với dịch vụ email marketing (Mailchimp, ConvertKit)
- [ ] Thêm chức năng dark mode/light mode:
  - [ ] Tạo ThemeProvider
  - [ ] Tạo ThemeToggle component
  - [ ] Lưu trữ preference trong localStorage
- [ ] Thêm chức năng phân tích (Google Analytics, Plausible, v.v.):
  - [ ] Tích hợp Google Analytics hoặc Plausible
  - [ ] Theo dõi các sự kiện tùy chỉnh
- [ ] Thêm chức năng đọc tiếp (Related posts):
  - [ ] Tạo component RelatedPosts
  - [ ] Thuật toán gợi ý bài viết liên quan
- [ ] Thêm chức năng Table of Contents:
  - [ ] Tạo component TableOfContents
  - [ ] Tự động sinh từ các heading trong bài viết

## 14. Bảo trì và cập nhật
- [ ] Thiết lập quy trình cập nhật dependencies
- [ ] Thiết lập quy trình backup dữ liệu
- [ ] Lên kế hoạch cho các tính năng tương lai
- [ ] Thiết lập CI/CD với GitHub Actions:
  - [ ] Tự động kiểm tra linting và formatting
  - [ ] Tự động chạy tests
  - [ ] Tự động deploy khi merge vào main branch

## 15. Triển khai các phần "Giả sử" trong code
- [ ] Triển khai đầy đủ các hàm đọc và xử lý file Markdown
- [ ] Triển khai đầy đủ các hàm tiện ích
- [ ] Triển khai đầy đủ các component UI
- [ ] Triển khai đầy đủ các trang
- [ ] Triển khai đầy đủ các tính năng đa ngôn ngữ
- [ ] Triển khai đầy đủ các animation