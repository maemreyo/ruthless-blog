import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { getFeaturedPosts, getAllPosts } from '@/lib/blog';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import ParallaxHero from '@/components/home/ParallaxHero';
import FeaturedPostsCarousel from '@/components/home/FeaturedPostsCarousel';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  // Lấy bản dịch từ server
  const t = await getTranslations('Index');
  const commonT = await getTranslations('Common');
  
  // Lấy bài viết nổi bật từ thư mục content
  let featuredPosts = getFeaturedPosts(locale, 2);
  console.log("Đã lấy được bài viết nổi bật", featuredPosts)
  // Nếu không có bài viết nổi bật, lấy 2 bài viết mới nhất
  if (featuredPosts.length === 0) {
    featuredPosts = getAllPosts(locale).slice(0, 2);
  }
  
  // Chuyển đổi dữ liệu để phù hợp với component BlogPostList
  const formattedPosts = featuredPosts.map(post => ({
    title: post.title as string,
    excerpt: post.excerpt as string,
    date: post.date as string,
    slug: post.slug as string,
    author: post.author as string,
    coverImage: post.thumbnail as string
  }));
  
  // Đọc dữ liệu site từ file JSON
  let siteData = { title: '', description: '' };
  try {
    const siteFilePath = path.join(process.cwd(), 'src', 'data', 'site.json');
    const siteFileContent = fs.readFileSync(siteFilePath, 'utf8');
    const siteJson = JSON.parse(siteFileContent);
    siteData = siteJson[locale] || siteJson['en'];
  } catch (error) {
    console.error('Error reading site data:', error);
  }
  
  return (
    <div className="overflow-hidden">
      <ParallaxHero 
        title={siteData.title}
        description={siteData.description}
        viewBlogText={t('viewBlog')}
        aboutMeText={t('aboutMe')}
      />
      
      <FeaturedPostsCarousel 
        title="Featured Posts"
        viewAllText={commonT('viewAll')}
        posts={formattedPosts}
      />
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}

// Tạo metadata cho trang
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  // Đọc dữ liệu site từ file JSON
  let siteData = { title: 'Wehttam Blog', description: '' };
  try {
    const siteFilePath = path.join(process.cwd(), 'src', 'data', 'site.json');
    const siteFileContent = fs.readFileSync(siteFilePath, 'utf8');
    const siteJson = JSON.parse(siteFileContent);
    siteData = siteJson[locale] || siteJson['en'];
  } catch (error) {
    console.error('Error reading site data:', error);
  }
  
  return {
    title: siteData.title,
    description: siteData.description,
    openGraph: {
      title: siteData.title,
      description: siteData.description,
      type: 'website',
      locale: locale,
      alternateLocale: locale === 'en' ? 'vi' : 'en',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteData.title,
      description: siteData.description,
    },
  };
}