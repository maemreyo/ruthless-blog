import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import BlogPostList from '@/components/blog/BlogPostList';
import { getFeaturedPosts, getAllPosts } from '@/lib/blog';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { ArrowRight } from '@/components/icons/PhosphorIcons';

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
      <section className="py-20 mb-16 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {siteData.title}
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {siteData.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Link 
                href="/blog" 
                className="px-8 py-3 bg-primary text-white font-medium text-lg rounded-lg shadow-elegant hover:bg-primary-dark hover:shadow-float transition-all duration-300"
              >
                {t('viewBlog')}
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 bg-white dark:bg-gray-800 text-primary dark:text-white font-medium text-lg rounded-lg shadow-elegant hover:shadow-float transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {t('aboutMe')}
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-10 -mb-10"></div>
      </section>
      
      {/* Featured Posts Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block border-b-4 border-primary pb-2">Featured Posts</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors group"
            >
              {commonT('viewAll')}
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="inline-block"
              >
                <ArrowRight weight="bold" className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>
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