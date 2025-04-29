'use client';

import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from '@/components/icons/PhosphorIcons';
import ParallaxTiltCard from '@/components/ui/ParallaxTiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Post {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author: string;
  coverImage: string;
}

interface ImmersiveBlogGridProps {
  posts: Post[];
  readMoreText: string;
}

export default function ImmersiveBlogGrid({ posts, readMoreText }: ImmersiveBlogGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {posts.map((post, index) => (
        <ScrollReveal
          key={post.slug}
          animation="fade-up"
          delay={index * 0.1}
          once={false}
          threshold={0.1}
        >
          <ParallaxTiltCard
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-full"
            glareEnabled={true}
            glareMaxOpacity={0.1}
            scale={1.03}
          >
            {/* Image container */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.coverImage || '/images/placeholder.jpg'}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Post meta on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex flex-wrap gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar weight="fill" className="w-4 h-4" />
                    <span className="text-sm">{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User weight="fill" className="w-4 h-4" />
                    <span className="text-sm">{post.author}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="relative z-20">
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors group/link relative"
                >
                  <span>{readMoreText}</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="inline-block"
                  >
                    <ArrowRight weight="bold" className="w-4 h-4" />
                  </motion.span>
                  
                  {/* Animated underline */}
                  <motion.span 
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </div>
            </div>
            
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
              <div className="absolute transform rotate-45 bg-gradient-to-r from-primary to-accent w-16 h-4 -top-2 right-[-6px] opacity-80"></div>
            </div>
          </ParallaxTiltCard>
        </ScrollReveal>
      ))}
    </motion.div>
  );
}