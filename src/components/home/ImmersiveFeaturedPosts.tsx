'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Calendar, User } from '@/components/icons/PhosphorIcons';
import ParallaxTiltCard from '@/components/ui/ParallaxTiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Text3D from '@/components/ui/Text3D';
import ParallaxScrollSection from '@/components/ui/ParallaxScrollSection';

interface Post {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author: string;
  coverImage: string;
}

interface ImmersiveFeaturedPostsProps {
  title: string;
  viewAllText: string;
  posts: Post[];
}

export default function ImmersiveFeaturedPosts({ 
  title, 
  viewAllText, 
  posts 
}: ImmersiveFeaturedPostsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  }, [posts.length]);
  
  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  }, [posts.length]);
  
  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, nextSlide]);
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -10 : 10,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 10 : -10,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };
  
  return (
    <ParallaxScrollSection 
      direction="up" 
      speed={0.3} 
      className="py-20 relative overflow-hidden"
      bgColor="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10"
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-[20%] right-[10%] w-40 h-40 rounded-full bg-primary/10 blur-xl -z-10"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-[10%] left-[15%] w-60 h-60 rounded-full bg-accent/10 blur-xl -z-10"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -15, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div 
        ref={containerRef}
        className="container mx-auto px-4"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <ScrollReveal animation="fade-up" className="mb-6 md:mb-0">
            <Text3D 
              text={title}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
              depth={8}
            />
          </ScrollReveal>
          
          <ScrollReveal animation="fade-left" delay={0.3}>
            <Link 
              href="/blog" 
              className="group inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors relative overflow-hidden px-4 py-2"
            >
              <span className="relative z-10">{viewAllText}</span>
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="relative z-10"
              >
                <ArrowRight weight="bold" className="w-5 h-5" />
              </motion.span>
              
              {/* Hover effect */}
              <motion.span 
                className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </ScrollReveal>
        </div>
        
        {/* Carousel */}
        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <ParallaxTiltCard 
                  className="h-[400px] rounded-2xl overflow-hidden shadow-2xl"
                  glareEnabled={true}
                  glareMaxOpacity={0.2}
                  perspective={1200}
                >
                  {/* Image container with perspective */}
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 dark:border-gray-700/30">
                    <Image
                      src={posts[currentIndex].coverImage || '/images/placeholder.jpg'}
                      alt={posts[currentIndex].title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                      priority
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Post meta on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex flex-wrap gap-4 mb-4 text-white/80">
                        <div className="flex items-center gap-2">
                          <Calendar weight="fill" className="w-4 h-4" />
                          <span className="text-sm">{posts[currentIndex].date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User weight="fill" className="w-4 h-4" />
                          <span className="text-sm">{posts[currentIndex].author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ParallaxTiltCard>
                
                {/* Content */}
                <ScrollReveal animation="fade-left" threshold={0.5} once={false}>
                  <div className="p-6">
                    <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                      {posts[currentIndex].title}
                    </h3>
                    
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                      {posts[currentIndex].excerpt}
                    </p>
                    
                    <div className="relative z-20">
                      <Link 
                        href={`/blog/${posts[currentIndex].slug}`}
                        className="relative inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-primary/30 transition-all duration-300 group overflow-hidden"
                      >
                        <span className="relative z-10">Read Article</span>
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          className="relative z-10"
                        >
                          <ArrowRight weight="bold" className="w-5 h-5" />
                        </motion.span>
                        
                        {/* Animated background */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation buttons */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none px-4">
            <motion.button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft weight="bold" className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </motion.button>
            
            <motion.button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight weight="bold" className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </motion.button>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-8 gap-2">
            {posts.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </ParallaxScrollSection>
  );
}