'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ParallaxMouse from '@/components/ui/ParallaxMouse';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import SearchBar from '@/components/blog/SearchBar';

interface ImmersiveHeaderProps {
  title: string;
  subtitle: string;
}

export default function ImmersiveHeader({ title, subtitle }: ImmersiveHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  // Smooth spring physics for parallax
  const smoothY = useSpring(y, { damping: 15, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 });
  const smoothScale = useSpring(scale, { damping: 15, stiffness: 100 });
  
  // Floating elements animation
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };
  
  const floatingAnimationSlow = {
    y: [0, -10, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative mb-16 overflow-hidden py-32"
    >
      {/* Animated background */}
      <AnimatedBackground type="particles" particleCount={50} />
      
      {/* Background elements with parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          y: smoothY,
          opacity: smoothOpacity,
          scale: smoothScale
        }}
      >
        {/* Decorative circles */}
        <motion.div 
          className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full bg-primary/10 blur-xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[10%] w-80 h-80 rounded-full bg-accent/10 blur-xl"
          animate={floatingAnimationSlow}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <ParallaxMouse 
            className="max-w-4xl mx-auto"
            strength={10}
          >
            {/* Glowing accent */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-70"></div>
            
            {/* Content card with glassmorphism */}
            <div className="relative bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl p-12 border border-white/20 dark:border-gray-700/30 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="mb-4"
                  >
                    {title}
                  </motion.div>
                  
                  <motion.p 
                    className="text-xl max-w-3xl text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {subtitle}
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="w-full md:w-auto"
                >
                  <SearchBar className="w-full md:w-64" />
                </motion.div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-10 -mt-10 blur-md"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full -ml-5 -mb-5 blur-md"></div>
    {/* Removed search bar from here to avoid duplication */}        </div>
          </ParallaxMouse>
        </div>
      </div>
    </div>
  );
}