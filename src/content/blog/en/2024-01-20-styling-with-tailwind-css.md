---
title: 'Styling with Tailwind CSS'
date: '2024-01-20'
author: 'Wehttam'
category: 'Design'
series: 'Next.js Fundamentals'
seriesPart: 2
excerpt: 'Discover the power of utility-first CSS with Tailwind CSS and how it can speed up your development workflow.'
tags: ['tailwind css', 'css', 'web design']
thumbnail: '/images/uploads/tailwind-thumbnail.jpg'
featured: true
---

# Styling with Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to build interfaces quickly without writing custom CSS. Instead of pre-defined components, Tailwind provides low-level utility classes that you can combine to create any design.

## Why Choose Tailwind CSS?

Tailwind CSS offers many benefits:

- **Faster Development**: No need to switch between HTML and CSS files
- **Easy Customization**: Easily customize designs without overriding CSS
- **Smaller Size**: Only includes the classes you actually use in production
- **Easy Responsiveness**: Prefixes like sm:, md:, lg: make it easy to create responsive designs
- **Consistency**: Built-in design system helps maintain consistency

## Installing Tailwind CSS

To get started with Tailwind CSS in a Next.js project, you can follow these steps:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then, configure `tailwind.config.js`:

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

Finally, add the Tailwind directives to your main CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Example Using Tailwind CSS

Here's an example of how to use Tailwind CSS to create a simple card:

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

## Conclusion

Tailwind CSS is a powerful tool for modern web development. It helps you create interfaces quickly and easily without writing custom CSS. Try Tailwind CSS today!