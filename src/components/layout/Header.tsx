'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import { 
  House, 
  Article, 
  User, 
  EnvelopeSimple, 
  List, 
  X 
} from '@/components/icons/PhosphorIcons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navItems = [
    { href: '/', label: t('home'), icon: <House weight="bold" className="w-5 h-5" /> },
    { href: '/blog', label: t('blog'), icon: <Article weight="bold" className="w-5 h-5" /> },
    { href: '/about', label: t('about'), icon: <User weight="bold" className="w-5 h-5" /> },
    { href: '/contact', label: t('contact'), icon: <EnvelopeSimple weight="bold" className="w-5 h-5" /> },
  ];
  
  return (
    <header className={`bg-white dark:bg-gray-900 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-elegant py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="text-2xl font-bold text-primary dark:text-white hover:text-primary-dark dark:hover:text-primary transition-colors"
            >
              Wehttam Blog
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 hover:text-primary ${
                    pathname === item.href 
                      ? 'text-primary font-medium border-b-2 border-primary' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <div className="flex items-center space-x-3 ml-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X weight="bold" className="w-6 h-6" />
            ) : (
              <List weight="bold" className="w-6 h-6" />
            )}
          </motion.button>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav 
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="space-y-3 bg-white dark:bg-gray-800 rounded-lg shadow-elegant p-4">
                {navItems.map((item, index) => (
                  <motion.li 
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                        pathname === item.href 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li 
                  className="flex items-center space-x-3 mt-4 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                </motion.li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}