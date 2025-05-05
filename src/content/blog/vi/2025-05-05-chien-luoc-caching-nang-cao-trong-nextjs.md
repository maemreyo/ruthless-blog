---
title: 'Chiến lược Caching Nâng cao trong Next.js'
date: '2025-05-05'
author: 'Wehttam'
excerpt: 'Phân tích chi tiết các lớp caching trong Next.js, cách kiểm soát và tối ưu hóa cache cho ứng dụng của bạn.'
tags: []
thumbnail: '/images/uploads/default-thumbnail.jpg'
category: 'Web Development'
series: 'Next.js App Router Deep Dive'
seriesPart: 2
draft: true
---

# Chiến lược Caching Nâng cao trong Next.js

Caching là một trong những tính năng mạnh mẽ nhất của Next.js App Router, giúp cải thiện đáng kể hiệu suất ứng dụng. Trong bài viết này, chúng ta sẽ đi sâu vào các lớp caching khác nhau, cách chúng hoạt động, và làm thế nào để kiểm soát chúng một cách hiệu quả.

## 1. Các lớp Caching trong Next.js

Next.js App Router có bốn lớp caching chính:

### 1.1 Request Memoization

Request Memoization là lớp caching đầu tiên, tự động deduplicate các requests trong cùng một render pass.

```tsx
// Hàm fetch này sẽ chỉ được gọi một lần trong cùng một render pass
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

// Cả hai component này sẽ sử dụng cùng một request
async function ProductPage() {
  const data = await getData();
  return (
    <>
      <Header data={data} />
      <Main data={data} />
    </>
  );
}
```

### 1.2 Data Cache

Data Cache lưu trữ kết quả của các network requests (fetch) và có thể được kiểm soát bằng các tùy chọn caching.

```tsx
// Mặc định: cached vĩnh viễn cho production, không cache cho development
fetch('https://api.example.com/data');

// Revalidate sau mỗi 10 giây
fetch('https://api.example.com/data', { next: { revalidate: 10 } });

// Không cache
fetch('https://api.example.com/data', { cache: 'no-store' });
```

### 1.3 Full Route Cache

Full Route Cache lưu trữ HTML và RSC payload của các trang tĩnh (static routes) khi build.

```tsx
// Mặc định: cached vĩnh viễn
export default function Page() {
  return <h1>Trang tĩnh</h1>;
}

// Revalidate sau mỗi 10 giây
export const revalidate = 10;

// Không cache
export const dynamic = 'force-dynamic';
```

### 1.4 Router Cache

Router Cache lưu trữ RSC payload của các trang đã truy cập trên client, giúp điều hướng nhanh hơn.

```tsx
// Xóa Router Cache cho một route cụ thể
router.refresh();

// Xóa toàn bộ Router Cache
router.push(router.asPath);
```

## 2. Kiểm soát Cache

### 2.1 Segment Config Options

Next.js cung cấp các tùy chọn cấu hình ở cấp độ segment để kiểm soát caching:

```tsx
// layout.tsx hoặc page.tsx
export const dynamic = 'auto' | 'force-dynamic' | 'error' | 'force-static';
export const dynamicParams = true | false;
export const revalidate = false | 0 | number;
export const fetchCache = 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store';
export const runtime = 'nodejs' | 'edge';
export const preferredRegion = 'auto' | 'global' | 'home' | string | string[];
```

### 2.2 Revalidation

Next.js hỗ trợ hai loại revalidation:

**Time-based Revalidation:**

```tsx
// Revalidate sau mỗi 60 giây
fetch('https://api.example.com/data', { next: { revalidate: 60 } });

// Hoặc ở cấp độ segment
export const revalidate = 60;
```

**On-demand Revalidation:**

```tsx
// Route Handler (API)
export async function POST(request) {
  // Revalidate một path cụ thể
  revalidatePath('/blog/post-1');
  
  // Revalidate dựa trên cache tag
  revalidateTag('blog-posts');
  
  return Response.json({ revalidated: true, now: Date.now() });
}
```

### 2.3 Cache Tags

Cache Tags cho phép bạn revalidate các fetch requests cụ thể:

```tsx
// Thêm cache tag khi fetch
fetch('https://api.example.com/posts', { next: { tags: ['posts'] } });

// Revalidate tất cả fetches với tag 'posts'
revalidateTag('posts');
```

## 3. Debugging Cache

### 3.1 Xác định Cache Hit/Miss

```tsx
// Thêm console.log để debug
async function getData() {
  console.log('Fetching data...');
  const res = await fetch('https://api.example.com/data');
  console.log('Fetch completed:', res.status, res.headers.get('x-cache'));
  return res.json();
}
```

### 3.2 Sử dụng Headers để Debug

