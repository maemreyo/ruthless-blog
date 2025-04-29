'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowRight, Calendar, User, Clock, Tag, MagnifyingGlass, Funnel, X, BookOpen } from '@/components/icons/PhosphorIcons';
import ScrollReveal from '@/components/ui/ScrollReveal';
import CategoryBadge from '@/components/blog/CategoryBadge';
import SeriesBadge from '@/components/blog/SeriesBadge';

interface Post {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author: string;
  coverImage: string;
  readingTime?: string;
  category?: string;
  series?: string;
  seriesPart?: number;
  tags?: string[];
}

interface EnhancedBlogGridProps {
  title: string;
  readMoreText: string;
  posts: Post[];
  categories?: string[];
}

export default function EnhancedBlogGrid({ 
  title, 
  readMoreText, 
  posts,
  categories = ['All', 'Technology', 'Design', 'Development', 'Business']
}: EnhancedBlogGridProps) {
  const t = useTranslations('Blog');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const controls = useAnimation();
  
  // Initialize filtered posts
  useEffect(() => {
    setFilteredPosts([...posts]);
  }, [posts]);
  
  // Filter posts based on search term and category
  useEffect(() => {
    let results = [...posts]; // Create a copy to avoid reference issues
    
    if (searchTerm) {
      results = results.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    if (selectedCategory !== 'All') {
      results = results.filter(post => post.category === selectedCategory);
    }
    
    console.log('Filtered posts:', results.length, 'Selected category:', selectedCategory);
    setFilteredPosts(results);
  }, [searchTerm, selectedCategory, posts]);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
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
    hidden: { opacity: 0, y: 30 },
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled in the useEffect
  };
  
  return (
    <section 
      ref={containerRef}
      className="py-16 md:py-24 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
        
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4"
            variants={itemVariants}
          >
            {t('exploreCollection')}
          </motion.p>
        </motion.div>
        
        {/* Search and filter section */}
        <motion.div 
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search bar */}
              <motion.form 
                className="w-full md:w-2/3"
                onSubmit={handleSearch}
                variants={itemVariants}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full py-3 px-5 pl-12 bg-gray-100 dark:bg-gray-700 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700 dark:text-gray-300"
                  />
                  <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                </div>
              </motion.form>
              
              {/* Filter button (mobile) */}
              <motion.div 
                className="md:hidden w-full"
                variants={itemVariants}
              >
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-gray-100 dark:bg-gray-700 rounded-full"
                >
                  <Funnel className="w-5 h-5" />
                  <span>{t('filterByCategory')}</span>
                  {selectedCategory !== 'All' && (
                    <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-sm">
                      {selectedCategory}
                    </span>
                  )}
                </button>
              </motion.div>
              
              {/* Categories (desktop) */}
              <motion.div 
                className="hidden md:flex items-center gap-2 flex-wrap justify-center md:justify-end w-full md:w-1/3"
                variants={itemVariants}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            </div>
            
            {/* Mobile category filter */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 md:hidden"
                >
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsFilterOpen(false);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Results count */}
        <motion.div 
          className="mb-8 flex justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.p 
            className="text-gray-600 dark:text-gray-400"
            variants={itemVariants}
          >
            {t('showing')} <span className="font-medium text-gray-800 dark:text-white">{filteredPosts.length}</span> {t('articles')}
          </motion.p>
          
          {(searchTerm || selectedCategory !== 'All') && (
            <motion.button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
              <span>{t('clearFilters')}</span>
            </motion.button>
          )}
        </motion.div>
        
        {/* Blog grid */}
        {filteredPosts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform transition-all duration-300">
                  {/* Image container with overlay */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Category badge */}
                    {post.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <CategoryBadge category={post.category} size="sm" />
                      </div>
                    )}
                    
                    {/* Series badge */}
                    {post.series && (
                      <div className="absolute top-4 right-4 z-10">
                        <SeriesBadge series={post.series} part={post.seriesPart} size="sm" />
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Hover info */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={hoveredCard === index ? { y: 0 } : { y: 20 }}
                    >
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="px-6 py-3 bg-primary text-white font-medium rounded-full transform transition-transform duration-300 hover:scale-105 shadow-md"
                      >
                        {t('readArticle')}
                      </Link>
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime || '5 min read'}</span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Author */}
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{post.author}</span>
                      </div>
                      
                      <div className="relative z-20">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-medium transition-colors group/link relative"
                        >
                          <span>{readMoreText}</span>
                          <motion.span
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            className="inline-block"
                          >
                            <ArrowRight weight="bold" className="w-4 h-4" />
                          </motion.span>
                          
                          {/* Animated underline */}
                          <motion.span 
                            className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                            initial={{ scaleX: 0, originX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div 
              className="mb-6 text-gray-400 dark:text-gray-500"
              variants={itemVariants}
            >
              <MagnifyingGlass weight="duotone" className="w-16 h-16 mx-auto" />
            </motion.div>
            <motion.h3 
              className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
              variants={itemVariants}
            >
              No articles found
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-400"
              variants={itemVariants}
            >
              Try adjusting your search or filter to find what you're looking for.
            </motion.p>
          </motion.div>
        )}
        
        {/* Pagination or load more */}
        {filteredPosts.length > 0 && (
          <motion.div 
            className="mt-16 flex justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.button
              className="px-8 py-3 bg-white dark:bg-gray-800 text-primary border border-gray-200 dark:border-gray-700 rounded-full shadow hover:shadow-md transition-all flex items-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Load more articles</span>
              <motion.span
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5,
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}