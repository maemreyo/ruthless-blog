'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author?: string;
  coverImage?: string;
}

export default function BlogPostCard({
  title,
  excerpt,
  date,
  slug,
  author,
  coverImage
}: BlogPostCardProps) {
  const t = useTranslations('Blog');
  
  return (
    <motion.div
      className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] overflow-hidden hover:shadow-[8px_8px_0px_#000] transition-shadow duration-200"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {coverImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        
        <div className="text-gray-600 text-sm mb-4">
          {t('publishedOn')} {date}
          {author && <span> {t('by')} {author}</span>}
        </div>
        
        <p className="text-gray-700 mb-4">{excerpt}</p>
        
        <Link
          href={`/blog/${slug}`}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {t('readMore')}
        </Link>
      </div>
    </motion.div>
  );
}