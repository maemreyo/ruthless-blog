import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/blog';
import { formatDate, getReadingTime } from '@/lib/utils';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

// Tạo metadata cho trang
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}): Promise<Metadata> {
  const { locale, slug } = params;
  const post = getPostBySlug(slug, locale);
  
  if (!post) {
    return {
      title: 'Post not found',
    };
  }
  
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: 'article',
      authors: [post.frontmatter.author],
      publishedTime: post.frontmatter.date,
      images: post.frontmatter.thumbnail ? [post.frontmatter.thumbnail] : [],
    },
  };
}

export default function BlogPostPage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const { locale, slug } = params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = useTranslations('Blog');
  const blogPostT = useTranslations('BlogPost');
  
  const post = getPostBySlug(slug, locale);
  
  if (!post) {
    notFound();
  }
  
  const { frontmatter, content } = post;
  const formattedDate = formatDate(frontmatter.date as string, locale);
  const readingTime = getReadingTime(content, locale);
  
  // Lấy các bài viết liên quan
  const relatedPosts = getRelatedPosts(
    slug, 
    frontmatter.tags as string[] || [], 
    locale, 
    3
  );
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Thumbnail */}
      {frontmatter.thumbnail && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={frontmatter.thumbnail as string} 
            alt={frontmatter.title as string}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {/* Title and meta */}
      <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
      <div className="flex flex-wrap items-center text-gray-600 mb-8">
        <span className="mr-4">{t('publishedOn')} {formattedDate}</span>
        <span className="mr-4">{t('by')} {frontmatter.author}</span>
        <span>{readingTime}</span>
      </div>
      
      {/* Tags */}
      {frontmatter.tags && (frontmatter.tags as string[]).length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">{t('tags')}</h2>
          <div className="flex flex-wrap gap-2">
            {(frontmatter.tags as string[]).map((tag) => (
              <span 
                key={tag} 
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="prose max-w-none mb-12">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('relatedPosts')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.slug} className="border rounded-lg p-4">
                <h3 className="font-bold mb-2">{relatedPost.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {formatDate(relatedPost.date as string, locale)}
                </p>
                <Link 
                  href={`/blog/${relatedPost.slug}`} 
                  className="text-blue-500 hover:underline"
                >
                  {t('readMore')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Back to list */}
      <div className="mt-8">
        <Link href="/blog" className="text-blue-500 hover:underline">
          {t('backToList')}
        </Link>
      </div>
    </div>
  );
}

// Tạo các tham số tĩnh cho trang
export function generateStaticParams() {
  const locales = ['en', 'vi'];
  const paths: { locale: string; slug: string }[] = [];
  
  locales.forEach(locale => {
    const slugs = getAllPostSlugs(locale);
    slugs.forEach(({ params }) => {
      paths.push({
        locale,
        slug: params.slug
      });
    });
  });
  
  return paths;
}