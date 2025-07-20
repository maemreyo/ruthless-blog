// Video utilities for blog integration
// Handles video metadata, embed code generation, and video management

import { YouTubeVideoData } from './youtube';

/**
 * Extract YouTube video ID from various URL formats
 * @param url - YouTube URL
 * @returns Video ID or null if not found
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generate responsive YouTube embed code
 * @param videoId - YouTube video ID
 * @param options - Embed options
 * @returns HTML embed code
 */
export function generateResponsiveEmbed(
  videoId: string,
  options: {
    aspectRatio?: '16:9' | '4:3' | '1:1';
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    showPreview?: boolean;
  } = {}
): string {
  const {
    aspectRatio = '16:9',
    autoplay = false,
    muted = false,
    controls = true,
    showPreview = true
  } = options;

  const aspectRatios = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%'
  };

  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (muted) params.set('mute', '1');
  if (!controls) params.set('controls', '0');
  
  const paramString = params.toString();
  const src = `https://www.youtube.com/embed/${videoId}${paramString ? `?${paramString}` : ''}`;

  return `
<div style="position: relative; padding-bottom: ${aspectRatios[aspectRatio]}; height: 0; overflow: hidden; max-width: 100%; background: #000;">
  <iframe 
    src="${src}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>
</div>`;
}

/**
 * Generate Markdown embed code for videos
 * @param videoData - YouTube video metadata
 * @returns Markdown code
 */
export function generateMarkdownEmbed(videoData: YouTubeVideoData): string {
  return `[![${videoData.title}](${videoData.thumbnailUrl})](https://www.youtube.com/watch?v=${videoData.id})`;
}

/**
 * Generate Tiptap video node for rich text editor
 * @param videoData - YouTube video metadata
 * @returns Tiptap video node object
 */
export function generateTiptapVideoNode(videoData: YouTubeVideoData) {
  return {
    type: 'youtube',
    attrs: {
      videoId: videoData.id,
      title: videoData.title,
      thumbnailUrl: videoData.thumbnailUrl,
      width: 560,
      height: 315,
      autoplay: false,
      muted: false,
      controls: true
    }
  };
}

/**
 * Parse video mentions in markdown content
 * @param content - Markdown content
 * @returns Array of video IDs found in content
 */
export function parseVideoMentions(content: string): string[] {
  const videoIds: string[] = [];
  
  // Match YouTube URLs in markdown
  const urlPattern = /\[.*?\]\((https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})).*?\)/g;
  let match;
  
  while ((match = urlPattern.exec(content)) !== null) {
    const videoId = extractYouTubeVideoId(match[1]);
    if (videoId && !videoIds.includes(videoId)) {
      videoIds.push(videoId);
    }
  }
  
  // Match direct video ID references (custom syntax)
  const directPattern = /\[video:([a-zA-Z0-9_-]{11})\]/g;
  
  while ((match = directPattern.exec(content)) !== null) {
    if (!videoIds.includes(match[1])) {
      videoIds.push(match[1]);
    }
  }
  
  return videoIds;
}

/**
 * Convert video shortcode to embed
 * @param content - Content with video shortcodes
 * @param videoData - Available video metadata
 * @returns Content with shortcodes replaced
 */
export function processVideoShortcodes(
  content: string,
  videoData: YouTubeVideoData[]
): string {
  let processedContent = content;
  
  // Create a map for quick video lookup
  const videoMap = new Map(videoData.map(video => [video.id, video]));
  
  // Replace [video:ID] shortcodes
  processedContent = processedContent.replace(
    /\[video:([a-zA-Z0-9_-]{11})\]/g,
    (match, videoId) => {
      const video = videoMap.get(videoId);
      if (video) {
        return generateResponsiveEmbed(videoId);
      }
      return match; // Keep original if video not found
    }
  );
  
  // Replace [video:ID responsive] shortcodes
  processedContent = processedContent.replace(
    /\[video:([a-zA-Z0-9_-]{11})\s+responsive\]/g,
    (match, videoId) => {
      const video = videoMap.get(videoId);
      if (video) {
        return generateResponsiveEmbed(videoId, { aspectRatio: '16:9' });
      }
      return match;
    }
  );
  
  return processedContent;
}

/**
 * Validate video file format
 * @param filename - Video filename
 * @returns Whether the file format is supported
 */
export function isValidVideoFormat(filename: string): boolean {
  const supportedFormats = [
    '.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.3gp'
  ];
  
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return supportedFormats.includes(extension);
}

/**
 * Generate video thumbnail URL
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality
 * @returns Thumbnail URL
 */
export function getVideoThumbnail(
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'maxres'
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality === 'maxres' ? 'maxresdefault' : quality}.jpg`;
}

/**
 * Format video duration from ISO 8601 to readable format
 * @param duration - ISO 8601 duration (e.g., "PT4M13S")
 * @returns Formatted duration (e.g., "4:13")
 */
export function formatVideoDuration(duration?: string): string {
  if (!duration) return '';
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}