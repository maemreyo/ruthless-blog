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
  mousePosition?: { x: number; y: number } | null;
}

export default function ParallaxMouse({
  children,
  className = '',
  strength = 20,
  lerpFactor = 0.1,
  perspective = 1000,
  disabled = false,
  mousePosition: externalMousePosition = null
}: ParallaxMouseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [internalMousePosition, setInternalMousePosition] = useState({ x: 0, y: 0 });
  
  const mousePosition = externalMousePosition || internalMousePosition;
  
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
    if (disabled) return;

    const isHoveringOrExternal = isHovering || externalMousePosition;

    if (isHoveringOrExternal) {
      const rect = containerRef.current?.getBoundingClientRect();
      const mouseX = externalMousePosition ? mousePosition.x - (rect?.left || 0) : mousePosition.x;
      const mouseY = externalMousePosition ? mousePosition.y - (rect?.top || 0) : mousePosition.y;

      const centerX = containerSize.width / 2;
      const centerY = containerSize.height / 2;
      
      const distanceX = mouseX - centerX;
      const distanceY = mouseY - centerY;
      
      x.set(distanceX * lerpFactor);
      y.set(distanceY * lerpFactor);
    } else {
      x.set(0);
      y.set(0);
    }

  }, [mousePosition, isHovering, externalMousePosition, containerSize, lerpFactor, x, y, disabled]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !containerRef.current || externalMousePosition) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setInternalMousePosition({
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