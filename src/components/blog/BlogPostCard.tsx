'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Calendar, User, ArrowRight } from '@/components/icons/PhosphorIcons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author?: string;
  coverImage?: string;
}

export default function BlogPostCard({
  title,
  excerpt,
  date,
  slug,
  author,
  coverImage
}: BlogPostCardProps) {
  const t = useTranslations('Blog');
  const locale = useLocale();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden shadow-elegant hover:shadow-float-lg transition-all duration-300 group">
      {coverImage && (
        <div className="h-56 overflow-hidden relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            {coverImage.startsWith('/') ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={false}
              />
            ) : (
              <Image
                src={coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={false}
              />
            )}
          </motion.div>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-0">
        <div className="flex flex-wrap gap-4 mb-4 text-gray-600 dark:text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <Calendar weight="fill" className="w-4 h-4 text-primary" />
            <span>{formatDate(date, locale)}</span>
          </div>
          
          {author && (
            <div className="flex items-center gap-1">
              <User weight="fill" className="w-4 h-4 text-primary" />
              <span>{author}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-1">{excerpt}</p>
        
        <Button 
          asChild 
          variant="ghost" 
          className="w-fit p-0 h-auto text-primary hover:text-primary-dark font-medium justify-start group"
        >
          <Link href={`/blog/${slug}`} className="inline-flex items-center gap-2">
            {t('readMore')}
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="inline-block"
            >
              <ArrowRight weight="bold" className="w-4 h-4" />
            </motion.span>
          </Link>
        </Button>
      </CardContent>
      </Card>
    </motion.div>
  );
}