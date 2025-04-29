'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorFollowerProps {
  color?: string;
  size?: number;
  mixBlendMode?: string;
  trailEffect?: boolean;
  trailCount?: number;
  disabled?: boolean;
}

export default function CursorFollower({
  color = 'rgba(var(--color-primary), 0.3)',
  size = 40,
  mixBlendMode = 'normal',
  trailEffect = false,
  trailCount = 5,
  disabled = false
}: CursorFollowerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [trailPositions, setTrailPositions] = useState<{ x: number; y: number }[]>([]);
  
  // Motion values for cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    if (disabled) return;
    
    const updateCursorPosition = (e: MouseEvent) => {
      cursorX.set(e.clientX - size / 2);
      cursorY.set(e.clientY - size / 2);
      
      if (trailEffect) {
        // Add current position to trail
        setTrailPositions(prev => {
          const newPositions = [{ x: e.clientX - size / 2, y: e.clientY - size / 2 }, ...prev];
          // Limit trail length
          return newPositions.slice(0, trailCount);
        });
      }
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
      cursorX.set(-100);
      cursorY.set(-100);
    };
    
    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, size, trailEffect, trailCount, disabled]);
  
  if (disabled) return null;
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50"
        style={{
          x: smoothX,
          y: smoothY,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          mixBlendMode: mixBlendMode as any,
          opacity: isVisible ? 0.6 : 0
        }}
        transition={{ opacity: { duration: 0.2 } }}
      />
      
      {/* Trail effect */}
      {trailEffect && trailPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 pointer-events-none z-50"
          style={{
            x: pos.x,
            y: pos.y,
            width: size - (index * (size / trailCount)),
            height: size - (index * (size / trailCount)),
            borderRadius: '50%',
            backgroundColor: color,
            mixBlendMode: mixBlendMode as any,
            opacity: isVisible ? (1 - index / trailCount) * 0.3 : 0
          }}
          transition={{ opacity: { duration: 0.2 } }}
        />
      ))}
    </>
  );
}