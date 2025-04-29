import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import EnhancedBlogGrid from '@/components/blog/EnhancedBlogGrid';
import ImmersiveHeader from '@/components/blog/ImmersiveHeader';
import CategoryList from '@/components/blog/CategoryList';
import SeriesList from '@/components/blog/SeriesList';
import { getAllPosts, getAllCategories, getAllSeries } from '@/lib/blog';
import CursorFollower from '@/components/ui/CursorFollower';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('Blog');
  
  // Lấy tất cả bài viết từ thư mục content
  const posts = getAllPosts(locale);
  
  // Lấy tất cả categories
  const categories = getAllCategories(locale);
  
  // Lấy tất cả series
  const seriesList = getAllSeries(locale);
  
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
    
    // Sử dụng category từ bài viết nếu có, nếu không thì dùng random
    const category = post.category || randomCategory;
    
    // Thêm thông tin series nếu bài viết thuộc một series
    const series = post.series as string;
    const seriesPart = post.seriesPart as number;
    
    return {
      title: post.title as string,
      excerpt: post.excerpt as string,
      date: post.date as string,
      slug: post.slug as string,
      author: post.author as string,
      coverImage: post.thumbnail as string,
      category: category,
      series: series,
      seriesPart: seriesPart,
      readingTime: randomReadingTime,
      tags: post.tags as string[] || randomTags
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
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content - Blog posts */}
          <div className="lg:col-span-3">
            <EnhancedBlogGrid 
              title={t('allPosts') || 'All Posts'}
              posts={formattedPosts}
              readMoreText={t('readMore') || 'Read More'}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <CategoryList 
              categories={categories as string[]} 
              title={t('categories') || 'Categories'} 
            />
            
            {/* Series */}
            <SeriesList 
              seriesList={seriesList} 
              title={t('series') || 'Series'} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}