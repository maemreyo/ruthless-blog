---
title: Deep Dive React Server Components (RSC) - Phần 1 Series Next.js
date: "2025-05-05"
author: Wehttam
excerpt: >-
  Phân tích sâu về React Server Components (RSC): cơ chế hoạt động cốt lõi, sự khác biệt then chốt với Client Components, và tại sao chúng thay đổi cách xây dựng ứng dụng Next.js với mô hình "Server-First".
tags: ["React", "Next.js", "Server Components", "RSC", "Web Development", "Frontend", "App Router"]
thumbnail: >-
  https://raw.githubusercontent.com/maemreyo/wehttam-blog-images/main/posts/2025/05/react-server-components-va-server-actions/rsc-sa-hero.jpg # Giữ thumbnail từ template, bạn có thể thay đổi nếu cần
category: Web Development
series: Next.js App Router Deep Dive
seriesPart: 1
---

# Deep Dive React Server Components (RSC): Thay Đổi Cuộc Chơi Rendering Trong Next.js

React Server Components (RSC) không chỉ là một tính năng mới trong hệ sinh thái React/Next.js; đó là một sự thay đổi cơ bản trong cách chúng ta tư duy và xây dựng giao diện người dùng web. Thay vì dồn gánh nặng render và logic lên trình duyệt, RSC đưa phần lớn công việc trở lại server, mở ra những khả năng tối ưu hóa hiệu suất và đơn giản hóa luồng dữ liệu mà trước đây khó đạt được.

Bài viết này, phần đầu tiên trong series **Next.js App Router Deep Dive**, sẽ đi sâu vào bản chất của RSC, lý do nó tồn tại và cách nó hoạt động cốt lõi trong ngữ cảnh Next.js App Router. Chúng ta sẽ *không* ôn lại kiến thức React cơ bản, mà tập trung vào những gì làm cho RSC trở nên khác biệt và mạnh mẽ.

## Tại Sao Cần Đến React Server Components?

Trước khi có RSC, mô hình phổ biến là Client Components (CC) được render phía server (SSR/SSG) sau đó "hydrate" phía client. Mô hình này hiệu quả nhưng đối mặt với vài thách thức cố hữu khi ứng dụng phức tạp hơn:

1.  **Bundle Size Phình To:** Mọi Client Component, dù chỉ render tĩnh một lần, đều đóng góp vào gói JavaScript gửi xuống trình duyệt. Điều này làm chậm quá trình tải trang ban đầu (Initial Page Load) và Time to Interactive (TTI).
2.  **Client-Side Data Fetching Waterfalls:** Việc fetch dữ liệu trong `useEffect` ở nhiều component lồng nhau có thể tạo ra các "thác nước" yêu cầu mạng, trì hoãn việc hiển thị UI hoàn chỉnh.
3.  **Phụ Thuộc Vào Tài Nguyên Client:** Hiệu suất render và tương tác phụ thuộc nhiều vào sức mạnh thiết bị và điều kiện mạng của người dùng.
4.  **Tiết Lộ Logic/Endpoint Nhạy Cảm:** Việc fetch dữ liệu trực tiếp từ Client Components đôi khi đòi hỏi phải expose các API hoặc logic mà bạn muốn giữ kín phía server.

RSC ra đời để giải quyết trực tiếp những vấn đề này bằng cách giới thiệu một loại component *chỉ* chạy trên server.

## Cơ Chế Hoạt Động Cốt Lõi Của RSC

Điểm mấu chốt cần nắm về RSC là chúng **thực thi hoàn toàn trên server** và **không gửi bất kỳ mã JavaScript nào của chính nó xuống client**.

1.  **Thực Thi Độc Quyền Trên Server:** Mã nguồn của một RSC chỉ tồn tại và chạy trong môi trường Node.js (hoặc Edge runtime) trên server. Nó không bao giờ là một phần của gói JavaScript client.
2.  **Truy Cập Trực Tiếp Tài Nguyên Backend:** Vì chạy trên server, RSC có thể truy cập trực tiếp vào cơ sở dữ liệu, hệ thống tệp, các microservice nội bộ, hoặc lấy các API key/secret một cách an toàn mà không cần thông qua một lớp API trung gian.
    ```jsx
    // app/page.jsx (Mặc định là Server Component)
    import db from './lib/db'; // Giả sử có module kết nối DB

    async function getData() {
      // Truy cập trực tiếp DB - điều không thể làm ở Client Component
      const posts = await db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 10');
      return posts;
    }

    export default async function HomePage() {
      const posts = await getData();

      return (
        <div>
          <h1>Latest Posts</h1>
          <ul>
            {posts.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
          {/* Có thể render Client Component từ Server Component */}
          {/* <InteractiveButton /> */}
        </div>
      );
    }
    ```
