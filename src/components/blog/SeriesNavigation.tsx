'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, BookOpen } from '@/components/icons/PhosphorIcons';
import { useTranslations } from 'next-intl';

interface SeriesNavigationProps {
  seriesName: string;
  currentPart: number;
  totalParts: number;
  previousPost?: {
    title: string;
    slug: string;
  } | null;
  nextPost?: {
    title: string;
    slug: string;
  } | null;
}

export default function SeriesNavigation({
  seriesName,
  currentPart,
  totalParts,
  previousPost,
  nextPost
}: SeriesNavigationProps) {
  const t = useTranslations('Series');
  
  return (
    <motion.div
      className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {t('partOf', { series: seriesName })}
        </h3>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {t('part')} {currentPart} {t('of')} {totalParts}
        </div>
        <Link 
          href={`/series/${encodeURIComponent(seriesName)}`}
          className="text-sm text-primary hover:text-primary-dark"
        >
          {t('viewSeries')}
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="flex-1 flex items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('previous')}</div>
              <div className="font-medium line-clamp-1">{previousPost.title}</div>
            </div>
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}
        
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex-1 flex items-center justify-end gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-right"
          >
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('next')}</div>
              <div className="font-medium line-clamp-1">{nextPost.title}</div>
            </div>
            <ArrowRight className="w-5 h-5 flex-shrink-0" />
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}
      </div>
    </motion.div>
  );
}