'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Calendar, User, ArrowRight, ArrowLeft, BookOpen } from '@/components/icons/PhosphorIcons';
import ClientMarkdown from '@/components/blog/ClientMarkdown';
import ShareButtons from '@/components/blog/ShareButtons';

interface RelatedPost {
  title: string;
  date: string;
  slug: string;
}

interface ImmersiveBlogPostProps {
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

export default function ImmersiveBlogPost({
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
}: ImmersiveBlogPostProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isContentInView = useInView(contentRef, { once: true, amount: 0.1 });
  
  // Parallax scroll effect for header
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  // Smooth spring physics for parallax
  const smoothY = useSpring(y, { damping: 15, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 });
  const smoothScale = useSpring(scale, { damping: 15, stiffness: 100 });
  
  // Progress bar for reading
  
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  return (
    <>
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      {/* Hero header with parallax */}
      {thumbnail && (
        <div 
          ref={headerRef}
          className="relative h-[70vh] overflow-hidden -mt-12 mb-12"
        >
          <motion.div
            style={{ 
              y: smoothY,
              opacity: smoothOpacity,
              scale: smoothScale
            }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <Image 
                src={thumbnail} 
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={true}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </div>
          </motion.div>
          
          {/* Title overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-4xl mx-auto text-center text-white"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  {title}
                </motion.h1>
                
                <motion.div 
                  className="flex flex-wrap gap-6 justify-center mb-8 text-white/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar weight="fill" className="w-5 h-5 text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User weight="fill" className="w-5 h-5 text-primary" />
                    <span>{author}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BookOpen weight="fill" className="w-5 h-5 text-primary" />
                    <span>{readingTime}</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="w-8 h-12 rounded-full border-2 border-white/60 flex justify-center">
              <motion.div 
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
                animate={{ 
                  y: [0, 15, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Main content */}
      <div className="container mx-auto px-4">
        {/* If no thumbnail, show title here */}
        {!thumbnail && (
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {title}
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap gap-6 mb-8 text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Calendar weight="fill" className="w-5 h-5 text-primary" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User weight="fill" className="w-5 h-5 text-primary" />
                <span>{author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <BookOpen weight="fill" className="w-5 h-5 text-primary" />
                <span>{readingTime}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {tagsLabel}
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.span 
                  key={tag} 
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(var(--color-primary), 0.2)" 
                  }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Content */}
        <motion.div 
          ref={contentRef}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-10 -mt-10 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-5 -mb-5 -z-10"></div>
          
          <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 prose-headings:pb-2 prose-img:rounded-lg prose-a:text-primary">
            <ClientMarkdown content={content} />
          </div>
          
          {/* Share buttons */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ShareButtons 
              url={`/blog/${slug}`} 
              title={title} 
            />
          </motion.div>
        </motion.div>
        
        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <motion.div 
            className="mt-16 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-8 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block border-b-4 border-primary pb-2">{relatedPostsLabel}</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div 
                  key={relatedPost.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-elegant overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {relatedPost.date}
                    </p>
                    <Link 
                      href={`/blog/${relatedPost.slug}`} 
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors group"
                    >
                      {readMoreLabel}
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="inline-block"
                      >
                        <ArrowRight weight="bold" className="w-4 h-4" />
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Back to list */}
        <motion.div 
          className="mt-12 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors group"
          >
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: -5 }}
              className="inline-block"
            >
              <ArrowLeft weight="bold" className="w-5 h-5" />
            </motion.span>
            {backToListLabel}
          </Link>
        </motion.div>
      </div>
    </>
  );
}