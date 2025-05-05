'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Calendar, User, ArrowRight, ArrowLeft, BookOpen, Clock, Tag, Share, Heart, Bookmark, Copy, Check, Fire, PaperPlaneTilt, ChatText } from '@/components/icons/PhosphorIcons';
import ClientMarkdown from '@/components/blog/ClientMarkdown';
import ShareButtons from '@/components/blog/ShareButtons';
import CategoryBadge from '@/components/blog/CategoryBadge';
import SeriesBadge from '@/components/blog/SeriesBadge';
import { useTheme } from 'next-themes';
import ScrollReveal from '@/components/ui/ScrollReveal';
import React from 'react';

interface RelatedPost {
  title: string;
  date: string;
  slug: string;
}

interface EnhancedBlogPostProps {
  title: string;
  content: string;
  formattedDate: string;
  author: string;
  readingTime: string;
  thumbnail?: string;
  category?: string;
  series?: string;
  seriesPart?: number;
  tags?: string[];
  relatedPosts: RelatedPost[];
  slug: string;
  tagsLabel: string;
  readMoreLabel: string;
  backToListLabel: string;
  relatedPostsLabel: string;
}

export default function EnhancedBlogPost({
  title,
  content,
  formattedDate,
  author,
  readingTime,
  thumbnail,
  category,
  series,
  seriesPart,
  tags,
  relatedPosts,
  slug,
  tagsLabel,
  readMoreLabel,
  backToListLabel,
  relatedPostsLabel
}: EnhancedBlogPostProps) {
  const { theme } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isContentInView = useInView(contentRef, { once: true, amount: 0.01 });
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [headings, setHeadings] = useState<{id: string, text: string, level: number}[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  
  // Parallax scroll effect for header - optimized
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });
  
  // Reduce the amount of transform to improve performance
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
  
  // Optimize spring physics with higher stiffness for better performance
  const smoothY = useSpring(y, { damping: 20, stiffness: 200 });
  const smoothOpacity = useSpring(opacity, { damping: 20, stiffness: 200 });
  const smoothScale = useSpring(scale, { damping: 20, stiffness: 200 });
  
  // Reading progress with throttling
  useEffect(() => {
    let ticking = false;
    let lastKnownScrollPosition = 0;
    let cachedContentTop = 0;
    let cachedContentHeight = 0;
    
    // Initialize cached values
    if (contentRef.current) {
      const contentBox = contentRef.current.getBoundingClientRect();
      cachedContentHeight = contentBox.height;
      cachedContentTop = contentBox.top + window.scrollY;
    }
    
    const updateReadingProgress = () => {
      if (!contentRef.current) return;
      
      // Only recalculate these values when needed (e.g., on resize)
      if (cachedContentHeight === 0) {
        const contentBox = contentRef.current.getBoundingClientRect();
        cachedContentHeight = contentBox.height;
        cachedContentTop = contentBox.top + window.scrollY;
      }
      
      const windowHeight = window.innerHeight;
      const scrollTop = lastKnownScrollPosition;
      const scrollBottom = scrollTop + windowHeight;
      const contentBottom = cachedContentTop + cachedContentHeight;
      
      // Calculate how much of the content is visible
      if (scrollBottom >= contentBottom) {
        setReadingProgress(100);
      } else if (scrollTop <= cachedContentTop) {
        setReadingProgress(0);
      } else {
        const progress = ((scrollBottom - cachedContentTop) / cachedContentHeight) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
      
      ticking = false;
    };
    
    const onScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateReadingProgress();
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Reset cached values on resize
    const onResize = () => {
      cachedContentHeight = 0;
      cachedContentTop = 0;
      updateReadingProgress();
    };
    
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    
    // Initial calculation
    updateReadingProgress();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  
  // Extract headings from content for table of contents
  useEffect(() => {
    const extractHeadings = () => {
      const headingRegex = /^(#{1,3})\s+(.+)$/gm;
      const matches = [...content.matchAll(headingRegex)];
      
      const extractedHeadings = matches.map(match => {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        return { id, text, level };
      });
      
      setHeadings(extractedHeadings);
    };
    
    extractHeadings();
  }, [content]);
  
  // Track active heading based on scroll position with throttling
  useEffect(() => {
    if (headings.length === 0) return;
    
    // Cache heading elements to avoid repeated DOM queries
    const headingElements = headings.map(heading => ({
      id: heading.id,
      element: document.getElementById(heading.id)
    })).filter(item => item.element) as {id: string, element: HTMLElement}[];
    
    if (headingElements.length === 0) return;
    
    let ticking = false;
    let lastKnownScrollPosition = 0;
    
    const updateActiveHeading = () => {
      // Find the heading that's currently in view
      let activeId = '';
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { id, element } = headingElements[i];
        const rect = element.getBoundingClientRect();
        
        if (rect.top <= 100) {
          activeId = id;
          break;
        }
      }
      
      if (activeId && activeId !== activeHeading) {
        setActiveHeading(activeId);
      }
      
      ticking = false;
    };
    
    const onScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveHeading();
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Initial check
    updateActiveHeading();
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings, activeHeading]);
  
  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  // Custom styling for markdown content
  const markdownStyles = `
    .markdown-content {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #374151;
    }
    
    .dark .markdown-content {
      color: #e5e7eb;
    }
    
    .markdown-content h1,
    .markdown-content h2,
    .markdown-content h3 {
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      scroll-margin-top: 100px;
      position: relative;
    }
    
    .markdown-content h1 {
      font-size: 2.25rem;
      line-height: 2.5rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.5rem;
    }
    
    .dark .markdown-content h1 {
      border-color: #374151;
    }
    
    .markdown-content h2 {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    
    .markdown-content h2::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 0.5rem;
      width: 0.25rem;
      height: 1.5rem;
      background: linear-gradient(to bottom, var(--color-primary), var(--color-accent));
      border-radius: 4px;
    }
    
    .markdown-content h3 {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    
    .markdown-content p {
      margin-bottom: 1.5rem;
    }
    
    .markdown-content a {
      color: var(--color-primary);
      text-decoration: none;
      border-bottom: 1px dashed var(--color-primary);
      transition: all 0.2s ease;
    }
    
    .markdown-content a:hover {
      border-bottom: 1px solid var(--color-primary);
    }
    
    .markdown-content blockquote {
      border-left: 4px solid var(--color-primary);
      padding-left: 1rem;
      margin-left: 0;
      margin-right: 0;
      font-style: italic;
      background-color: rgba(var(--color-primary-rgb), 0.05);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .markdown-content ul,
    .markdown-content ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    
    .markdown-content li {
      margin-bottom: 0.5rem;
    }
    
    .markdown-content code {
      background-color: #f3f4f6;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.875rem;
    }
    
    .dark .markdown-content code {
      background-color: #1f2937;
    }
    
    .markdown-content pre {
      background-color: #1f2937;
      color: #e5e7eb;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin-bottom: 1.5rem;
    }
    
    .markdown-content pre code {
      background-color: transparent;
      padding: 0;
      color: inherit;
    }
    
    .markdown-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1.5rem 0;
    }
    
    .markdown-content hr {
      border: none;
      height: 1px;
      background: linear-gradient(to right, transparent, var(--color-primary), transparent);
      margin: 2rem 0;
    }
    
    .markdown-content table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }
    
    .markdown-content th,
    .markdown-content td {
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
    }
    
    .dark .markdown-content th,
    .dark .markdown-content td {
      border-color: #374151;
    }
    
    .markdown-content th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    
    .dark .markdown-content th {
      background-color: #1f2937;
    }
    
    .markdown-content tr:nth-child(even) {
      background-color: #f3f4f6;
    }
    
    .dark .markdown-content tr:nth-child(even) {
      background-color: #1f2937;
    }
  `;
  
  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200 dark:bg-gray-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      {/* Header with parallax effect */}
      <div 
        ref={headerRef}
        className="relative h-[70vh] overflow-hidden"
      >
        {/* Background image with parallax */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            y: smoothY,
            opacity: smoothOpacity,
            scale: smoothScale
          }}
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30" />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/30" />
        </motion.div>
        
        {/* Header content */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="container mx-auto max-w-4xl text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <User weight="fill" className="w-5 h-5" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar weight="fill" className="w-5 h-5" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock weight="fill" className="w-5 h-5" />
                  <span>{readingTime}</span>
                </div>
              </div>
              
              {/* Category and Series badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {category && (
                  <CategoryBadge category={category} size="md" />
                )}
                {series && (
                  <SeriesBadge series={series} part={seriesPart} size="md" />
                )}
              </div>
              
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator - optimized with will-change */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-center justify-center">
            <motion.div 
              className="w-1.5 h-3 bg-white rounded-full"
              animate={{ 
                y: [0, 4, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
              style={{ willChange: "transform" }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Main content */}
      <div className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Table of contents - Desktop */}
            <div className="hidden lg:block lg:w-1/4 relative">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md"
                >
                  <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Table of Contents</h3>
                  
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm transition-colors duration-200 ${
                          activeHeading === heading.id
                            ? 'text-primary font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                        } ${heading.level === 1 ? '' : heading.level === 2 ? 'ml-3' : 'ml-6'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                          isLiked 
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Heart weight={isLiked ? "fill" : "regular"} className="w-5 h-5" />
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                      </button>
                      
                      <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                          isBookmarked 
                            ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Bookmark weight={isBookmarked ? "fill" : "regular"} className="w-5 h-5" />
                        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                      </button>
                      
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Main article content */}
            <motion.div 
              ref={contentRef}
              className="lg:w-3/4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Mobile action buttons */}
              <motion.div 
                className="lg:hidden flex items-center justify-between mb-8 gap-2"
                variants={itemVariants}
              >
                <Link 
                  href="/blog"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>{backToListLabel}</span>
                </Link>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full ${
                      isLiked 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    <Heart weight={isLiked ? "fill" : "regular"} className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-full ${
                      isBookmarked 
                        ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    <Bookmark weight={isBookmarked ? "fill" : "regular"} className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {isCopied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
              
              {/* Article content */}
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-8 md:p-12">
                  <style jsx global>{markdownStyles}</style>
                  <ClientMarkdown 
                    content={content} 
                    className="prose prose-lg dark:prose-invert max-w-none" 
                  />
                </div>
                
                {/* Article footer */}
                <div className="border-t border-gray-100 dark:border-gray-700 p-8 md:p-12 relative overflow-hidden">
                  {/* Background decorations */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                  
                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <motion.div 
                      className="mb-12"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Tag weight="bold" className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{tagsLabel}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {tags.map((tag, index) => (
                          <motion.span 
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Share buttons */}
                  <motion.div 
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <Share weight="bold" className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Share this article</h3>
                    </div>
                    
                    <ShareButtons title={title} slug={slug} />
                  </motion.div>
                  
                  {/* Author bio */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl transform rotate-1 scale-105"></div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl relative z-10">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                          <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                            <User weight="fill" className="w-12 h-12 text-gray-700 dark:text-gray-300" />
                          </div>
                        </div>
                        
                        <div className="text-center md:text-left">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{author}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
                            Content creator and web developer passionate about sharing knowledge and experiences. 
                            Specializing in modern web technologies and creating engaging user experiences.
                          </p>
                          
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Link 
                              href={`/about`}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full shadow-md hover:shadow-lg hover:bg-primary-dark transition-all"
                            >
                              <span>View Profile</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            
                            <div className="flex items-center gap-4">
                              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                              </a>
                              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                </svg>
                              </a>
                              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Related posts with enhanced design */}
              {relatedPosts.length > 0 && (
                <motion.div 
                  className="mt-16 mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  {/* Section header with decorative elements */}
                  <div className="relative mb-12">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent transform -translate-y-1/2"></div>
                    
                    <div className="relative flex flex-col items-center">
                      <span className="px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                        {relatedPosts.length} {relatedPosts.length === 1 ? 'Article' : 'Articles'}
                      </span>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-center bg-white dark:bg-gray-900 px-6 text-gray-800 dark:text-white relative z-10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                          {relatedPostsLabel}
                        </span>
                      </h2>
                      
                      <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl text-center">
                        Discover more articles related to this topic that might interest you
                      </p>
                    </div>
                  </div>
                  
                  {/* Cards with hover effects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedPosts.map((post, index) => (
                      <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="block h-full"
                        >
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full group relative">
                            {/* Decorative gradient top */}
                            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
                            
                            {/* Glowing effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            
                            <div className="p-6 relative z-10 h-full flex flex-col">
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <div className="flex items-center gap-1.5">
                                  <Calendar weight="fill" className="w-4 h-4 text-primary" />
                                  <span>{post.date}</span>
                                </div>
                              </div>
                              
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                              
                              <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                                <span className="text-sm font-medium text-primary">{readMoreLabel}</span>
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                  <ArrowRight weight="bold" className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Enhanced back to list button */}
                  <div className="mt-16 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="inline-block relative"
                    >
                      {/* Button with animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-md animate-pulse"></div>
                      <Link 
                        href="/blog"
                        className="relative inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <ArrowLeft weight="bold" className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-medium">{backToListLabel}</span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {/* Ultra WOW Footer Experience */}
              <div className="relative mt-24 mb-16 overflow-hidden">
                {/* 3D Perspective Container */}
                <div className="relative perspective-[1000px]">
                  {/* Floating 3D Card with Parallax Effect */}
                  <motion.div
                    initial={{ opacity: 0, rotateX: 10, y: 100 }}
                    whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 1.2, 
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }}
                    className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                  >
                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30"></div>
                    
                    {/* Animated Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-white opacity-60"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -100, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 5 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Animated Blobs */}
                    <motion.div 
                      className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-[80px]"
                      animate={{ 
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 15,
                        ease: "easeInOut"
                      }}
                    ></motion.div>
                    
                    <motion.div 
                      className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-[80px]"
                      animate={{ 
                        x: [0, -50, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 18,
                        ease: "easeInOut"
                      }}
                    ></motion.div>
                    
                    {/* Animated Mesh Grid */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')]"></div>
                    
                    {/* Content Container with Glass Effect */}
                    <div className="relative backdrop-blur-sm border border-white/10 p-12 md:p-16">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                        {/* Left Content */}
                        <div className="md:col-span-7">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          >
                            <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full mb-4">
                              ✨ Join our community
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                              <span className="block">Stay inspired with our</span>
                              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                                latest insights & updates
                              </span>
                            </h2>
                            
                            <p className="text-white/80 text-lg mb-8 max-w-xl">
                              Get exclusive content, early access to new articles, and join a community of passionate readers and creators.
                            </p>
                            
                            {/* Subscription Form with Animation */}
                            <motion.div 
                              className="relative max-w-md"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.6 }}
                            >
                              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-70 blur-sm"></div>
                              <div className="relative flex overflow-hidden rounded-full bg-white/10 backdrop-blur-md p-1">
                                <input 
                                  type="email" 
                                  placeholder="Enter your email address" 
                                  className="w-full bg-transparent px-5 py-3 text-white placeholder-white/60 outline-none"
                                />
                                <button className="shrink-0 gradient-btn px-6 py-3 text-white font-medium rounded-full">
                                  <span className="relative z-10 flex items-center gap-2">
                                    <span>Subscribe</span>
                                    <PaperPlaneTilt weight="bold" className="w-4 h-4" />
                                  </span>
                                </button>
                              </div>
                              
                              <p className="text-white/60 text-sm mt-3 ml-2">
                                We respect your privacy. Unsubscribe anytime.
                              </p>
                            </motion.div>
                            
                            {/* Social Proof */}
                            <motion.div 
                              className="mt-10 flex items-center gap-4"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.9 }}
                            >
                              <div className="flex -space-x-2">
                                {[...Array(4)].map((_, i) => (
                                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-800">
                                    {['A', 'B', 'C', 'D'][i]}
                                  </div>
                                ))}
                              </div>
                              <div className="text-white/80 text-sm">
                                Join <span className="font-bold text-white">2,500+</span> subscribers
                              </div>
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        {/* Right Content - 3D Floating Illustration */}
                        <div className="md:col-span-5 flex justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                            className="relative"
                          >
                            {/* 3D Floating Effect */}
                            <motion.div
                              animate={{ 
                                y: [0, -10, 0],
                                rotateZ: [0, 2, 0],
                                rotateX: [0, 5, 0],
                              }}
                              transition={{ 
                                repeat: Infinity,
                                duration: 6,
                                ease: "easeInOut"
                              }}
                              className="relative"
                            >
                              {/* Glowing Circle */}
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-30 blur-2xl"></div>
                              
                              {/* Main Circle */}
                              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                                {/* Inner Circles Animation */}
                                <div className="absolute w-full h-full">
                                  <motion.div 
                                    className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-primary/20"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                  ></motion.div>
                                  <motion.div 
                                    className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-accent/20"
                                    animate={{ scale: [1.2, 1, 1.2], opacity: [0, 0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                  ></motion.div>
                                </div>
                                
                                {/* Icon */}
                                <motion.div
                                  animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, 0, -5, 0],
                                  }}
                                  transition={{ 
                                    repeat: Infinity,
                                    duration: 8,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <ChatText weight="duotone" className="w-24 h-24 text-white" />
                                </motion.div>
                              </div>
                              
                              {/* Orbiting Elements */}
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                                  style={{
                                    top: `${50 + 35 * Math.sin(2 * Math.PI * i / 3)}%`,
                                    left: `${50 + 35 * Math.cos(2 * Math.PI * i / 3)}%`,
                                  }}
                                  animate={{
                                    rotate: [0, 360],
                                    x: [0, 10, -10, 0],
                                    y: [0, -10, 10, 0],
                                  }}
                                  transition={{
                                    rotate: { repeat: Infinity, duration: 20 },
                                    x: { repeat: Infinity, duration: 5 + i },
                                    y: { repeat: Infinity, duration: 6 + i },
                                  }}
                                >
                                  {[Fire, Heart, BookOpen][i] && React.createElement([Fire, Heart, BookOpen][i], { 
                                    weight: "fill", 
                                    className: "w-5 h-5 text-white" 
                                  })}
                                </motion.div>
                              ))}
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Reflection Effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.4 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute top-full left-0 right-0 h-40 bg-gradient-to-b from-primary/10 to-transparent transform -translate-y-20 blur-md"
                    style={{ 
                      maskImage: 'linear-gradient(to bottom, black, transparent)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
                    }}
                  ></motion.div>
                </div>
                
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}