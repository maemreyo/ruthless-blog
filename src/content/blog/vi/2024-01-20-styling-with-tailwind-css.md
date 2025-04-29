---
title: 'Tạo style với Tailwind CSS'
date: '2024-01-20'
author: 'Wehttam'
excerpt: 'Khám phá sức mạnh của CSS tiện ích với Tailwind CSS và cách nó có thể tăng tốc quy trình phát triển của bạn.'
tags: ['tailwind css', 'css', 'web design']
thumbnail: '/images/uploads/tailwind-thumbnail.jpg'
featured: true
---

# Tạo style với Tailwind CSS

Tailwind CSS là một framework CSS tiện ích (utility-first) cho phép bạn xây dựng giao diện nhanh chóng mà không cần viết CSS tùy chỉnh. Thay vì các component được định nghĩa trước, Tailwind cung cấp các lớp tiện ích cấp thấp mà bạn có thể kết hợp để tạo ra bất kỳ thiết kế nào.

## Tại sao chọn Tailwind CSS?

Tailwind CSS mang lại nhiều lợi ích:

- **Phát triển nhanh hơn**: Không cần chuyển đổi giữa file HTML và CSS
- **Tùy biến dễ dàng**: Dễ dàng tùy chỉnh thiết kế mà không cần ghi đè CSS
- **Kích thước nhỏ hơn**: Chỉ bao gồm các lớp bạn thực sự sử dụng trong production
- **Responsive dễ dàng**: Các tiền tố như sm:, md:, lg: giúp dễ dàng tạo thiết kế responsive
- **Tính nhất quán**: Hệ thống thiết kế được tích hợp sẵn giúp duy trì tính nhất quán

## Cài đặt Tailwind CSS

Để bắt đầu với Tailwind CSS trong dự án Next.js, bạn có thể làm theo các bước sau:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Sau đó, cấu hình `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Cuối cùng, thêm các chỉ thị Tailwind vào file CSS chính của bạn:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Ví dụ sử dụng Tailwind CSS

Dưới đây là một ví dụ về cách sử dụng Tailwind CSS để tạo một card đơn giản:

```jsx
<div className="max-w-sm rounded overflow-hidden shadow-lg">
  <img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" />
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p className="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
    </p>
  </div>
  <div className="px-6 pt-4 pb-2">
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
  </div>
</div>
```

## Kết luận

Tailwind CSS là một công cụ mạnh mẽ cho phát triển web hiện đại. Nó giúp bạn tạo giao diện nhanh chóng và dễ dàng mà không cần viết CSS tùy chỉnh. Hãy thử Tailwind CSS ngay hôm nay!