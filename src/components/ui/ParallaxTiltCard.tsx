'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ParallaxTiltCardProps {
  children: ReactNode;
  className?: string;
  bgClassName?: string;
  depth?: number;
  perspective?: number;
  glareEnabled?: boolean;
  glareMaxOpacity?: number;
  glareColor?: string;
  glarePosition?: string;
  scale?: number;
}

export default function ParallaxTiltCard({
  children,
  className = '',
  bgClassName = '',
  depth = 30,
  perspective = 1000,
  glareEnabled = true,
  glareMaxOpacity = 0.5,
  glareColor = 'rgba(255, 255, 255, 0.8)',
  glarePosition = '50%',
  scale = 1.05
}: ParallaxTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Motion values for smooth animations
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareOpacity = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  
  // Add spring physics for smoother animation
  const springConfig = { damping: 20, stiffness: 300 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  const smoothGlareOpacity = useSpring(glareOpacity, springConfig);
  const smoothGlareX = useSpring(glareX, springConfig);
  const smoothGlareY = useSpring(glareY, springConfig);
  
  // Transform values for parallax children
  const moveX = useTransform(smoothRotateY, [-20, 20], [-depth, depth]);
  const moveY = useTransform(smoothRotateX, [-20, 20], [depth, -depth]);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    const updateCardSize = () => {
      if (cardRef.current) {
        const { width, height } = cardRef.current.getBoundingClientRect();
        setCardSize({ width, height });
      }
    };
    
    updateCardSize();
    window.addEventListener('resize', updateCardSize);
    
    return () => {
      window.removeEventListener('resize', updateCardSize);
    };
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovering) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position
    const rotateXVal = (mouseY / (rect.height / 2)) * -10;
    const rotateYVal = (mouseX / (rect.width / 2)) * 10;
    
    rotateX.set(rotateXVal);
    rotateY.set(rotateYVal);
    
    // Update mouse position for parallax effect
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
    
    // Update glare position and opacity
    if (glareEnabled) {
      glareOpacity.set(glareMaxOpacity);
      glareX.set(mousePosition.x * 100);
      glareY.set(mousePosition.y * 100);
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: perspective,
        transformPerspective: perspective,
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        scale: isHovering ? scale : 1,
        transition: 'scale 0.3s ease'
      }}
      whileHover={{ z: 10 }}
    >
      {/* Background with parallax effect */}
      <motion.div 
        className={`absolute inset-0 ${bgClassName}`}
        style={{
          x: moveX,
          y: moveY,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Glare effect */}
      {glareEnabled && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            opacity: smoothGlareOpacity,
            background: `radial-gradient(circle at ${smoothGlareX}% ${smoothGlareY}%, ${glareColor} 0%, transparent 80%)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {/* Content */}
      <motion.div 
        className="relative z-10"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(20px)'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}