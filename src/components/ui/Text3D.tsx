'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Text3DProps {
  text: string;
  className?: string;
  depth?: number;
  color?: string;
  shadowColor?: string;
  interactive?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export default function Text3D({
  text,
  className = '',
  depth = 10,
  color = 'text-primary',
  shadowColor = 'rgba(var(--color-primary), 0.2)',
  interactive = true,
  as = 'div'
}: Text3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for smooth animations
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Add spring physics for smoother animation
  const springConfig = { damping: 20, stiffness: 300 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  
  // Generate shadow layers
  const shadowLayers = Array.from({ length: depth }, (_, i) => i + 1);
  
  useEffect(() => {
    if (!interactive) return;
    
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
  }, [interactive]);
  
  useEffect(() => {
    if (!interactive || !containerRef.current) return;
    
    // Calculate rotation based on mouse position relative to window center
    const rotateXVal = isHovered 
      ? ((mousePosition.y - windowSize.height / 2) / windowSize.height) * 20
      : ((mousePosition.y - windowSize.height / 2) / windowSize.height) * 5;
      
    const rotateYVal = isHovered
      ? -((mousePosition.x - windowSize.width / 2) / windowSize.width) * 20
      : -((mousePosition.x - windowSize.width / 2) / windowSize.width) * 5;
    
    rotateX.set(rotateXVal);
    rotateY.set(rotateYVal);
  }, [mousePosition, windowSize, isHovered, interactive, rotateX, rotateY]);
  
  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
    }
  };
  
  // Determine which element to render based on 'as' prop
  const Component = motion[as as keyof typeof motion] as React.ElementType;
  
  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        className={`relative z-10 ${color} ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: interactive ? 'translateZ(20px)' : undefined,
          rotateX: interactive ? smoothRotateX : 0,
          rotateY: interactive ? smoothRotateY : 0
        }}
      >
        {text}
      </Component>
      
      {/* Shadow layers */}
      {shadowLayers.map((layer) => (
        <div 
          key={layer}
          className={`absolute top-0 left-0 ${color} opacity-0`}
          style={{
            transform: `translateZ(${-layer}px)`,
            textShadow: `0 0 ${layer}px ${shadowColor}`,
            filter: `blur(${layer / 3}px)`,
            opacity: (depth - layer + 1) / depth * 0.3
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}