'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface AboutBlogSectionProps {
  blogTitle: string;
}

export default function AboutBlogSection({ blogTitle }: AboutBlogSectionProps) {
  const t = useTranslations('About');
  
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
    <motion.section 
      className="mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <motion.h2 
        className="text-2xl font-bold mb-8 text-gray-900 dark:text-white"
        variants={fadeInUp}
      >
        <span className="inline-block border-b-4 border-primary pb-2">{blogTitle}</span>
      </motion.h2>
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-8"
        variants={fadeInUp}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {t('blogDescription1')}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {t('blogDescription2')}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          {t('blogDescription3')}
        </p>
      </motion.div>
    </motion.section>
  );
}