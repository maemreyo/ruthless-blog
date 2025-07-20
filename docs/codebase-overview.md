# Tổng Quan Codebase Wehttam Blog

Tài liệu này cung cấp cái nhìn tổng quan về cấu trúc và các công nghệ chính được sử dụng trong dự án Wehttam Blog, giúp bạn dễ dàng nghiên cứu và phát triển thêm.

## 1. Tổng Quan Dự Án

Dự án Wehttam Blog được xây dựng trên nền tảng:
-   **Next.js 15.x (App Router):** Framework React mạnh mẽ cho các ứng dụng web hiện đại, hỗ trợ Server Components, Server Actions, định tuyến dựa trên file system, tối ưu hóa hình ảnh và nhiều hơn nữa.
-   **TypeScript:** Ngôn ngữ lập trình có kiểu tĩnh, giúp tăng cường khả năng bảo trì và phát hiện lỗi sớm.
-   **Tailwind CSS:** Framework CSS utility-first, giúp xây dựng giao diện nhanh chóng và linh hoạt.
-   **Framer Motion:** Thư viện JavaScript để tạo các hiệu ứng động và tương tác mượt mà.
-   **next-intl:** Thư viện để quản lý đa ngôn ngữ (i18n).

## 2. Cấu Trúc Thư Mục Chính

Dự án tuân theo cấu trúc thư mục tiêu chuẩn của Next.js với một số bổ sung:

-   `src/app/`: Chứa các route của ứng dụng (sử dụng App Router). Mỗi thư mục con trong `app` đại diện cho một route.
    -   `src/app/[locale]/`: Đây là thư mục gốc cho các route đa ngôn ngữ, nơi `[locale]` sẽ được thay thế bằng `en` hoặc `vi`.
    -   `src/app/api/`: Chứa các API Routes (nếu có).
-   `src/components/`: Chứa các React component có thể tái sử dụng.
    -   `src/components/blog/`: Các component cụ thể cho phần blog (ví dụ: `EnhancedBlogGrid`, `BlogPostCard`).
    -   `src/components/home/`: Các component cho trang chủ.
    -   `src/components/layout/`: Các component bố cục chung (Header, Footer, Navigation).
    -   `src/components/ui/`: Các component UI cơ bản, có thể được sử dụng lại (ví dụ: `LiquidButton`, `ParallaxMouse`).
    -   `src/components/icons/`: Chứa các icon (ví dụ: `PhosphorIcons`).
-   `src/content/`: Nơi lưu trữ nội dung tĩnh của blog dưới dạng file Markdown.
    -   `src/content/blog/[locale]/`: Các bài viết blog, được tổ chức theo ngôn ngữ.
    -   `src/content/pages/[locale]/`: Các trang tĩnh khác (ví dụ: About, Contact).
-   `src/data/`: Chứa các file JSON cấu hình hoặc dữ liệu tĩnh (ví dụ: `author.json`, `navigation.json`).
-   `src/i18n/`: Chứa cấu hình và các file dịch thuật cho tính năng đa ngôn ngữ.
    -   `src/messages/`: Các file JSON chứa chuỗi dịch thuật cho từng ngôn ngữ (ví dụ: `en.json`, `vi.json`).
-   `src/lib/`: Chứa các hàm tiện ích (utility functions) và logic xử lý dữ liệu.
    -   `src/lib/blog.ts`: Chứa logic để đọc và xử lý các file Markdown từ `src/content/blog`, bao gồm việc phân tích frontmatter và nội dung.
    -   `src/lib/utils.ts`: Các hàm tiện ích chung.
-   `public/`: Chứa các tài nguyên tĩnh được phục vụ trực tiếp (hình ảnh, font, `robots.txt`).
    -   `public/images/uploads/`: Thư mục mặc định cho các hình ảnh được tải lên.
-   `scripts/`: Chứa các script Node.js để tự động hóa các tác vụ phát triển (ví dụ: tạo bài viết mới, xử lý hình ảnh).
-   `docs/`: Nơi chứa các tài liệu hướng dẫn và tổng quan codebase.

## 3. Quản Lý Nội Dung (Markdown & Frontmatter)

Nội dung của blog được viết dưới dạng file Markdown (`.md`) và được lưu trữ trong `src/content/blog/`. Mỗi file Markdown bắt đầu bằng một khối **frontmatter** (YAML) chứa các metadata của bài viết như tiêu đề, ngày, tác giả, mô tả, category, series, tags, thumbnail, v.v.

**Ví dụ về Frontmatter:**

```yaml
---
title: 'Tiêu đề bài viết'
date: 'YYYY-MM-DD'
author: 'Tên tác giả'
excerpt: 'Mô tả ngắn về bài viết.'
tags: ['tag1', 'tag2']
thumbnail: '/images/uploads/thumbnail.jpg'
category: 'Category của bài viết'
series: 'Tên series (nếu có)'
seriesPart: 1
featured: true # Hoặc false
draft: true # Hoặc false
---
```

Hàm `getAllPosts` và các hàm liên quan trong `src/lib/blog.ts` chịu trách nhiệm đọc các file Markdown này, phân tích frontmatter và nội dung, sau đó trả về dữ liệu đã được cấu trúc để các component React có thể sử dụng.

## 4. Quản Lý Hình Ảnh

Dự án sử dụng một cơ chế đặc biệt để quản lý hình ảnh, tách biệt chúng khỏi repository chính và phân phát qua CDN:

