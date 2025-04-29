'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Translate, CaretDown } from '@/components/icons/PhosphorIcons';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
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
        className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Translate weight="bold" className="w-5 h-5 text-primary" />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <CaretDown weight="bold" className="w-4 h-4" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-elegant overflow-hidden z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-1">
              {routing.locales.map((locale, index) => (
                <motion.li 
                  key={locale}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
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