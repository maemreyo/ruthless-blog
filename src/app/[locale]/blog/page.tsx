import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import BlogPostList from '@/components/blog/BlogPostList';

// Giả lập dữ liệu bài viết - sau này sẽ được thay thế bằng dữ liệu thực từ CMS
const getBlogPosts = () => {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ file Markdown hoặc API
  return [
    {
      title: 'Getting Started with Next.js',
      excerpt: 'Learn how to build a blog with Next.js, Tailwind CSS, and more.',
      date: '2024-01-15',
      slug: 'getting-started-with-nextjs',
      author: 'Wehttam',
      coverImage: 'https://via.placeholder.com/800x400'
    },
    {
      title: 'Styling with Tailwind CSS',
      excerpt: 'Discover the power of utility-first CSS with Tailwind.',
      date: '2024-01-20',
      slug: 'styling-with-tailwind-css',
      author: 'Wehttam',
      coverImage: 'https://via.placeholder.com/800x400'
    },
    {
      title: 'Animations with Framer Motion',
      excerpt: 'Add beautiful animations to your React applications.',
      date: '2024-01-25',
      slug: 'animations-with-framer-motion',
      author: 'Wehttam',
      coverImage: 'https://via.placeholder.com/800x400'
    }
  ];
};

export default function BlogPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Blog');
  const posts = getBlogPosts();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-xl mb-8">{t('subtitle')}</p>
      
      <BlogPostList posts={posts} />
    </div>
  );
}