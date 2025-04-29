import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import BlogPostList from '@/components/blog/BlogPostList';

// Giả lập dữ liệu bài viết nổi bật
const getFeaturedPosts = () => {
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
    }
  ];
};

export default function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Index');
  const commonT = useTranslations('Common');
  const featuredPosts = getFeaturedPosts();
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16 mb-12 bg-gray-50 rounded-lg">
        <h1 className="text-5xl font-bold mb-6">{t('title')}</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">{t('subtitle')}</p>
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
        
        <BlogPostList posts={featuredPosts} />
      </section>
    </div>
  );
}