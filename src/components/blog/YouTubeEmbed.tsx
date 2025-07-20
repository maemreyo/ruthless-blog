'use client';

import { useState } from 'react';
import { Play } from '@/components/icons/PhosphorIcons';
import { cn } from '@/lib/utils';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  showPreview?: boolean;
}

export default function YouTubeEmbed({
  videoId,
  title = 'YouTube video player',
  className,
  width = 560,
  height = 315,
  autoplay = false,
  muted = false,
  controls = true,
  showPreview = true
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(!showPreview);

  const aspectRatio = (height / width) * 100;
  
  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (muted) params.set('mute', '1');
  if (!controls) params.set('controls', '0');
  
  const paramString = params.toString();
  const embedSrc = `https://www.youtube.com/embed/${videoId}${paramString ? `?${paramString}` : ''}`;
  const thumbnailSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isLoaded && showPreview) {
    return (
      <div 
        className={cn(
          'relative cursor-pointer group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
          className
        )}
        style={{ paddingBottom: `${aspectRatio}%` }}
        onClick={() => setIsLoaded(true)}
      >
        {/* Thumbnail */}
        <img
          src={thumbnailSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="flex items-center justify-center w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transform transition-all duration-200 group-hover:scale-110">
            <Play className="w-6 h-6 text-white ml-1" weight="fill" />
          </div>
        </div>
        
        {/* YouTube Logo */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/80 px-2 py-1 rounded text-white text-xs font-medium">
            YouTube
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800',
        className
      )}
      style={{ paddingBottom: `${aspectRatio}%` }}
    >
      <iframe
        src={embedSrc}
        title={title}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}