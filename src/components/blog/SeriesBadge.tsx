'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { BookOpen } from '@/components/icons/PhosphorIcons';
import { useTranslations } from 'next-intl';

interface SeriesBadgeProps {
  series: string;
  part?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SeriesBadge({ series, part, size = 'md', className = '' }: SeriesBadgeProps) {
  const t = useTranslations('Series');
  
  // Xác định kích thước
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-1.5 bg-primary/10 text-primary dark:bg-primary/20 ${sizeClasses[size]} rounded-full font-medium ${className}`}
    >
      <BookOpen className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      <Link href={`/series/${encodeURIComponent(series)}`} className="hover:underline">
        {series}
        {part && ` (${t('part')} ${part})`}
      </Link>
    </motion.div>
  );
}