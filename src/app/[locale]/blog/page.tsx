import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import ImmersiveBlogGrid from '@/components/blog/ImmersiveBlogGrid';
import ImmersiveHeader from '@/components/blog/ImmersiveHeader';
import { getAllPosts } from '@/lib/blog';
import CursorFollower from '@/components/ui/CursorFollower';

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
    <div className="overflow-hidden">
      {/* Custom cursor effect */}
      <CursorFollower trailEffect={true} />
      
      <ImmersiveHeader 
        title={t('title')}
        subtitle={t('subtitle')}
      />
      
      <div className="container mx-auto px-4 py-12">
        <ImmersiveBlogGrid 
          posts={formattedPosts}
          readMoreText={t('readMore') || 'Read More'}
        />
      </div>
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}