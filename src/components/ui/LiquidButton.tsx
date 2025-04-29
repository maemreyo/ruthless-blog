'use client';

import { useState, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

interface LiquidButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  color?: string;
  textColor?: string;
  hoverColor?: string;
  liquidColor?: string;
  external?: boolean;
}

export default function LiquidButton({
  children,
  href,
  className = '',
  onClick,
  color = 'bg-primary',
  textColor = 'text-white',
  hoverColor = 'hover:bg-primary-dark',
  liquidColor = 'rgba(var(--color-primary), 0.7)',
  external = false
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Liquid blob animation variants
  const blobVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      borderRadius: '100%',
    },
    hover: {
      scale: 1.5,
      opacity: 1,
      borderRadius: ['100%', '40%', '30%', '20%'],
      transition: {
        duration: 0.6,
        borderRadius: {
          duration: 0.6,
          repeat: Infinity,
          repeatType: 'reverse' as const,
        }
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };
  
  // Text animation variants
  const textVariants = {
    initial: { y: 0 },
    hover: { 
      y: -3,
      transition: { 
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // Render different button types based on props
  const renderButton = () => {
    const buttonContent = (
      <div 
        ref={buttonRef}
        className={`relative overflow-hidden px-6 py-3 rounded-full ${color} ${textColor} ${hoverColor} transition-colors duration-300 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Liquid blob effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial="initial"
          animate={isHovered ? "hover" : "exit"}
          variants={blobVariants}
          style={{
            background: liquidColor,
            originX: 0.5,
            originY: 0.5,
          }}
        />
        
        {/* Text with animation */}
        <motion.div 
          className="relative z-10 flex items-center justify-center gap-2"
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          variants={textVariants}
        >
          {children}
        </motion.div>
      </div>
    );
    
    if (href) {
      if (external) {
        return (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClick}
          >
            {buttonContent}
          </a>
        );
      }
      
      return (
        <Link href={href} onClick={onClick}>
          {buttonContent}
        </Link>
      );
    }
    
    return (
      <button type="button" onClick={onClick}>
        {buttonContent}
      </button>
    );
  };
  
  return renderButton();
}