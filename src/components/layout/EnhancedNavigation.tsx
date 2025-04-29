'use client';

import { useState, useEffect, useRef, JSX } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X, List, House, Article, User, EnvelopeSimple } from '@/components/icons/PhosphorIcons';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher';

interface NavItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

interface EnhancedNavigationProps {
  homeText: string;
  blogText: string;
  aboutText: string;
  contactText: string;
}

export default function EnhancedNavigation({
  homeText,
  blogText,
  aboutText,
  contactText
}: EnhancedNavigationProps) {
  const t = useTranslations('Footer');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for hover effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform values for parallax effect
  const logoX = useTransform(mouseX, [-300, 300], [5, -5]);
  const logoY = useTransform(mouseY, [-300, 300], [5, -5]);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 15, stiffness: 150 };
  const springLogoX = useSpring(logoX, springConfig);
  const springLogoY = useSpring(logoY, springConfig);
  
  const navItems: NavItem[] = [
    { label: homeText, href: '/', icon: <House weight="bold" className="w-5 h-5" /> },
    { label: blogText, href: '/blog', icon: <Article weight="bold" className="w-5 h-5" /> },
    { label: aboutText, href: '/about', icon: <User weight="bold" className="w-5 h-5" /> },
    { label: contactText, href: '/contact', icon: <EnvelopeSimple weight="bold" className="w-5 h-5" /> }
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
  
  // Mouse move effect for nav
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return;
      
      const rect = navRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Hover animation variants
  const hoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 }
  };
  
  // Staggered animation for nav items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-2 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg' 
            : 'py-4 bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div ref={navRef} className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo with 3D hover effect */}
            <motion.div
              style={{ x: springLogoX, y: springLogoY }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link href="/" className="relative group">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient">
                      {t('title')}
                    </span>
                  </motion.div>
                </div>
                
                {/* Animated underline */}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: isScrolled ? '100%' : '0%' }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Hover underline */}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative flex items-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-full p-1 shadow-sm">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname?.startsWith(item.href));
                  
                  return (
                    <motion.div
                      key={item.href}
                      variants={itemVariants}
                      onHoverStart={() => setHoverIndex(index)}
                      onHoverEnd={() => setHoverIndex(null)}
                      className="relative"
                    >
                      <Link
                        href={item.href}
                        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="relative z-10">{item.icon}</span>
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                      
                      {/* Active/Hover background */}
                      {(isActive || hoverIndex === index) && (
                        <motion.span
                          className={`absolute inset-0 rounded-full ${
                            isActive 
                              ? 'bg-gradient-to-r from-primary to-accent' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          layoutId="navBackground"
                          initial={false}
                          transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
                
                {/* Glow effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-md -z-10 opacity-0"
                  animate={{ 
                    opacity: [0, 0.5, 0],
                    scale: [0.9, 1.05, 0.9]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.nav>
            
            {/* Right side controls */}
            <motion.div 
              className="flex items-center gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="hidden md:flex items-center gap-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-full p-1.5 shadow-sm"
                variants={itemVariants}
              >
                <LocaleSwitcher />
                <ThemeSwitcher />
              </motion.div>
              
              {/* Mobile menu button */}
              <motion.button
                className="p-2 rounded-full bg-gradient-to-r from-primary/80 to-accent/80 text-white shadow-md md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variants={itemVariants}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <List className="w-5 h-5" />
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
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
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop with blur */}
            <motion.div 
              className="absolute inset-0 bg-black/30 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div
              className="absolute right-0 top-0 h-full w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Gradient border */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-primary"></div>
              
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      {t('title')}
                    </span>
                  </motion.div>
                  
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <motion.nav 
                  className="flex flex-col space-y-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname?.startsWith(item.href));
                    
                    return (
                      <motion.div
                        key={item.href}
                        variants={itemVariants}
                        custom={index}
                        whileHover="hover"
                        className="overflow-hidden"
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                            isActive 
                              ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary dark:text-primary' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <motion.div
                            variants={hoverVariants}
                            className={`p-2 rounded-full ${
                              isActive 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {item.icon}
                          </motion.div>
                          {item.label}
                          
                          {isActive && (
                            <motion.div 
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                              layoutId="activeMobileIndicator"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>
                
                <motion.div 
                  className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="flex items-center justify-around">
                    <LocaleSwitcher />
                    <ThemeSwitcher />
                  </div>
                  
                  <motion.div 
                    className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {t('copyright', { year: new Date().getFullYear() })}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}