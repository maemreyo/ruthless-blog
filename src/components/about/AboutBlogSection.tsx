'use client';

import { motion } from 'framer-motion';

interface AboutBlogSectionProps {
  blogTitle: string;
}

export default function AboutBlogSection({ blogTitle }: AboutBlogSectionProps) {
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
          Wehttam Blog is a platform where I share my thoughts, tutorials, and insights on web development, programming best practices, and technology trends. The blog is designed to be a resource for developers of all skill levels, from beginners to experts.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          My goal is to create content that is not only informative but also engaging and accessible. I believe in the power of knowledge sharing and community building in the tech industry.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Whether you're looking to learn a new technology, improve your coding skills, or stay updated with the latest trends, I hope you'll find something valuable here.
        </p>
      </motion.div>
    </motion.section>
  );
}