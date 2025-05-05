---
title: 'React Server Components và Server Actions'
date: '2025-05-05'
author: 'Wehttam'
excerpt: 'Phân tích sâu về React Server Components, cách hoạt động, sự khác biệt với Client Components, và cách sử dụng Server Actions hiệu quả.'
tags: []
thumbnail: '/images/uploads/default-thumbnail.jpg'
category: 'Web Development'
series: 'Next.js App Router Deep Dive'
seriesPart: 1
featured: true
---

# React Server Components và Server Actions

React Server Components (RSC) và Server Actions là hai tính năng quan trọng nhất của Next.js App Router, mang lại một mô hình phát triển mới cho ứng dụng React hiện đại. Trong bài viết này, chúng ta sẽ đi sâu vào cách hoạt động, ưu điểm, và các pattern phổ biến khi làm việc với chúng.

## 1. React Server Components: Nền tảng của App Router

### 1.1 Server Components là gì?

Server Components là một loại component React được render hoàn toàn trên server. Khác với Client Components truyền thống, Server Components:

- Không bao giờ chạy trên client
- Không thể sử dụng các React hooks (useState, useEffect, ...)
- Có thể truy cập trực tiếp vào tài nguyên server (database, filesystem, ...)
- Không làm tăng kích thước JavaScript bundle

### 1.2 Sự khác biệt giữa Server Components và Client Components

| Tính năng | Server Components | Client Components |
|-----------|------------------|-------------------|
| Render ở đâu | Server | Client |
| Có thể sử dụng hooks không? | Không | Có |
| Có thể truy cập tài nguyên server không? | Có | Không |
| Có thể xử lý sự kiện người dùng không? | Không | Có |
| Có thể sử dụng useEffect không? | Không | Có |
| Có thể truy cập browser APIs không? | Không | Có |

### 1.3 Mô hình "Server-first" của Next.js

Next.js App Router áp dụng mô hình "Server-first", trong đó:

- Tất cả components mặc định là Server Components
- Client Components được chỉ định rõ ràng bằng directive `'use client'`
- Dữ liệu được fetch trên server, gần với nguồn dữ liệu
- JavaScript được gửi xuống client chỉ khi cần thiết

### 1.4 Khi nào nên sử dụng Server Components vs Client Components

**Sử dụng Server Components khi:**
- Fetch dữ liệu
- Truy cập tài nguyên backend
- Giữ thông tin nhạy cảm trên server (API keys, tokens, ...)
- Giảm JavaScript cho client

**Sử dụng Client Components khi:**
- Cần tương tác người dùng (onClick, onChange, ...)
- Sử dụng React hooks (useState, useEffect, useContext, ...)
- Sử dụng browser APIs
- Sử dụng các thư viện phụ thuộc vào các tính năng trên

## 2. Server Actions: Xử lý Form và Mutations

### 2.1 Server Actions là gì?

Server Actions là các hàm JavaScript/TypeScript chạy trên server, cho phép bạn thực hiện mutations (thay đổi dữ liệu) mà không cần tạo API endpoints riêng biệt.

### 2.2 Cách định nghĩa và sử dụng Server Actions

