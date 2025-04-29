'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { BookOpen } from '@/components/icons/PhosphorIcons';

interface Series {
  name: string;
  count: number;
}

interface SeriesListProps {
  seriesList: Series[];
  title?: string;
  className?: string;
}

export default function SeriesList({ seriesList, title, className = '' }: SeriesListProps) {
  const t = useTranslations('Series');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          {title}
        </h3>
      )}
      
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {seriesList.map((series) => (
          <motion.div 
            key={series.name} 
            variants={itemVariants}
            className="group"
          >
            <Link 
              href={`/series/${encodeURIComponent(series.name)}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-medium group-hover:text-primary transition-colors">
                  {series.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('partCount', { count: series.count })}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-4 text-right">
        <Link 
          href="/series"
          className="text-sm text-primary hover:text-primary-dark hover:underline"
        >
          {t('title')} →
        </Link>
      </div>
    </div>
  );
}