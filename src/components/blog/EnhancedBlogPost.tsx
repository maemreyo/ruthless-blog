'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Calendar, User, ArrowRight, ArrowLeft, BookOpen, Clock, Tag, Share, Heart, Bookmark, Copy, Check, Lightning, Fire } from '@/components/icons/PhosphorIcons';
import ClientMarkdown from '@/components/blog/ClientMarkdown';
import ShareButtons from '@/components/blog/ShareButtons';
import { useTheme } from 'next-themes';
import ScrollReveal from '@/components/ui/ScrollReveal';

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
  const isContentInView = useInView(contentRef, { once: true, amount: 0.1 });
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [headings, setHeadings] = useState<{id: string, text: string, level: number}[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  
  // Parallax scroll effect for header
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  // Smooth spring physics for parallax
  const smoothY = useSpring(y, { damping: 15, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 });
  const smoothScale = useSpring(scale, { damping: 15, stiffness: 100 });
  
  // Reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      if (!contentRef.current) return;
      
      const contentBox = contentRef.current.getBoundingClientRect();
      const contentHeight = contentBox.height;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollBottom = scrollTop + windowHeight;
      const contentTop = contentBox.top + scrollTop;
      const contentBottom = contentTop + contentHeight;
      
      // Calculate how much of the content is visible
      if (scrollBottom >= contentBottom) {
        setReadingProgress(100);
      } else if (scrollTop <= contentTop) {
        setReadingProgress(0);
      } else {
        const progress = ((scrollBottom - contentTop) / contentHeight) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };
    
    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
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
  
  // Track active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;
      
      const headingElements = headings.map(heading => 
        document.getElementById(heading.id)
      ).filter(Boolean) as HTMLElement[];
      
      if (headingElements.length === 0) return;
      
      // Find the heading that's currently in view
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        const rect = element.getBoundingClientRect();
        
        if (rect.top <= 100) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);
  
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
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-gray-300 mb-8">
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
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2
          }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-center justify-center">
            <motion.div 
              className="w-1.5 h-3 bg-white rounded-full"
              animate={{ 
                y: [0, 4, 0]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5
              }}
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
              animate={isContentInView ? "visible" : "hidden"}
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
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
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
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
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
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
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
              
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <motion.div 
                  className="mt-12"
                  variants={itemVariants}
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{relatedPostsLabel}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((post) => (
                      <Link 
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-primary font-medium">{readMoreLabel}</span>
                            <ArrowRight className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link 
                      href="/blog"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>{backToListLabel}</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}