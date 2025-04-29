'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from '@/components/icons/PhosphorIcons';
import BlogPostList from '@/components/blog/BlogPostList';

interface Post {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author: string;
  coverImage: string;
}

interface FeaturedPostsSectionProps {
  title: string;
  viewAllText: string;
  posts: Post[];
}

export default function FeaturedPostsSection({ title, viewAllText, posts }: FeaturedPostsSectionProps) {
  return (
    <section className="mb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block border-b-4 border-primary pb-2">{title}</span>
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors group"
          >
            {viewAllText}
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="inline-block"
            >
              <ArrowRight weight="bold" className="w-5 h-5" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
      
      <BlogPostList posts={posts} />
    </section>
  );
}