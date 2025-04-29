'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SearchBar from '@/components/blog/SearchBar';

interface ImmersiveBlogHeaderProps {
  title: string;
  subtitle: string;
}

export default function ImmersiveBlogHeader({ title, subtitle }: ImmersiveBlogHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
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
  
  // Calculate rotation based on mouse position
  const rotateX = windowSize.height > 0 
    ? (mousePosition.y - windowSize.height / 2) / 100 
    : 0;
    
  const rotateY = windowSize.width > 0 
    ? -(mousePosition.x - windowSize.width / 2) / 100 
    : 0;
  
  return (
    <div 
      ref={containerRef}
      className="relative mb-16 overflow-hidden"
    >
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
          animate={{ 
            y: [0, -15, 0],
            transition: {
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[10%] w-80 h-80 rounded-full bg-accent/10 blur-xl"
          animate={{ 
            y: [0, -10, 0],
            transition: {
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            style={{
              perspective: 1000,
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glowing accent */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-70"></div>
            
            {/* Content card with glassmorphism */}
            <div className="relative bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg rounded-3xl p-12 border border-white/20 dark:border-gray-700/30 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    {title}
                  </motion.h1>
                  
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}