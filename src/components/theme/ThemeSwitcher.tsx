'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon } from '@/components/icons/PhosphorIcons';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Common');

  // Đảm bảo component được render ở client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200`}
      aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {theme === 'dark' ? (
          <Sun weight="fill" className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon weight="fill" className="w-5 h-5 text-indigo-500" />
        )}
      </motion.div>
    </motion.button>
  );
}