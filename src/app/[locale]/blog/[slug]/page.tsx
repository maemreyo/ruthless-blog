import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';

// Giả lập dữ liệu bài viết - sau này sẽ được thay thế bằng dữ liệu thực từ CMS
const getBlogPost = (slug: string) => {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ file Markdown hoặc API
  const posts = [
    {
      slug: 'hello-world',
      title: 'Hello World',
      content: 'This is my first blog post.',
      date: '2024-01-01',
      author: 'Wehttam'
    }
  ];
  
  return posts.find(post => post.slug === slug);
};

export default function BlogPostPage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const { locale, slug } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Blog');
  
  const post = getBlogPost(slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-8">
        <span>{t('publishedOn')} {post.date} {t('by')} {post.author}</span>
      </div>
      
      <div className="prose max-w-none">
        {post.content}
      </div>
      
      <div className="mt-8">
        <Link href="/blog" className="text-blue-500 hover:underline">
          {t('backToList')}
        </Link>
      </div>
    </div>
  );
}