-   **Repository hình ảnh riêng:** Hình ảnh được lưu trữ trong một kho Git riêng biệt (`maemreyo/wehttam-blog-images`).
-   **jsDelivr CDN:** Hình ảnh được phân phát thông qua jsDelivr, hoạt động như một Content Delivery Network để tối ưu hóa tốc độ tải.
-   **Scripts xử lý hình ảnh:**
    -   `scripts/upload-image.js`: Tải lên một hình ảnh đơn lẻ.
    -   `scripts/upload-images.js`: Tải lên nhiều hình ảnh từ một thư mục.
    -   `scripts/process-post-images-new.js`: **Script quan trọng nhất.** Nó quét các file Markdown, tìm các đường dẫn hình ảnh cục bộ, tải chúng lên repository hình ảnh, và sau đó cập nhật các đường dẫn trong file Markdown để trỏ đến URL CDN của jsDelivr. Script này cũng có tùy chọn để tối ưu hóa hình ảnh.
    -   `scripts/setup-decap-cms-images.js`: Cấu hình Decap CMS để sử dụng cơ chế quản lý hình ảnh này.

**Khi thêm hình ảnh vào bài viết:** Bạn nên đặt hình ảnh vào thư mục `public/images/uploads/` hoặc một thư mục con khác trong `public/`. Sau đó, chạy `npm run process-post -- --post path/to/your-post.md` để tự động xử lý và đồng bộ hóa hình ảnh.

## 5. Quốc Tế Hóa (Internationalization - i18n)

Dự án sử dụng `next-intl` để hỗ trợ đa ngôn ngữ:

-   **Cấu hình:** Các file cấu hình i18n nằm trong `src/i18n/`.
-   **File dịch thuật:** Các chuỗi dịch thuật được định nghĩa trong các file JSON tại `src/messages/` (ví dụ: `en.json`, `vi.json`).
-   **Sử dụng:** Các component có thể truy cập các chuỗi dịch thuật thông qua hook `useTranslations` (client components) hoặc hàm `getTranslations` (server components). Định tuyến đa ngôn ngữ được xử lý tự động bởi Next.js và `next-intl` thông qua cấu trúc `src/app/[locale]/`.

## 6. Styling và UI

-   **Tailwind CSS:** Được sử dụng để tạo kiểu cho toàn bộ ứng dụng. Các lớp tiện ích của Tailwind được áp dụng trực tiếp trong JSX.
-   **Framer Motion:** Được sử dụng rộng rãi để tạo các hiệu ứng chuyển động và tương tác mượt mà cho các phần tử UI, đặc biệt là trong các component như `EnhancedBlogGrid`, `ImmersiveHero`, `ParallaxMouse`, v.v.

## 7. Các Điểm Cần Lưu Ý Khi Phát Triển

-   **Server Components vs. Client Components:** Next.js App Router phân biệt rõ ràng giữa Server Components (mặc định) và Client Components (`'use client'`). Hãy đảm bảo bạn sử dụng đúng loại component cho từng tác vụ.
-   **Data Fetching:** Dữ liệu cho các bài viết blog được lấy ở Server Components (`src/app/[locale]/blog/page.tsx`) và sau đó truyền xuống Client Components.
-   **Scripts:** Luôn kiểm tra các script trong thư mục `scripts/` trước khi thực hiện các tác vụ lặp lại hoặc quản lý nội dung. Chúng là công cụ mạnh mẽ để tự động hóa.
-   **Đồng bộ hóa hình ảnh:** Nhớ chạy script `process-post` hoặc `upload-images` sau khi thêm hình ảnh mới vào bài viết hoặc thư mục `public/images/uploads/` để đảm bảo chúng được tải lên CDN và các đường dẫn được cập nhật.
-   **ESLint và TypeScript:** Dự án sử dụng ESLint và TypeScript để duy trì chất lượng code. Hãy chú ý đến các cảnh báo và lỗi từ chúng.

Hy vọng tài liệu này sẽ giúp bạn có cái nhìn rõ ràng hơn về codebase và bắt đầu phát triển một cách tự tin!

## 8. Các Mục Tiêu Nâng Cấp và Phát Triển Tương Lai

Dưới đây là một số mục tiêu nâng cấp và phát triển tiềm năng để cải thiện dự án Wehttam Blog:

-   **Sử dụng Shadcn UI Components:** Thay thế các component UI tự viết bằng các component chất lượng cao từ Shadcn UI để tăng tốc độ phát triển, đảm bảo tính nhất quán và khả năng mở rộng của giao diện người dùng.
-   **Tích hợp Tiptap (phiên bản miễn phí) cho việc render bài viết:** Thay thế cơ chế render Markdown hiện tại bằng Tiptap để cung cấp trải nghiệm soạn thảo và hiển thị bài viết phong phú hơn, hỗ trợ các tính năng chỉnh sửa nâng cao.
-   **Xây dựng cơ chế quản lý bài viết (Admin UI):** Phát triển một giao diện quản trị (Admin UI) để quản lý bài viết, category, series, và các nội dung khác một cách trực quan, thay vì chỉnh sửa trực tiếp file Markdown.
-   **Thêm cơ chế đính kèm video sử dụng YouTube API v3:** Xây dựng một quy trình tương tự như quản lý hình ảnh hiện tại, cho phép đính kèm video từ YouTube vào bài viết thông qua YouTube Data API v3, tự động nhúng và tối ưu hóa hiển thị video.
-   **Triển khai GitHub Actions cho CI/CD:** Thiết lập các workflow tự động trên GitHub Actions để tự động hóa quy trình kiểm thử, build và deploy dự án mỗi khi có thay đổi trên repository, đảm bảo chất lượng và tốc độ triển khai.
