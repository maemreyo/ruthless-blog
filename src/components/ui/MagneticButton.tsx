'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  as?: 'button' | 'div' | 'a';
  href?: string;
  onClick?: () => void;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
}

export default function MagneticButton({
  children,
  className = '',
  strength = 30,
  radius = 300,
  as = 'button',
  href,
  onClick,
  springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for x and y position
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for smooth animation
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Calculate distance using Pythagorean theorem
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Only apply magnetic effect if mouse is within radius
    if (distance < radius) {
      // Calculate magnetic pull (stronger when closer to center)
      const pull = 1 - Math.min(distance / radius, 1);
      
      // Apply magnetic effect
      x.set(distanceX * pull * (strength / 10));
      y.set(distanceY * pull * (strength / 10));
    } else {
      // Reset position if mouse is outside radius
      x.set(0);
      y.set(0);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  // Determine which element to render based on 'as' prop
  const Component = motion[as as keyof typeof motion] as React.ElementType;
  
  return (
    <div 
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="inline-block"
    >
      <Component
        href={href}
        onClick={onClick}
        style={{
          x: springX,
          y: springY,
          scale: isHovered ? 1.1 : 1
        }}
        className={className}
        whileTap={{ scale: 0.95 }}
        transition={{ scale: { type: 'spring', damping: 15, stiffness: 300 } }}
      >
        {children}
      </Component>
    </div>
  );
}