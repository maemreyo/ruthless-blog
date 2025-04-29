'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from '@/components/icons/PhosphorIcons';

export default function LocaleSwitcher() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const changeLocale = (locale: string) => {
    router.replace(pathname, { locale });
    setIsOpen(false);
  };
  
  const localeNames: Record<string, string> = {
    en: t('english'),
    vi: t('vietnamese')
  };
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe weight="bold" className="w-5 h-5" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden z-10 border border-white/20 dark:border-gray-700/30"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-1">
              {routing.locales.map((locale) => (
                <motion.li 
                  key={locale}
                  whileHover={{ 
                    backgroundColor: 'rgba(var(--color-primary), 0.1)',
                    color: 'rgb(var(--color-primary))'
                  }}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors"
                    onClick={() => changeLocale(locale)}
                  >
                    {localeNames[locale]}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}