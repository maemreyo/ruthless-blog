import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import BlogPostList from '@/components/blog/BlogPostList';
import BlogHeader from '@/components/blog/BlogHeader';
import { getAllPosts } from '@/lib/blog';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('Blog');
  
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
      <BlogHeader 
        title={t('title')}
        subtitle={t('subtitle')}
      />
      
      <BlogPostList posts={formattedPosts} />
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}