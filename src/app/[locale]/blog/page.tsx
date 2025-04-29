import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import BlogPostList from '@/components/blog/BlogPostList';
import { getAllPosts } from '@/lib/blog';
import { motion } from 'framer-motion';

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
      <div className="mb-16 relative">
        <motion.div 
          className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl p-12 relative z-10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {t('title')}
          </motion.h1>
          
          <motion.p 
            className="text-xl max-w-3xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-5 -mb-5"></div>
        </motion.div>
      </div>
      
      <BlogPostList posts={formattedPosts} />
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }];
}