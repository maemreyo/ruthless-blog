'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
}

interface AnimatedBackgroundProps {
  type?: 'particles' | 'gradient' | 'waves' | 'grid';
  particleCount?: number;
  particleColor?: string;
  backgroundColor?: string;
  interactive?: boolean;
  className?: string;
}

export default function AnimatedBackground({
  type = 'particles',
  particleCount = 50,
  particleColor = 'rgba(var(--color-primary), 0.3)',
  backgroundColor = 'transparent',
  interactive = true,
  className = ''
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Generate random particles
  useEffect(() => {
    if (type !== 'particles' || !containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });
    
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 4 + 1,
        color: particleColor,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    setParticles(newParticles);
    
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [type, particleCount, particleColor, dimensions.width, dimensions.height]);
  
  // Handle mouse movement for interactive mode
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);
  
  // Render different background types
  const renderBackground = () => {
    switch (type) {
      case 'particles':
        return (
          <>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                initial={{
                  x: particle.x,
                  y: particle.y,
                  opacity: particle.opacity,
                  scale: 1
                }}
                animate={{
                  x: [
                    particle.x,
                    particle.x + (Math.random() * 100 - 50),
                    particle.x
                  ],
                  y: [
                    particle.y,
                    particle.y + (Math.random() * 100 - 50),
                    particle.y
                  ],
                  opacity: [
                    particle.opacity,
                    particle.opacity + 0.2,
                    particle.opacity
                  ]
                }}
                transition={{
                  duration: 10 / particle.speed,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  filter: `blur(${particle.size / 3}px)`
                }}
                whileHover={{ scale: 3, opacity: 0.8 }}
              />
            ))}
            
            {/* Interactive glow effect */}
            {interactive && (
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${particleColor} 0%, transparent 70%)`,
                  opacity: 0.3,
                  x: mousePosition.x - 100,
                  y: mousePosition.y - 100,
                  filter: 'blur(20px)'
                }}
              />
            )}
          </>
        );
        
      case 'gradient':
        return (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(var(--color-primary), 0.2) 0%, rgba(var(--color-accent), 0.2) 100%)',
                'linear-gradient(225deg, rgba(var(--color-primary), 0.2) 0%, rgba(var(--color-accent), 0.2) 100%)',
                'linear-gradient(45deg, rgba(var(--color-primary), 0.2) 0%, rgba(var(--color-accent), 0.2) 100%)'
              ]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
        
      case 'waves':
        return (
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1440 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill={particleColor}
              animate={{
                d: [
                  "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,181.3C672,181,768,235,864,250.7C960,267,1056,245,1152,229.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ opacity: 0.2 }}
            />
            <motion.path
              d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,117.3C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill={particleColor}
              animate={{
                d: [
                  "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,117.3C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,213.3C672,203,768,149,864,138.7C960,128,1056,160,1152,186.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,170.7C960,149,1056,107,1152,117.3C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              style={{ opacity: 0.3 }}
            />
          </svg>
        );
        
      case 'grid':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
            
            {/* Animated grid highlights */}
            <motion.div
              className="absolute"
              animate={{
                left: ['-10%', '110%'],
                top: ['110%', '-10%'],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 3
              }}
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, transparent 0%, rgba(var(--color-primary), 0.1) 50%, transparent 100%)',
                filter: 'blur(30px)'
              }}
            />
            
            <motion.div
              className="absolute"
              animate={{
                right: ['-10%', '110%'],
                bottom: ['110%', '-10%'],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 3,
                delay: 3.5
              }}
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, transparent 0%, rgba(var(--color-accent), 0.1) 50%, transparent 100%)',
                filter: 'blur(30px)'
              }}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      {renderBackground()}
    </div>
  );
}