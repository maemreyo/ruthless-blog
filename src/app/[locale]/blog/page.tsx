import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import BlogPostList from '@/components/blog/BlogPostList';
import { getAllPosts } from '@/lib/blog';

export default function BlogPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Blog');
  
  // Lấy tất cả bài viết từ thư mục content
  const posts = getAllPosts(locale);
  
  // Chuyển đổi dữ liệu để phù hợp với component BlogPostList
  const formattedPosts = posts.map(post => ({
    title: post.title as string,
    excerpt: post.excerpt as string,
    date: post.date as string,
    slug: post.slug as string,
    author: post.author as string,
    coverImage: post.thumbnail as string
  }));
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-xl mb-8">{t('subtitle')}</p>
      
      <BlogPostList posts={formattedPosts} />
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}