'use client';

import { motion } from 'framer-motion';

interface Technology {
  name: string;
  description: string;
}

interface TechnologiesSectionProps {
  techTitle: string;
  technologies: Technology[];
}

export default function TechnologiesSection({ techTitle, technologies }: TechnologiesSectionProps) {
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
        <span className="inline-block border-b-4 border-primary pb-2">{techTitle}</span>
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((tech) => (
          <motion.div 
            key={tech.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-elegant p-6 hover:shadow-float transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{tech.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tech.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}