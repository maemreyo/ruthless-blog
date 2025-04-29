'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { X, Sun, Moon, Globe, List } from '@/components/icons/PhosphorIcons';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher';

interface NavItem {
  label: string;
  href: string;
}

interface GlassNavigationProps {
  homeText: string;
  blogText: string;
  aboutText: string;
  contactText: string;
}

export default function GlassNavigation({
  homeText,
  blogText,
  aboutText,
  contactText
}: GlassNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    { label: homeText, href: '/' },
    { label: blogText, href: '/blog' },
    { label: aboutText, href: '/about' },
    { label: contactText, href: '/contact' }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'py-3 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-lg' 
            : 'py-5 bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold relative group">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Wehttam Blog
              </span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                animate={{ width: isScrolled ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname?.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-primary dark:text-primary' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                    }`}
                  >
                    {item.label}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20 -z-10"
                        layoutId="activeNavIndicator"
                        transition={{ type: 'spring', duration: 0.6, bounce: 0.15 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <LocaleSwitcher />
                <ThemeSwitcher />
              </div>
              
              {/* Mobile menu button */}
              <motion.button
                className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <List className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div
              className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex justify-end mb-8">
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname?.startsWith(item.href));
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-around">
                    <LocaleSwitcher />
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}