```tsx
// Định nghĩa Server Action
async function createTodo(formData: FormData) {
  'use server';
  
  const title = formData.get('title') as string;
  // Lưu vào database
  await db.todo.create({ data: { title } });
  
  // Revalidate cache
  revalidatePath('/todos');
}

// Sử dụng trong form
export default function TodoForm() {
  return (
    <form action={createTodo}>
      <input name="title" type="text" />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

### 2.3 Bảo mật với Server Actions

- Validation dữ liệu đầu vào (Zod, Yup, ...)
- Authentication và Authorization
- Rate limiting
- CSRF protection (tự động với Next.js)

### 2.4 Xử lý lỗi trong Server Actions

```tsx
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function login(formData: FormData) {
  try {
    // Validate
    const { email, password } = schema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    
    // Authenticate
    // ...
    
    return { success: true };
  } catch (error) {
    return { error: 'Invalid credentials' };
  }
}
```

### 2.5 Progressive Enhancement

Server Actions hỗ trợ progressive enhancement, cho phép forms hoạt động ngay cả khi JavaScript bị vô hiệu hóa trên trình duyệt.

## 3. Streaming UI với RSC & Suspense

### 3.1 Streaming là gì và tại sao nó quan trọng?

Streaming cho phép server gửi UI từng phần đến client, giúp:
- Giảm Time to First Byte (TTFB)
- Hiển thị nội dung quan trọng trước
- Cải thiện trải nghiệm người dùng với loading states

### 3.2 Suspense trong Next.js App Router

```tsx
import { Suspense } from 'react';
import Loading from './loading';
import SlowComponent from './slow-component';

export default function Page() {
  return (
    <div>
      <h1>Trang chính</h1>
      
      {/* Hiển thị loading state trong khi chờ SlowComponent */}
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

### 3.3 Parallel và Sequential Data Fetching

**Parallel Data Fetching:**
```tsx
// Các requests được thực hiện song song
async function ParallelDataFetching() {
  const productsPromise = getProducts();
  const categoriesPromise = getCategories();
  
  // Đợi tất cả promises hoàn thành
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
```

**Sequential Data Fetching:**
```tsx
// Các requests được thực hiện tuần tự
async function SequentialDataFetching() {
  // Đợi products trước
  const products = await getProducts();
  
  // Sau đó mới fetch categories
  const categories = await getCategories();
  
  return (
    <>
      <ProductList products={products} />
      <CategoryList categories={categories} />
    </>
  );
}
```

## 4. Patterns & Best Practices

### 4.1 Passing Props từ Server Components đến Client Components

```tsx
// ServerComponent.tsx
async function ServerComponent() {
  const data = await fetchData();
  
  return <ClientComponent data={data} />;
}

// ClientComponent.tsx
'use client';

function ClientComponent({ data }) {
  // Sử dụng data từ server
  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
}
```

### 4.2 Interleaving Server và Client Components

```tsx
// page.tsx (Server Component)
export default async function Page() {
  const products = await getProducts();
  
  return (
    <div>
      <h1>Products</h1>
      <ProductList products={products} />
      <ClientSideFeature />
    </div>
  );
}

// ClientSideFeature.tsx
'use client';

export default function ClientSideFeature() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Additional content</div>}
    </div>
  );
}
```

### 4.3 Context Providers với Server Components

```tsx
// providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

// layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 4.4 Optimistic Updates với Server Actions

```tsx
'use client';

import { useOptimistic } from 'react';
import { addTodo } from './actions';

export function TodoList({ initialTodos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    initialTodos,
    (state, newTodo) => [...state, newTodo]
  );
  
  async function handleSubmit(formData) {
    const title = formData.get('title');
    
    // Thêm optimistic todo ngay lập tức
    addOptimisticTodo({ id: Math.random(), title, completed: false });
    
    // Thực hiện server action
    await addTodo(formData);
  }
  
  return (
    <div>
      <form action={handleSubmit}>
        <input name="title" />
        <button type="submit">Add</button>
      </form>
      
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 5. Kết luận

React Server Components và Server Actions đại diện cho một bước tiến lớn trong cách chúng ta xây dựng ứng dụng React. Bằng cách kết hợp sức mạnh của server và client, chúng ta có thể tạo ra các ứng dụng nhanh hơn, an toàn hơn và dễ bảo trì hơn.

Trong bài viết tiếp theo của series, chúng ta sẽ tìm hiểu về các chiến lược caching nâng cao trong Next.js App Router.

## Tài liệu tham khảo

- [Next.js Documentation - Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Documentation - Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Documentation - Suspense](https://react.dev/reference/react/Suspense)
