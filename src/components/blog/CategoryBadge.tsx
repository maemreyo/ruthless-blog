'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Định nghĩa màu sắc cho từng category
const categoryColors: Record<string, string> = {
  'Technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Design': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Development': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Business': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Tutorial': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Opinion': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  // Màu mặc định cho các category khác
  'default': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

export default function CategoryBadge({ category, size = 'md', className = '' }: CategoryBadgeProps) {
  // Lấy màu sắc dựa trên category
  const colorClass = categoryColors[category] || categoryColors.default;
  
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
      className={`inline-block ${colorClass} ${sizeClasses[size]} rounded-full font-medium ${className}`}
    >
      <Link href={`/categories/${encodeURIComponent(category)}`} className="hover:underline">
        {category}
      </Link>
    </motion.div>
  );
}