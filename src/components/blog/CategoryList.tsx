'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import CategoryBadge from './CategoryBadge';

interface CategoryListProps {
  categories: string[];
  title?: string;
  className?: string;
}

export default function CategoryList({ categories, title, className = '' }: CategoryListProps) {
  const t = useTranslations('Categories');
  
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
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category) => (
          <motion.div key={category} variants={itemVariants}>
            <CategoryBadge category={category} size="md" />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-4 text-right">
        <Link 
          href="/categories"
          className="text-sm text-primary hover:text-primary-dark hover:underline"
        >
          {t('title')} →
        </Link>
      </div>
    </div>
  );
}