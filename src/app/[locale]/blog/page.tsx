import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import EnhancedBlogGrid from '@/components/blog/EnhancedBlogGrid';
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
  const formattedPosts = posts.map((post, index) => {
    // Tạo category ngẫu nhiên cho demo
    const categories = ['Technology', 'Design', 'Development', 'Business'];
    const randomCategory = categories[index % categories.length];
    
    // Tạo readingTime ngẫu nhiên
    const readingTimes = ['3 min read', '5 min read', '7 min read', '10 min read'];
    const randomReadingTime = readingTimes[index % readingTimes.length];
    
    // Tạo tags ngẫu nhiên
    const allTags = ['nextjs', 'react', 'javascript', 'typescript', 'tailwind', 'css', 'html', 'web', 'frontend', 'backend'];
    const randomTags = [];
    for (let i = 0; i < 3; i++) {
      randomTags.push(allTags[(index + i) % allTags.length]);
    }
    
    return {
      title: post.title as string,
      excerpt: post.excerpt as string,
      date: post.date as string,
      slug: post.slug as string,
      author: post.author as string,
      coverImage: post.thumbnail as string,
      category: randomCategory,
      readingTime: randomReadingTime,
      tags: randomTags
    };
  });
  
  return (
    <div className="overflow-hidden relative">
      {/* Custom cursor effect */}
      <CursorFollower trailEffect={true} />
      
      <ImmersiveHeader 
        title={t('title')}
        subtitle={t('subtitle')}
      />
      
      <EnhancedBlogGrid 
        title={t('allPosts') || 'All Posts'}
        posts={formattedPosts}
        readMoreText={t('readMore') || 'Read More'}
      />
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}