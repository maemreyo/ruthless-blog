'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { 
  House, 
  Article, 
  User, 
  EnvelopeSimple,
  GithubLogo,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo
} from '@/components/icons/PhosphorIcons';
import { motion } from 'framer-motion';

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { href: 'https://github.com/wehttam', icon: <GithubLogo weight="fill" className="w-5 h-5" />, label: 'GitHub' },
    { href: 'https://twitter.com/wehttam', icon: <TwitterLogo weight="fill" className="w-5 h-5" />, label: 'Twitter' },
    { href: 'https://instagram.com/wehttam', icon: <InstagramLogo weight="fill" className="w-5 h-5" />, label: 'Instagram' },
    { href: 'https://linkedin.com/in/wehttam', icon: <LinkedinLogo weight="fill" className="w-5 h-5" />, label: 'LinkedIn' },
  ];
  
  const navItems = [
    { href: '/', icon: <House weight="fill" className="w-5 h-5" />, label: 'Home' },
    { href: '/blog', icon: <Article weight="fill" className="w-5 h-5" />, label: 'Blog' },
    { href: '/about', icon: <User weight="fill" className="w-5 h-5" />, label: 'About' },
    { href: '/contact', icon: <EnvelopeSimple weight="fill" className="w-5 h-5" />, label: 'Contact' },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-16 mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Copyright */}
          <motion.div 
            className="flex flex-col items-center md:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link 
                href="/" 
                className="text-2xl font-bold text-primary dark:text-white hover:text-primary-dark dark:hover:text-primary transition-colors"
              >
                Wehttam Blog
              </Link>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-400 mt-4"
            >
              {t('copyright', { year: currentYear })}
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-6"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                {t('poweredBy')}
              </p>
            </motion.div>
          </motion.div>
          
          {/* Navigation */}
          <motion.div 
            className="flex flex-col items-center md:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-semibold mb-6 text-gray-900 dark:text-white"
            >
              {t('navigation')}
            </motion.h3>
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 gap-4"
            >
              {navItems.map((item, index) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link 
                    href={item.href} 
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Social Links */}
          <motion.div 
            className="flex flex-col items-center md:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-semibold mb-6 text-gray-900 dark:text-white"
            >
              {t('followUs')}
            </motion.h3>
            <motion.div 
              variants={containerVariants}
              className="flex flex-wrap gap-4"
            >
              {socialLinks.map((link, index) => (
                <motion.a 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>© {currentYear} Wehttam Blog. {t('allRightsReserved')}</p>
        </motion.div>
      </div>
    </footer>
  );
}