```tsx
// Thêm timestamp để debug cache
export default async function Page() {
  const timestamp = new Date().toISOString();
  const data = await fetch(`https://api.example.com/data?_t=${timestamp}`);
  return <div>Data: {JSON.stringify(data)}</div>;
}
```

### 3.3 Các vấn đề phổ biến và cách giải quyết

1. **Cache không được invalidate:**
   - Kiểm tra xem bạn đang sử dụng đúng path/tag
   - Đảm bảo revalidatePath/revalidateTag được gọi đúng cách

2. **Dữ liệu không được cache:**
   - Kiểm tra các tùy chọn fetch
   - Xác nhận không có `cache: 'no-store'` hoặc `dynamic: 'force-dynamic'`

3. **Dữ liệu luôn được fetch lại:**
   - Kiểm tra xem có `revalidate: 0` hoặc `cache: 'no-store'` không
   - Xác nhận không có timestamp hoặc random query parameter

## 4. Chiến lược Invalidation

### 4.1 Time-based vs. On-demand

| Loại | Ưu điểm | Nhược điểm | Khi nào sử dụng |
|------|---------|------------|-----------------|
| Time-based | Đơn giản, không cần code thêm | Có thể hiển thị dữ liệu cũ | Dữ liệu ít thay đổi, không quan trọng tính thời gian thực |
| On-demand | Dữ liệu luôn mới, kiểm soát tốt hơn | Phức tạp hơn, cần endpoint | Dữ liệu quan trọng, cần cập nhật ngay khi có thay đổi |

### 4.2 Hybrid Approach

Kết hợp cả hai phương pháp để có hiệu suất tối ưu:

```tsx
// Revalidate sau 1 giờ (phòng trường hợp on-demand không được gọi)
export const revalidate = 3600;

// Fetch với cache tag
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] }
  });
  return res.json();
}

// Route handler để revalidate khi có sản phẩm mới
export async function POST(request) {
  const { token } = await request.json();
  
  // Xác thực token
  if (token !== process.env.REVALIDATION_TOKEN) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  try {
    revalidateTag('products');
    return Response.json({ revalidated: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### 4.3 Granular Revalidation

Revalidate chỉ những dữ liệu cần thiết:

```tsx
// Sử dụng nhiều cache tags
async function getProduct(id) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { tags: [`product-${id}`, 'products'] }
  });
  return res.json();
}

// Revalidate một sản phẩm cụ thể
revalidateTag(`product-123`);

// Revalidate tất cả sản phẩm
revalidateTag('products');
```

## 5. Các Pattern Caching Nâng cao

### 5.1 Stale-While-Revalidate (SWR)

```tsx
// Hiển thị dữ liệu cũ ngay lập tức, sau đó cập nhật khi có dữ liệu mới
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // Revalidate sau 60 giây
  });
  
  return <DataComponent data={data} />;
}
```

### 5.2 Parallel và Interleaved Caching

```tsx
// Parallel caching
async function ParallelCaching() {
  const productsPromise = getProducts();
  const categoriesPromise = getCategories();
  
  const [products, categories] = await Promise.all([
    productsPromise,
    categoriesPromise
  ]);
  
  return (
    <>
      <ProductList products={products} />
      <CategoryList categories={categories} />
    </>
  );
}

// Interleaved caching với Suspense
export default function InterleavedCaching() {
  return (
    <>
      <Header />
      <Suspense fallback={<ProductSkeleton />}>
        <Products />
      </Suspense>
      <Suspense fallback={<CategorySkeleton />}>
        <Categories />
      </Suspense>
    </>
  );
}
```

### 5.3 Conditional Caching

```tsx
async function getDataWithConditionalCaching(userId) {
  // Nếu có userId, không cache (dữ liệu cá nhân)
  // Nếu không có userId, cache (dữ liệu công khai)
  const cacheOption = userId ? { cache: 'no-store' } : { next: { revalidate: 3600 } };
  
  const res = await fetch(`https://api.example.com/data?userId=${userId || ''}`, cacheOption);
  return res.json();
}
```

## 6. Kết luận

Hiểu và kiểm soát caching trong Next.js App Router là chìa khóa để xây dựng ứng dụng có hiệu suất cao. Bằng cách kết hợp các lớp caching và chiến lược invalidation khác nhau, bạn có thể tạo ra trải nghiệm người dùng tuyệt vời mà không ảnh hưởng đến tính cập nhật của dữ liệu.

Trong bài viết tiếp theo của series, chúng ta sẽ tìm hiểu về các tính năng nâng cao của App Router như Parallel Routes, Intercepting Routes và cách xử lý lỗi hiệu quả.

## Tài liệu tham khảo

- [Next.js Documentation - Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.js Documentation - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Documentation - Revalidating Data](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
