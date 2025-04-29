import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
  const currentDate = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Thêm các trang tĩnh
  const staticPages = ['', '/blog', '/about', '/contact'];
  
  // Thêm các trang tĩnh cho mỗi locale
  routing.locales.forEach(locale => {
    staticPages.forEach(page => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    });
  });

  // Thêm các trang bài viết
  routing.locales.forEach(locale => {
    const posts = getAllPosts(locale);
    
    posts.forEach(post => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date as string),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}