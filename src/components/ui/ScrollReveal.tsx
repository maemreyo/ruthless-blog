'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

type AnimationType = 
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-down'
  | 'flip-left'
  | 'flip-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'rotate';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  distance?: number;
  damping?: number;
  stiffness?: number;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  once = true,
  className = '',
  distance = 50,
  damping = 25,
  stiffness = 300
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  
  // Define animation variants
  const getVariants = (): Variants => {
    const baseTransition = {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // Custom ease curve
      type: 'spring',
      damping,
      stiffness
    };
    
    switch (animation) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -distance },
          visible: { opacity: 1, y: 0, transition: baseTransition }
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: -distance },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0, transition: baseTransition }
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: baseTransition }
        };
      case 'zoom-out':
        return {
          hidden: { opacity: 0, scale: 1.2 },
          visible: { opacity: 1, scale: 1, transition: baseTransition }
        };
      case 'flip-up':
        return {
          hidden: { opacity: 0, rotateX: 90, y: distance },
          visible: { opacity: 1, rotateX: 0, y: 0, transition: baseTransition }
        };
      case 'flip-down':
        return {
          hidden: { opacity: 0, rotateX: -90, y: -distance },
          visible: { opacity: 1, rotateX: 0, y: 0, transition: baseTransition }
        };
      case 'flip-left':
        return {
          hidden: { opacity: 0, rotateY: -90, x: -distance },
          visible: { opacity: 1, rotateY: 0, x: 0, transition: baseTransition }
        };
      case 'flip-right':
        return {
          hidden: { opacity: 0, rotateY: 90, x: distance },
          visible: { opacity: 1, rotateY: 0, x: 0, transition: baseTransition }
        };
      case 'slide-up':
        return {
          hidden: { y: distance },
          visible: { y: 0, transition: baseTransition }
        };
      case 'slide-down':
        return {
          hidden: { y: -distance },
          visible: { y: 0, transition: baseTransition }
        };
      case 'slide-left':
        return {
          hidden: { x: -distance },
          visible: { x: 0, transition: baseTransition }
        };
      case 'slide-right':
        return {
          hidden: { x: distance },
          visible: { x: 0, transition: baseTransition }
        };
      case 'rotate':
        return {
          hidden: { opacity: 0, rotate: -15 },
          visible: { opacity: 1, rotate: 0, transition: baseTransition }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition }
        };
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}