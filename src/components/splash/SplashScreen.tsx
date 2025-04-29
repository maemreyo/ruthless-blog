'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function SplashScreen({ 
  onComplete, 
  duration = 3500 
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const logoX = useTransform(mouseX, [-500, 500], [30, -30]);
  const logoY = useTransform(mouseY, [-500, 500], [30, -30]);
  
  const textX = useTransform(mouseX, [-500, 500], [15, -15]);
  const textY = useTransform(mouseY, [-500, 500], [15, -15]);
  
  const bgX = useTransform(mouseX, [-500, 500], [-10, 10]);
  const bgY = useTransform(mouseY, [-500, 500], [-10, 10]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setMousePosition({
        x: e.clientX - centerX,
        y: e.clientY - centerY
      });
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  useEffect(() => {
    // Check if splash has been shown before
    const hasShownSplash = sessionStorage.getItem('hasShownSplash');
    
    if (hasShownSplash) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      setLoadingProgress(progress);
      
      if (progress === 100) {
        clearInterval(interval);
        
        // Add a small delay after reaching 100% before hiding
        setTimeout(() => {
          controls.start('exit').then(() => {
            setIsVisible(false);
            sessionStorage.setItem('hasShownSplash', 'true');
            if (onComplete) onComplete();
          });
        }, 800);
      }
    }, 400);
    
    return () => clearInterval(interval);
  }, [duration, onComplete, controls]);
  
  // Logo animation variants
  const logoVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.5,
      rotateY: 90,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        type: 'spring',
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0,
      scale: 1.5,
      filter: 'blur(20px)',
      transition: { 
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  // Text animation variants
  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        delay: 0.5,
        duration: 1,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      filter: 'blur(10px)',
      transition: { 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  // Letter animation for text reveal
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.7 + i * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };
  
  // Particles animation
  const particleCount = 30;
  const particles = Array.from({ length: particleCount }, (_, i) => i);
  
  // 3D Cube animation
  const cubeVariants = {
    hidden: { 
      opacity: 0,
      rotateX: 90,
      rotateY: -90,
      scale: 0
    },
    visible: { 
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      transition: { 
        delay: 0.2,
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        type: 'spring',
        stiffness: 80
      }
    },
    exit: { 
      opacity: 0,
      rotateX: 90,
      rotateY: 90,
      scale: 0,
      transition: { 
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      rotateX: mousePosition.y * 0.05,
      rotateY: mousePosition.x * 0.05,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  // Progress bar animation
  const progressVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${loadingProgress}%`,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  // Text for letter animation
  const blogText = "Wehttam Blog";
  const taglineText = "Exploring ideas through words";
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden perspective-1000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }
          }}
          style={{ perspective: 1000 }}
        >
          {/* Animated background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"
            style={{ x: bgX, y: bgY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
          
          {/* Animated particles */}
          {particles.map((i) => {
            const size = Math.random() * 15 + 5;
            const xPos = Math.random() * 100;
            const yPos = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = Math.random() * 8 + 4;
            const color = i % 3 === 0 
              ? 'rgba(var(--color-primary), 0.3)' 
              : i % 3 === 1 
                ? 'rgba(var(--color-accent), 0.3)' 
                : 'rgba(var(--color-secondary), 0.3)';
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${xPos}%`,
                  top: `${yPos}%`,
                  backgroundColor: color,
                  filter: 'blur(3px)'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.7, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.random() * 150 - 75, 0],
                  y: [0, Math.random() * 150 - 75, 0]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: duration,
                  delay: delay,
                  ease: "easeInOut"
                }}
              />
            );
          })}
          
          {/* 3D Rotating Cube */}
          <motion.div
            className="relative mb-12 preserve-3d"
            style={{ 
              x: logoX, 
              y: logoY,
              transformStyle: 'preserve-3d',
              transformPerspective: 1000
            }}
            variants={cubeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover="hover"
          >
            <div className="w-40 h-40 relative preserve-3d">
              {/* Front face */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl"
                style={{ 
                  transform: 'translateZ(20px)',
                  transformStyle: 'preserve-3d'
                }}
                animate={{ 
                  rotateY: [0, 360],
                  transition: { 
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear"
                  }
                }}
              >
                <span className="text-6xl font-bold text-white drop-shadow-lg">W</span>
              </motion.div>
              
              {/* Back face */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-xl"
                style={{ 
                  transform: 'rotateY(180deg) translateZ(20px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <span className="text-6xl font-bold text-white drop-shadow-lg">W</span>
              </motion.div>
              
              {/* Left face */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 rounded-2xl"
                style={{ 
                  transform: 'rotateY(-90deg) translateZ(20px)',
                  width: '40px',
                  height: '100%',
                  left: '0px',
                  transformStyle: 'preserve-3d'
                }}
              />
              
              {/* Right face */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/80 to-primary/80 rounded-2xl"
                style={{ 
                  transform: 'rotateY(90deg) translateZ(20px)',
                  width: '40px',
                  height: '100%',
                  right: '0px',
                  transformStyle: 'preserve-3d'
                }}
              />
              
              {/* Top face */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90 rounded-2xl"
                style={{ 
                  transform: 'rotateX(90deg) translateZ(20px)',
                  width: '100%',
                  height: '40px',
                  top: '0px',
                  transformStyle: 'preserve-3d'
                }}
              />
              
              {/* Bottom face */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/90 to-primary/90 rounded-2xl"
                style={{ 
                  transform: 'rotateX(-90deg) translateZ(20px)',
                  width: '100%',
                  height: '40px',
                  bottom: '0px',
                  transformStyle: 'preserve-3d'
                }}
              />
            </div>
            
            {/* Animated rings */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary/30 dark:border-primary/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.3, 0.8],
                opacity: [0, 0.5, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-accent/30 dark:border-accent/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.5, 0.8],
                opacity: [0, 0.3, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 4,
                delay: 0.5,
                ease: "easeInOut"
              }}
            />
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-primary/20 dark:bg-primary/30 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          {/* Text */}
          <motion.div
            className="text-center relative z-10"
            style={{ x: textX, y: textY }}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="overflow-hidden mb-2">
              <motion.h1 
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient"
              >
                {blogText.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
            
            <div className="overflow-hidden">
              <motion.p 
                className="text-gray-600 dark:text-gray-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    delay: 1.2,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }
                }}
              >
                {taglineText}
              </motion.p>
            </div>
          </motion.div>
          
          {/* Progress bar */}
          <motion.div
            className="absolute bottom-20 w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.8, duration: 0.5 }
            }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              variants={progressVariants}
              initial="hidden"
              animate="visible"
            />
          </motion.div>
          
          {/* Loading percentage */}
          <motion.div
            className="absolute bottom-12 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.8, duration: 0.5 }
            }}
            exit={{ opacity: 0 }}
          >
            {Math.round(loadingProgress)}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}