'use client';

import { motion } from 'framer-motion';
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

interface BlogPostContentProps {
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

export default function BlogPostContent({
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
}: BlogPostContentProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* Thumbnail with modern style */}
      {thumbnail && (
        <motion.div 
          className="mb-12 relative rounded-xl overflow-hidden shadow-elegant-lg"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="relative h-[400px] overflow-hidden">
            {thumbnail.startsWith('/') ? (
              <Image 
                src={thumbnail} 
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                className="object-cover"
                priority={true}
              />
            ) : (
              <Image 
                src={thumbnail} 
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                className="object-cover"
                priority={true}
              />
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </motion.div>
      )}
      
      {/* Title and meta information */}
      <motion.div 
        className="mb-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
          variants={fadeInUp}
        >
          {title}
        </motion.h1>
        
        <motion.div 
          className="flex flex-wrap gap-6 mb-8 text-gray-600 dark:text-gray-400"
          variants={fadeInUp}
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
              <span 
                key={tag} 
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Content */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-8 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 prose-headings:pb-2 prose-img:rounded-lg prose-a:text-primary">
          <ClientMarkdown content={content} />
        </div>
        
        {/* Share buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <ShareButtons 
            url={`/blog/${slug}`} 
            title={title} 
          />
        </div>
      </motion.div>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <motion.div 
          className="mt-16 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-2xl font-bold mb-8 text-gray-900 dark:text-white"
            variants={fadeInUp}
          >
            <span className="inline-block border-b-4 border-primary pb-2">{relatedPostsLabel}</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <motion.div 
                key={relatedPost.slug}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-elegant hover:shadow-float transition-all duration-300 overflow-hidden"
                whileHover={{ y: -5 }}
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
        className="mt-12"
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
    </>
  );
}