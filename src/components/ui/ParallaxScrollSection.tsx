'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxScrollSectionProps {
  children: ReactNode;
  className?: string;
  bgImage?: string;
  bgColor?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  overflow?: boolean;
  height?: string;
}

export default function ParallaxScrollSection({
  children,
  className = '',
  bgImage,
  bgColor = 'bg-transparent',
  speed = 0.5,
  direction = 'up',
  overflow = false,
  height = 'auto'
}: ParallaxScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Get scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Calculate parallax values based on direction
  let x = useTransform(scrollYProgress, [0, 1], [0, 0]);
  let y = useTransform(scrollYProgress, [0, 1], [0, 0]);
  
  const distance = 200 * speed;
  
  switch (direction) {
    case 'up':
      y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
      break;
    case 'down':
      y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
      break;
    case 'left':
      x = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
      break;
    case 'right':
      x = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
      break;
  }
  
  // Add spring physics for smoother animation
  const springConfig = { damping: 15, stiffness: 100 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);
  
  return (
    <div 
      ref={sectionRef}
      className={`relative ${overflow ? 'overflow-hidden' : ''} ${className}`}
      style={{ height }}
    >
      {/* Background with parallax effect */}
      {(bgImage || bgColor !== 'bg-transparent') && (
        <motion.div 
          className={`absolute inset-0 ${bgColor}`}
          style={{
            backgroundImage: bgImage ? `url(${bgImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            x: smoothX,
            y: smoothY
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}