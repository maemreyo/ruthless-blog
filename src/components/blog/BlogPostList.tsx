import { useTranslations } from 'next-intl';
import BlogPostCard from './BlogPostCard';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author?: string;
  coverImage?: string;
}

interface BlogPostListProps {
  posts: BlogPost[];
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  const t = useTranslations('Blog');
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t('noPostsFound')}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogPostCard
          key={post.slug}
          title={post.title}
          excerpt={post.excerpt}
          date={post.date}
          slug={post.slug}
          author={post.author}
          coverImage={post.coverImage}
        />
      ))}
    </div>
  );
}