3.  **Kết Quả Render Không Phải HTML:** Đây là điểm khác biệt quan trọng so với SSR truyền thống. Khi một RSC render, nó không tạo ra chuỗi HTML. Thay vào đó, nó tạo ra một định dạng mô tả UI đặc biệt (thường gọi là **RSC Payload**). Định dạng này giống như một Virtual DOM được tuần tự hóa (serialized), chứa kết quả render của RSC và các "chỗ giữ chỗ" (placeholders) cho Client Components (nếu có).
4.  **Zero Client-Side Runtime:** Vì không có JavaScript nào của RSC được gửi đi, chúng không cần và không thể sử dụng các hook như `useState`, `useEffect`, `useReducer`, hay các trình xử lý sự kiện (`onClick`, `onChange`, v.v.). Chúng cũng không thể truy cập các API của trình duyệt (như `window` hay `localStorage`).

## Server Components vs. Client Components: Khi Nào Dùng Gì?

Việc hiểu rõ sự khác biệt và mục đích của từng loại là chìa khóa để xây dựng ứng dụng hiệu quả với App Router.

| Tính Chất                  | React Server Component (RSC)                     | Client Component (CC - đánh dấu bởi `'use client'`) |
| :------------------------- | :----------------------------------------------- | :------------------------------------------------- |
| **Nơi thực thi**          | **Chỉ Server**                                   | Server (SSR/SSG ban đầu) & **Client (Hydration & Tương tác)** |
| **Gửi JS xuống Client?** | **Không** (Zero JS footprint)                    | **Có** (Đóng góp vào bundle size)                 |
| **Truy cập Backend?**     | **Có** (Trực tiếp DB, filesystem, API secrets) | **Không** (Phải gọi API routes/Server Actions)    |
| **State & Lifecycle?**   | **Không** (`useState`, `useEffect` không dùng được) | **Có** (Sử dụng hooks thoải mái)                   |
| **Tương tác & Event?**   | **Không** (`onClick`, `onChange` không dùng được) | **Có** (Xử lý sự kiện phía client)                |
| **Browser APIs?**        | **Không** (`window`, `document` không dùng được) | **Có** (Sử dụng API trình duyệt)                  |
| **Mặc định trong App Router?** | **Có**                                       | **Không** (Phải khai báo `'use client'`)            |

**Quy tắc ngón tay cái (Rule of Thumb):**

*   **Bắt đầu với Server Components:** Đây là mặc định. Sử dụng RSC cho mọi thứ có thể: fetch dữ liệu, render nội dung tĩnh hoặc gần tĩnh, truy cập tài nguyên backend.
*   **Chuyển sang Client Components (`'use client'`) KHI CẦN:** Chỉ sử dụng Client Components khi bạn *thực sự* cần một trong các khả năng sau:
    *   Tương tác người dùng (event handlers như `onClick`, `onSubmit`).
    *   State và Lifecycle Hooks (`useState`, `useEffect`, `useReducer`, `useContext`).
    *   Sử dụng các API chỉ có trên trình duyệt (`localStorage`, `window.location`).
    *   Sử dụng thư viện UI của bên thứ ba mà chúng phụ thuộc vào state hoặc browser APIs.

`[Đề xuất Sơ đồ/Hình ảnh tại đây để minh họa: Sơ đồ cây component với các node RSC và CC, chỉ rõ dòng dữ liệu và nơi thực thi]`

## Mô Hình "Server-First": Tư Duy Mới

RSC thúc đẩy một mô hình **"Server-First"**. Thay vì cố gắng đẩy mọi thứ lên client và chỉ dùng server cho API, giờ đây chúng ta ưu tiên giữ logic và việc render trên server càng nhiều càng tốt. Client Components trở thành những "hòn đảo" tương tác cần thiết trong một "biển" Server Components tĩnh hoặc render động phía server.

Lợi ích chính của tư duy này:

*   **Giảm Tải Cho Client:** Trình duyệt chỉ cần tải và thực thi JavaScript cho các phần thực sự cần tương tác.
*   **Cải Thiện Performance:** Giảm bundle size, cải thiện TTI, và tận dụng sức mạnh của server để xử lý dữ liệu nặng.
*   **Đơn Giản Hóa Data Fetching:** Fetch dữ liệu ngay tại component cần nó, giảm bớt nhu cầu về state management phức tạp chỉ để truyền dữ liệu.

## Kết Luận Sơ Bộ

React Server Components là một bước tiến lớn, cho phép chúng ta xây dựng ứng dụng web nhanh hơn, nhẹ hơn và có kiến trúc rõ ràng hơn bằng cách tận dụng tối đa sức mạnh của server. Việc hiểu rõ cách chúng hoạt động, sự khác biệt với Client Components và áp dụng tư duy "Server-First" là nền tảng quan trọng để làm chủ Next.js App Router.

Trong các bài viết tiếp theo của series **Next.js App Router Deep Dive**, chúng ta sẽ khám phá cách RSC kết hợp với **Server Actions** để xử lý đột biến dữ liệu từ server, và cách **Streaming UI với Suspense** nâng cao trải nghiệm người dùng trong kiến trúc mới này.