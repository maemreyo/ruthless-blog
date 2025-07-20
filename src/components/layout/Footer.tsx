'use client';

import { useState, useEffect } from 'react';
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
  LinkedinLogo,
  PaperPlaneTilt,
  ArrowUp,
  Planet,
  Rocket,
  Star,
  Sparkle,
  Lightning
} from '@/components/icons/PhosphorIcons';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Scroll to top functionality
  const { scrollYProgress } = useScroll();
  const scrollYProgressSpring = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });
  const scrollOpacity = useTransform(scrollYProgressSpring, [0, 0.1], [0, 1]);
  const scrollScale = useTransform(scrollYProgressSpring, [0, 0.1], [0.8, 1]);
  
  // Mouse move effect for interactive gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition, mouseX, mouseY]);
  
  // Interactive gradient that follows mouse
  const background = useMotionTemplate`radial-gradient(
    circle at ${mouseX}px ${mouseY}px,
    rgba(var(--color-primary-rgb), 0.15) 0%,
    rgba(var(--color-primary-rgb), 0.05) 20%,
    rgba(var(--color-primary-rgb), 0.01) 40%,
    transparent 60%
  )`;
  
  // Handle newsletter subscription
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would send this to your API
      console.log('Subscribing email:', email);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const socialLinks = [
    { href: 'https://github.com/ruthless', icon: <GithubLogo weight="fill" className="w-5 h-5" />, label: 'GitHub', color: 'hover:text-[#333]' },
    { href: 'https://twitter.com/ruthless', icon: <TwitterLogo weight="fill" className="w-5 h-5" />, label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
    { href: 'https://instagram.com/ruthless', icon: <InstagramLogo weight="fill" className="w-5 h-5" />, label: 'Instagram', color: 'hover:text-[#E1306C]' },
    { href: 'https://linkedin.com/in/ruthless', icon: <LinkedinLogo weight="fill" className="w-5 h-5" />, label: 'LinkedIn', color: 'hover:text-[#0077B5]' },
  ];
  
  const navT = useTranslations('Navigation');
  const navItems = [
    { href: '/', icon: <House weight="fill" className="w-5 h-5" />, label: navT('home') },
    { href: '/blog', icon: <Article weight="fill" className="w-5 h-5" />, label: navT('blog') },
    { href: '/about', icon: <User weight="fill" className="w-5 h-5" />, label: navT('about') },
    { href: '/contact', icon: <EnvelopeSimple weight="fill" className="w-5 h-5" />, label: navT('contact') },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };
  
  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        {/* Animated stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Larger decorative elements */}
        <motion.div 
          className="absolute top-20 left-[10%] text-primary/20 dark:text-primary/10"
          animate={floatingAnimation}
        >
          <Planet weight="duotone" className="w-24 h-24" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-40 right-[5%] text-accent/20 dark:text-accent/10"
          animate={{
            ...floatingAnimation,
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Rocket weight="duotone" className="w-16 h-16" />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 left-[80%] text-yellow-500/20 dark:text-yellow-500/10"
          animate={{
            ...floatingAnimation,
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Star weight="duotone" className="w-20 h-20" />
        </motion.div>
      </div>
      
      {/* Interactive background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ background }}
      />
      
      {/* Main footer content */}
      <div className="relative bg-gradient-to-b from-gray-50/80 to-gray-50 dark:from-gray-900/80 dark:to-gray-900 backdrop-blur-sm pt-32 pb-16 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4">
          {/* Top section with newsletter */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl"></div>
            
            <motion.div 
              className="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 dark:border-gray-700/20 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              {/* Animated mesh grid background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTI4LDEyOCwxMjgsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')]"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {t('stayUpdated')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                      {t('newsletterDescription')}
                    </p>
                  </motion.div>
                  
                  <motion.form 
                    onSubmit={handleSubmit}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="relative max-w-md">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-70 blur-sm"></div>
                      <div className="relative flex overflow-hidden rounded-full bg-white dark:bg-gray-800 p-1">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('emailPlaceholder')}
                          className="w-full bg-transparent px-5 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                          required
                        />
                        <button 
                          type="submit"
                          className="shrink-0 gradient-btn px-6 py-3 text-white font-medium rounded-full"
                          disabled={isSubmitted}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {isSubmitted ? (
                              <>
                                <Sparkle weight="fill" className="w-4 h-4" />
                                <span>{t('subscribed')}</span>
                              </>
                            ) : (
                              <>
                                <span>{t('subscribe')}</span>
                                <PaperPlaneTilt weight="bold" className="w-4 h-4" />
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 ml-2">
                      {t('privacyNotice')}
                    </p>
                  </motion.form>
                </div>
                
                <div className="hidden md:flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="relative"
                  >
                    {/* 3D Floating Effect */}
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 8,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="flex justify-center mb-4">
                              <Lightning weight="duotone" className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {t('joinCommunity')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {t('exclusiveContent')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Logo and Copyright */}
            <motion.div 
              className="flex flex-col items-center md:items-start md:col-span-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="mb-6">
                <Link 
                  href="/" 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500"
                >
                  {t('title', { year: currentYear })}
                </Link>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-center md:text-left"
              >
                {t('footerDescription')}
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4 mb-8"
              >
                {socialLinks.map((link, index) => (
                  <motion.a 
                    key={index}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-400 ${link.color} transition-all`}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Navigation */}
            <motion.div 
              className="md:col-span-3 md:col-start-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left"
              >
                {t('navigation')}
              </motion.h3>
              
              <motion.div 
                variants={containerVariants}
                className="flex flex-col gap-4"
              >
                {navItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div 
              className="md:col-span-3 md:col-start-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-center md:text-left"
              >
                {t('quickLinks')}
              </motion.h3>
              
              <motion.div 
                variants={containerVariants}
                className="flex flex-col gap-3"
              >
                {[
                  { key: 'terms', label: t('terms') },
                  { key: 'privacy', label: t('privacy') },
                  { key: 'cookies', label: t('cookies') },
                  { key: 'faq', label: t('faq') },
                  { key: 'help', label: t('help') }
                ].map((item) => (
                  <motion.div key={item.key} variants={itemVariants}>
                    <Link 
                      href="#" 
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Bottom bar */}
          <motion.div 
            className="mt-16 pt-8 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Ruthless Blog. {t('allRightsReserved')}
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('madeWith')} ❤️
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-50 hover:bg-primary-dark transition-colors"
        style={{ opacity: scrollOpacity, scale: scrollScale }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp weight="bold" className="w-5 h-5" />
      </motion.button>
      
      {/* Custom CSS for gradient button */}
      <style jsx global>{`
        .gradient-btn {
          background: linear-gradient(to right, var(--color-primary), var(--color-accent));
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        
        .gradient-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(to right, var(--color-accent), var(--color-primary), var(--color-accent));
          z-index: -1;
          transition: transform 0.6s ease;
        }
        
        .gradient-btn:hover::before {
          transform: translateX(50%);
        }
      `}</style>
    </footer>
  );
}