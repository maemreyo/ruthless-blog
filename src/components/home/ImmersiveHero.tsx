'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import LiquidButton from '@/components/ui/LiquidButton';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import ParallaxMouse from '@/components/ui/ParallaxMouse';

interface ImmersiveHeroProps {
  title: string;
  description: string;
  viewBlogText: string;
  aboutMeText: string;
}

export default function ImmersiveHero({ 
  title, 
  description, 
  viewBlogText, 
  aboutMeText 
}: ImmersiveHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // Smooth spring physics for parallax
  const smoothY = useSpring(y, { damping: 15, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 });
  const smoothScale = useSpring(scale, { damping: 15, stiffness: 100 });
  
  // 3D tilt effect based on mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Disable on mobile
      
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
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
  
  const floatingAnimationFast = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative h-[100vh] overflow-hidden"
    >
      {/* Animated background */}
      <AnimatedBackground type="particles" particleCount={80} />
      
      {/* Parallax background elements */}
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
          className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-primary/10 blur-xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-accent/10 blur-xl"
          animate={floatingAnimationSlow}
        />
        <motion.div 
          className="absolute top-[30%] left-[25%] w-40 h-40 rounded-full bg-yellow-400/10 blur-xl"
          animate={floatingAnimationFast}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
      </motion.div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <ParallaxMouse strength={15} className="max-w-4xl text-center relative z-10">
          {/* Glowing accent */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-70"></div>
          
          {/* Content card with glassmorphism */}
          <div className="relative bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl p-12 border border-white/20 dark:border-gray-700/30 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold  bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient">
                {title}
              </h1>
            </motion.div>
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <LiquidButton href="/blog">
                <span className="relative z-10">{viewBlogText}</span>
              </LiquidButton>
              
              <Link 
                href="/about" 
                className="px-8 py-4 bg-white dark:bg-gray-800 text-primary dark:text-white font-medium text-lg rounded-full shadow-lg hover:shadow-accent/20 transition-all duration-300 border border-gray-200 dark:border-gray-700 inline-flex items-center gap-2 hover:scale-105"
              >
                {aboutMeText}
              </Link>
            </motion.div>
            
            {/* Decorative elements inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-10 -mt-10 blur-md"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-5 -mb-5 blur-md"></div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="w-8 h-12 rounded-full border-2 border-gray-400 dark:border-gray-600 flex justify-center">
              <motion.div 
                className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
                animate={{ 
                  y: [0, 15, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </ParallaxMouse>
      </div>
    </div>
  );
}