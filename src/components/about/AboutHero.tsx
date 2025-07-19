'use client';

import { motion } from 'framer-motion';


interface AboutHeroProps {
  title: string;
}

export default function AboutHero({ title }: AboutHeroProps) {
  
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
    <motion.div 
      className="mb-16 relative"
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
        className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-xl p-8 relative overflow-hidden"
        variants={fadeInUp}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-elegant">
              <Image 
                src="/images/profile/profile-photo.jpg" 
                alt="Matthew Ngo" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div> */}
          
          <div className="w-full md:w-2/3">
            {/* <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {authorTitle}
            </h2> */}
            {/* <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('authorIntro')}
            </p> */}
            {/* <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t('authorExperience')}
            </p> */}
            
            {/* <div className="flex flex-wrap gap-4">
              <a 
                href="https://github.com/maemreyo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <GithubLogo weight="fill" className="w-5 h-5" />
                <span>{t('github')}</span>
              </a>
              <a 
                href="https://twitter.com/maemreyo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <TwitterLogo weight="fill" className="w-5 h-5" />
                <span>{t('twitter')}</span>
              </a>
              <a 
                href="https://linkedin.com/in/maemreyo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <LinkedinLogo weight="fill" className="w-5 h-5" />
                <span>{t('linkedin')}</span>
              </a>
            </div> */}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-5 -mb-5"></div>
      </motion.div>
    </motion.div>
  );
}