'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { BookOpen } from '@/components/icons/PhosphorIcons';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    sm: 'h-5 text-xs px-2 gap-1',
    md: 'h-6 text-sm px-3 gap-1.5',
    lg: 'h-7 text-base px-4 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Badge 
        variant="default"
        asChild
        className={cn(
          'inline-flex items-center rounded-full font-medium cursor-pointer transition-all duration-200',
          'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 border-primary/20',
          sizeClasses[size],
          className
        )}
      >
        <Link href={`/series/${encodeURIComponent(series)}`} className="hover:underline">
          <BookOpen className={iconSizes[size]} />
          {series}
          {part && ` (${t('part')} ${part})`}
        </Link>
      </Badge>
    </motion.div>
  );
}