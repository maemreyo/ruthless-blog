'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ExperienceHighlight {
  area: string;
  highlight: string;
  impact: string;
  skillsDemonstrated: string[];
}

interface ExperienceSectionProps {
  title: string;
  keyHighlights: ExperienceHighlight[];
}

export default function ExperienceSection({ title, keyHighlights }: ExperienceSectionProps) {
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
        <span className="inline-block border-b-4 border-primary pb-2">{title}</span>
      </motion.h2>
      
      <div className="space-y-6">
        {keyHighlights.map((highlight, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-8"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              {highlight.area}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {highlight.highlight}
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-primary mb-2">{t('impact')}</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {highlight.impact}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t('skillsUsed')}</h4>
              <div className="flex flex-wrap gap-2">
                {highlight.skillsDemonstrated.map((skill: string, skillIndex: number) => (
                  <span 
                    key={skillIndex} 
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}