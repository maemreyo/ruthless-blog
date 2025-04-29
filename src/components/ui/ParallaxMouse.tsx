'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface ParallaxMouseProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  lerpFactor?: number;
  perspective?: number;
  disabled?: boolean;
}

export default function ParallaxMouse({
  children,
  className = '',
  strength = 20,
  lerpFactor = 0.1,
  perspective = 1000,
  disabled = false
}: ParallaxMouseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Motion values for smooth animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useTransform(
    useSpring(y, springConfig),
    [-(containerSize.height / 2), containerSize.height / 2],
    [strength, -strength]
  );
  const rotateY = useTransform(
    useSpring(x, springConfig),
    [-(containerSize.width / 2), containerSize.width / 2],
    [-strength, strength]
  );
  
  useEffect(() => {
    if (disabled || !containerRef.current) return;
    
    const updateContainerSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };
    
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [disabled]);
  
  useEffect(() => {
    if (!isHovering || disabled) return;
    
    // Calculate the center of the container
    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;
    
    // Calculate the distance from the mouse to the center
    const distanceX = mousePosition.x - centerX;
    const distanceY = mousePosition.y - centerY;
    
    // Apply lerp (linear interpolation) for smoother movement
    x.set(distanceX * lerpFactor);
    y.set(distanceY * lerpFactor);
    
    // Clean up
    return () => {
      x.set(0);
      y.set(0);
    };
  }, [mousePosition, isHovering, containerSize, lerpFactor, x, y, disabled]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovering(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovering(false);
      // Reset position when mouse leaves
      x.set(0);
      y.set(0);
    }
  };
  
  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: perspective,
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        style={{
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          transformStyle: 'preserve-3d'
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 150
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}