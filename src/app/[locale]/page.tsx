import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import BlogPostList from '@/components/blog/BlogPostList';
import { getFeaturedPosts, getAllPosts } from '@/lib/blog';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

export default function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Index');
  const commonT = useTranslations('Common');
  
  // Lấy bài viết nổi bật từ thư mục content
  let featuredPosts = getFeaturedPosts(locale, 2);
  
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
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16 mb-12 bg-gray-50 rounded-lg">
        <h1 className="text-5xl font-bold mb-6">{siteData.title}</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">{siteData.description}</p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/blog" 
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('viewBlog')}
          </Link>
          <Link 
            href="/about" 
            className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            {t('aboutMe')}
          </Link>
        </div>
      </section>
      
      {/* Featured Posts Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Posts</h2>
          <Link 
            href="/blog" 
            className="text-blue-500 hover:underline"
          >
            {commonT('viewAll')} →
          </Link>
        </div>
        
        <BlogPostList posts={formattedPosts} />
      </section>
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
  params: { locale: string } 
}): Promise<Metadata> {
  const { locale } = params;
  
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