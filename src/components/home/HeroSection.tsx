'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

interface HeroSectionProps {
  title: string;
  description: string;
  viewBlogText: string;
  aboutMeText: string;
}

export default function HeroSection({ title, description, viewBlogText, aboutMeText }: HeroSectionProps) {
  return (
    <section className="py-20 mb-16 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link 
              href="/blog" 
              className="px-8 py-3 bg-primary text-white font-medium text-lg rounded-lg shadow-elegant hover:bg-primary-dark hover:shadow-float transition-all duration-300"
            >
              {viewBlogText}
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-3 bg-white dark:bg-gray-800 text-primary dark:text-white font-medium text-lg rounded-lg shadow-elegant hover:shadow-float transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {aboutMeText}
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-10 -mb-10"></div>
    </section>
  );
}