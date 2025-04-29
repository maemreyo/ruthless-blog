'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Calendar, User, ArrowRight } from '@/components/icons/PhosphorIcons';

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
    <motion.article
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-elegant hover:shadow-float-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      {coverImage && (
        <div className="h-56 overflow-hidden relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            {coverImage.startsWith('/') ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={false}
              />
            ) : (
              // Fallback for external images
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h2>
        
        <div className="flex flex-wrap gap-4 mb-4 text-gray-600 dark:text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <Calendar weight="fill" className="w-4 h-4 text-primary" />
            <span>{formatDate(date)}</span>
          </div>
          
          {author && (
            <div className="flex items-center gap-1">
              <User weight="fill" className="w-4 h-4 text-primary" />
              <span>{author}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{excerpt}</p>
        
        <Link
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors group"
        >
          {t('readMore')}
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            className="inline-block"
          >
            <ArrowRight weight="bold" className="w-4 h-4" />
          </motion.span>
        </Link>
      </div>
    </motion.article>
  );
}