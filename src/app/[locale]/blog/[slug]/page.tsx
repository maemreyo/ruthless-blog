import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/blog';
import { formatDate, getReadingTime } from '@/lib/utils';
import { Metadata } from 'next';
import EnhancedBlogPost from '@/components/blog/EnhancedBlogPost';
import CursorFollower from '@/components/ui/CursorFollower';

// Tạo metadata cho trang
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
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

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  
  // Bật render tĩnh
  setRequestLocale(locale);
  
  const t = await getTranslations('Blog');
  const blogPostT = await getTranslations('BlogPost');
  
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
  
  // Format related posts for the component
  const formattedRelatedPosts = relatedPosts.map(post => ({
    title: post.title as string,
    date: formatDate(post.date as string, locale),
    slug: post.slug as string
  }));
  
  return (
    <div className="overflow-hidden">
      {/* Custom cursor effect */}
      <CursorFollower trailEffect={true} />
      
      <EnhancedBlogPost 
        title={frontmatter.title as string}
        content={content}
        formattedDate={formattedDate}
        author={frontmatter.author as string}
        readingTime={readingTime}
        thumbnail={frontmatter.thumbnail as string}
        tags={frontmatter.tags as string[]}
        relatedPosts={formattedRelatedPosts}
        slug={slug}
        tagsLabel={t('tags')}
        readMoreLabel={t('readMore')}
        backToListLabel={t('backToList')}
        relatedPostsLabel={t('relatedPosts')}
      />
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