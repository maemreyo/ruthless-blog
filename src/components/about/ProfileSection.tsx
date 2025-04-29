'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { GithubLogo, LinkedinLogo, Globe } from '@/components/icons/PhosphorIcons';

interface ProfileSectionProps {
  title: string;
  personalInfo: any;
  profileSummary: any;
}

export default function ProfileSection({ title, personalInfo, profileSummary }: ProfileSectionProps) {
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
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-8 mb-8"
        variants={fadeInUp}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-elegant">
              <Image 
                src={personalInfo.photoUrl || "/images/author.jpg"} 
                alt={personalInfo.displayName} 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {personalInfo.displayName}
            </h3>
            <p className="text-lg text-primary font-medium mb-4">
              {personalInfo.title}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
              "{personalInfo.motto}"
            </p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
              <span>{personalInfo.location.city}, {personalInfo.location.country}</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {personalInfo.links.map((link: any, index: number) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  {link.platform === 'GitHub' && <GithubLogo weight="fill" className="w-5 h-5" />}
                  {link.platform === 'LinkedIn' && <LinkedinLogo weight="fill" className="w-5 h-5" />}
                  {link.platform === 'Personal Website' && <Globe weight="fill" className="w-5 h-5" />}
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('profileSummary')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {profileSummary.fullText}
          </p>
          
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('keyStrengths')}
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            {profileSummary.keyStrengths.map((strength: string, index: number) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant p-8"
        variants={fadeInUp}
      >
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('skills')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {profileSummary.keywords.map((keyword: string, index: number) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}