'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Calendar, User, Clock, Fire, Tag } from '@/components/icons/PhosphorIcons';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Post {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author: string;
  coverImage: string;
  readingTime?: string;
  category?: string;
}

interface EnhancedFeaturedPostsProps {
  title: string;
  viewAllText: string;
  posts: Post[];
}

export default function EnhancedFeaturedPosts({ 
  title, 
  viewAllText, 
  posts 
}: EnhancedFeaturedPostsProps) {
  const t = useTranslations('Index');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform values for parallax effect
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 15, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  // Auto-play carousel
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovering, currentIndex]);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  // Mouse move effect for card
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovering) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, isHovering]);
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
  };
  
  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.8
      }
    }
  };
  
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -5 : 5
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.5
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 5 : -5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        duration: 0.5
      }
    })
  };
  
  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };
  
  return (
    <section 
      ref={containerRef}
      className="py-20 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
        
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent"></div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-20 left-[5%] w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 }
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={titleVariants} className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              {title}
            </h2>
            <motion.div 
              className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 96, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4"
            variants={titleVariants}
          >
            {t('discoverArticles')}
          </motion.p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Featured post carousel */}
          <div className="w-full lg:w-2/3 relative">
            <div 
              ref={cardRef}
              className="relative h-[600px] overflow-hidden rounded-3xl shadow-2xl"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Navigation controls - Positioned outside the 3D transform */}
              <div className="absolute bottom-6 right-6 flex items-center gap-3 z-30">
                <motion.button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft weight="bold" className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight weight="bold" className="w-5 h-5" />
                </motion.button>
              </div>
              
              <motion.div
                style={{
                  transformPerspective: 1000
                }}
                className="w-full h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Post image with parallax effect */}
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    <div className="relative w-full h-full">
                      {/* Image with overlay */}
                      <div className="absolute inset-0">
                        <Image
                          src={posts[currentIndex].coverImage}
                          alt={posts[currentIndex].title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                        <ScrollReveal>
                          <div className="max-w-3xl">
                            {/* Category badge */}
                            <motion.div 
                              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/90 text-white rounded-full mb-4 backdrop-blur-sm"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Tag weight="fill" className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {posts[currentIndex].category || 'Featured'}
                              </span>
                            </motion.div>
                            
                            {/* Title */}
                            <motion.h3 
                              className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              {posts[currentIndex].title}
                            </motion.h3>
                            
                            {/* Meta info */}
                            <motion.div 
                              className="flex flex-wrap items-center gap-4 mb-6 text-gray-300"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="flex items-center gap-2">
                                <User weight="fill" className="w-4 h-4" />
                                <span>{posts[currentIndex].author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar weight="fill" className="w-4 h-4" />
                                <span>{posts[currentIndex].date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock weight="fill" className="w-4 h-4" />
                                <span>{posts[currentIndex].readingTime || '5 min read'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Fire weight="fill" className="w-4 h-4 text-amber-500" />
                                <span>{t('trending')}</span>
                              </div>
                            </motion.div>
                            
                            {/* Excerpt */}
                            <motion.p 
                              className="text-lg text-gray-200 mb-8 line-clamp-2"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              {posts[currentIndex].excerpt}
                            </motion.p>
                            
                            {/* CTA Button */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                              className="relative z-20"
                            >
                              <Link 
                                href={`/blog/${posts[currentIndex].slug}`}
                                className="relative inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-medium rounded-full shadow-xl hover:shadow-white/30 transition-all duration-300 group overflow-hidden"
                              >
                                <span className="relative z-10">{t('readArticle')}</span>
                                <motion.span
                                  initial={{ x: 0 }}
                                  whileHover={{ x: 5 }}
                                  className="relative z-10"
                                >
                                  <ArrowRight weight="bold" className="w-5 h-5" />
                                </motion.span>
                                
                                {/* Animated background */}
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: 0 }}
                                  transition={{ duration: 0.4 }}
                                />
                              </Link>
                            </motion.div>
                          </div>
                        </ScrollReveal>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation controls - Moved outside the 3D transform to ensure they're clickable */}
                
                {/* Progress indicator */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 z-20">
                  {posts.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      className={`h-2 rounded-full ${
                        index === currentIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/40 w-2'
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Side posts */}
          <div className="w-full lg:w-1/3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="space-y-6"
            >
              <motion.div
                className="flex items-center justify-between mb-6"
                variants={titleVariants}
              >
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  More Featured Articles
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    {posts.filter((_, i) => i !== currentIndex).length} articles
                  </span>
                </div>
              </motion.div>
              
              {/* Featured side posts - first 2 with larger display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {posts.filter((_, i) => i !== currentIndex).slice(0, 2).map((post, index) => (
                  <motion.div
                    key={post.slug}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.2 + index * 0.1, duration: 0.5 }
                      }
                    }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-full group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {post.category && (
                        <div className="absolute top-3 left-3 bg-primary/80 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                          {post.category}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readingTime || '5 min'}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-medium text-sm transition-colors group-hover:underline"
                        >
                          <span>Read more</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Additional side posts - compact list style */}
              <motion.div
                variants={titleVariants}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-100 dark:border-gray-700"
              >
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Fire weight="fill" className="w-5 h-5 text-primary mr-2" />
                  <span>{t('moreToExplore')}</span>
                </h4>
                
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                  {posts.filter((_, i) => i !== currentIndex).slice(2, 6).map((post, index) => (
                    <motion.div
                      key={post.slug}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: 0.4 + index * 0.1, duration: 0.5 }
                        }
                      }}
                      className={`${index > 0 ? 'pt-4' : ''} group`}
                    >
                      <Link href={`/blog/${post.slug}`} className="flex items-start gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h5>
                          
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link 
                    href="/blog"
                    className="inline-flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <span>{viewAllText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}