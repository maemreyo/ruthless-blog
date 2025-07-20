'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Calendar, User, ArrowLeft, Clock, Tag, Heart, Bookmark, Copy, Check, ArrowRight, BookOpen } from '@/components/icons/PhosphorIcons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TiptapRenderer from '@/components/blog/TiptapRenderer';
import ShareButtons from '@/components/blog/ShareButtons';
import CategoryBadge from '@/components/blog/CategoryBadge';
import SeriesBadge from '@/components/blog/SeriesBadge';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface RelatedPost {
  title: string;
  date: string;
  slug: string;
}

interface SeriesNavigationData {
  seriesName: string;
  currentPart: number;
  totalParts: number;
  previousPost?: {
    title: string;
    slug: string;
  } | null;
  nextPost?: {
    title: string;
    slug: string;
  } | null;
}

interface EnhancedBlogPostProps {
  title: string;
  content: string;
  formattedDate: string;
  author: string;
  readingTime: string;
  thumbnail?: string;
  category?: string;
  series?: string;
  seriesPart?: number;
  tags?: string[];
  relatedPosts: RelatedPost[];
  slug: string;
  tagsLabel: string;
  readMoreLabel: string;
  backToListLabel: string;
  relatedPostsLabel: string;
  seriesNavigation?: SeriesNavigationData;
}

export default function EnhancedBlogPost({
  title,
  content,
  formattedDate,
  author,
  readingTime,
  thumbnail,
  category,
  series,
  seriesPart,
  tags,
  relatedPosts,
  slug,
  tagsLabel,
  readMoreLabel,
  backToListLabel,
  relatedPostsLabel,
  seriesNavigation
}: EnhancedBlogPostProps) {
  const t = useTranslations('Series');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6 relative z-10">
          {/* Back button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog" className="gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <ArrowLeft className="w-4 h-4" />
                {backToListLabel}
              </Link>
            </Button>
          </div>

          {/* Compact Series Navigation */}
          {seriesNavigation && (
            <div className="mb-6">
              <Badge variant="secondary" className="mb-3">
                <BookOpen className="w-3 h-3 mr-1" />
                {seriesNavigation.seriesName} - Part {seriesNavigation.currentPart} of {seriesNavigation.totalParts}
              </Badge>
              <div className="flex gap-2">
                {seriesNavigation.previousPost && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${seriesNavigation.previousPost.slug}`} className="gap-1">
                      <ArrowLeft className="w-3 h-3" />
                      Previous
                    </Link>
                  </Button>
                )}
                {seriesNavigation.nextPost && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${seriesNavigation.nextPost.slug}`} className="gap-1">
                      Next
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/series/${encodeURIComponent(seriesNavigation.seriesName)}`}>
                    View Series
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Header image */}
          {thumbnail && (
            <div className="relative h-48 md:h-72 mb-6 rounded-lg overflow-hidden">
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Title and meta */}
          <div className="max-w-5xl mx-auto">
            <motion.h1 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {title}
            </motion.h1>

            {/* Meta information and badges */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{readingTime}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {category && <CategoryBadge category={category} size="sm" />}
              {series && !seriesNavigation && <SeriesBadge series={series} part={seriesPart} size="sm" />}
            </div>

            {/* Compact Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={isLiked ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="h-8 px-3"
              >
                <Heart weight={isLiked ? "fill" : "regular"} className="w-3 h-3 mr-1" />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              
              <Button
                variant={isBookmarked ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="h-8 px-3"
              >
                <Bookmark weight={isBookmarked ? "fill" : "regular"} className="w-3 h-3 mr-1" />
                Save
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-3"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 mr-1" />
                )}
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Article content */}
          <Card className="mb-6">
            <CardContent className="p-6 md:p-8">
              <TiptapRenderer 
                content={content} 
                className="prose prose-xl dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed" 
              />
            </CardContent>
          </Card>

          {/* Tags and Share - Combined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Tag className="w-4 h-4" />
                    {tagsLabel}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share buttons */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Share this article</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ShareButtons title={title} slug={slug} />
              </CardContent>
            </Card>
          </div>

          {/* Compact Author bio */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{author}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Content creator and web developer passionate about sharing knowledge and experiences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Series Navigation Bottom & Related posts */}
          <div className="space-y-6">
            {/* Full Series Navigation at bottom */}
            {seriesNavigation && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{seriesNavigation.seriesName} Series</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {seriesNavigation.previousPost && (
                      <Button variant="outline" size="sm" asChild className="flex-1 justify-start">
                        <Link href={`/blog/${seriesNavigation.previousPost.slug}`} className="gap-2">
                          <ArrowLeft className="w-4 h-4" />
                          <div className="text-left overflow-hidden">
                            <div className="text-xs text-muted-foreground">Previous</div>
                            <div className="truncate">{seriesNavigation.previousPost.title}</div>
                          </div>
                        </Link>
                      </Button>
                    )}
                    {seriesNavigation.nextPost && (
                      <Button variant="outline" size="sm" asChild className="flex-1 justify-end">
                        <Link href={`/blog/${seriesNavigation.nextPost.slug}`} className="gap-2">
                          <div className="text-right overflow-hidden">
                            <div className="text-xs text-muted-foreground">Next</div>
                            <div className="truncate">{seriesNavigation.nextPost.title}</div>
                          </div>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{relatedPostsLabel}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 text-sm">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{post.date}</p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}