'use client';

import React, { useRef, ReactNode } from 'react';
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
  
  const distance = 200 * speed;

  // Define all possible useTransform outputs unconditionally
  const yUpMotionValue = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const yDownMotionValue = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const xLeftMotionValue = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const xRightMotionValue = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const zeroMotionValue = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // Conditionally select the appropriate MotionValue
  const selectedX = React.useMemo(() => {
    if (direction === 'left') return xLeftMotionValue;
    if (direction === 'right') return xRightMotionValue;
    return zeroMotionValue;
  }, [direction, xLeftMotionValue, xRightMotionValue, zeroMotionValue]);

  const selectedY = React.useMemo(() => {
    if (direction === 'up') return yUpMotionValue;
    if (direction === 'down') return yDownMotionValue;
    return zeroMotionValue;
  }, [direction, yUpMotionValue, yDownMotionValue, zeroMotionValue]);
  
  // Add spring physics for smoother animation
  const springConfig = { damping: 15, stiffness: 100 };
  const smoothX = useSpring(selectedX, springConfig);
  const smoothY = useSpring(selectedY, springConfig);
  
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