'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Định nghĩa màu sắc cho từng category với Shadcn badge variants
const categoryStyles: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string }> = {
  'Technology': { 
    variant: 'default', 
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800' 
  },
  'Design': { 
    variant: 'default', 
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800' 
  },
  'Development': { 
    variant: 'default', 
    className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800' 
  },
  'Business': { 
    variant: 'default', 
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50 border-amber-200 dark:border-amber-800' 
  },
  'Tutorial': { 
    variant: 'default', 
    className: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800' 
  },
  'Opinion': { 
    variant: 'secondary', 
    className: '' 
  },
  // Màu mặc định cho các category khác
  'default': { 
    variant: 'outline', 
    className: '' 
  }
};

export default function CategoryBadge({ category, size = 'md', className = '' }: CategoryBadgeProps) {
  // Lấy style dựa trên category
  const categoryStyle = categoryStyles[category] || categoryStyles.default;
  
  // Xác định kích thước
  const sizeClasses = {
    sm: 'h-5 text-xs px-2',
    md: 'h-6 text-sm px-3',
    lg: 'h-7 text-base px-4'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Badge 
        variant={categoryStyle.variant}
        asChild
        className={cn(
          sizeClasses[size],
          'rounded-full font-medium cursor-pointer transition-all duration-200',
          categoryStyle.className,
          className
        )}
      >
        <Link href={`/categories/${encodeURIComponent(category)}`} className="hover:underline">
          {category}
        </Link>
      </Badge>
    </motion.div>
  );
}