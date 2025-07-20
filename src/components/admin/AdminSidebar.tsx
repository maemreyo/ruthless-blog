'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { 
  House, 
  FileText, 
  FolderOpen, 
  Tag, 
  Images, 
  ChartBar, 
  Gear, 
  Plus,
  CaretLeft,
  CaretRight
} from '@/components/icons/PhosphorIcons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    href: '/admin',
    icon: House,
    label: 'Dashboard'
  },
  {
    href: '/admin/posts',
    icon: FileText,
    label: 'Posts'
  },
  {
    href: '/admin/categories',
    icon: FolderOpen,
    label: 'Categories'
  },
  {
    href: '/admin/series',
    icon: Tag,
    label: 'Series'
  },
  {
    href: '/admin/media',
    icon: Images,
    label: 'Media'
  },
  {
    href: '/admin/analytics',
    icon: ChartBar,
    label: 'Analytics'
  },
  {
    href: '/admin/settings',
    icon: Gear,
    label: 'Settings'
  }
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      animate={{ width: isCollapsed ? 60 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1 
              className="text-xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Admin
            </motion.h1>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1"
          >
            {isCollapsed ? (
              <CaretRight className="w-4 h-4" />
            ) : (
              <CaretLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        <Button asChild className={cn("w-full", isCollapsed && "px-2")}>
          <Link href="/admin/posts/create" className="gap-2">
            <Plus className="w-4 h-4" />
            {!isCollapsed && 'New Post'}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    isActive && 'bg-primary/10 text-primary border border-primary/20',
                    !isActive && 'text-gray-700 dark:text-gray-300',
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive && 'text-primary'
                  )} />
                  
                  {!isCollapsed && (
                    <motion.span 
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  
                  {!isCollapsed && item.badge && (
                    <motion.span 
                      className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={cn(
          'flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400',
          isCollapsed && 'justify-center'
        )}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-medium">Ruthless Blog</p>
              <p className="text-xs">Admin Panel v1.0</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}