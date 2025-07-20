// YouTube API v3 Integration Library (ES Module version)
// Handles video upload, metadata management, and API interactions

import { google } from 'googleapis';
import { promises as fs, createReadStream } from 'fs';
import path from 'path';

const youtube = google.youtube('v3');

/**
 * Get YouTube API configuration from environment variables
 */
function getYouTubeConfig() {
  const requiredEnvVars = {
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    redirectUri: process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:8080/oauth2callback',
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN
  };

  // Validate all required environment variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(`Missing required YouTube API environment variable: ${key.toUpperCase()}`);
    }
  }

  return requiredEnvVars;
}

/**
 * Create authenticated YouTube client
 */
export async function createYouTubeClient() {
  const config = getYouTubeConfig();
  
  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );

  // Set credentials with refresh token
  oauth2Client.setCredentials({
    refresh_token: config.refreshToken
  });

  // Set auth for YouTube API
  google.options({ auth: oauth2Client });
  
  return { oauth2Client, youtube };
}

/**
 * Upload video to YouTube
 * @param {string} videoPath - Path to the video file
 * @param {Object} config - Video metadata and configuration
 * @returns {Promise<Object>} Promise with video ID and metadata
 */
export async function uploadVideoToYouTube(videoPath, config) {
  try {
    const { youtube } = await createYouTubeClient();
    
    // Validate video file exists
    await fs.access(videoPath);
    
    const videoMetadata = {
      snippet: {
        title: config.title,
        description: config.description,
        tags: config.tags || [],
        categoryId: config.categoryId || '22', // Default to 'People & Blogs'
        defaultLanguage: 'en',
        defaultAudioLanguage: 'en'
      },
      status: {
        privacyStatus: config.privacy,
        embeddable: true,
        license: 'youtube',
        publicStatsViewable: true
      }
    };

    console.log(`Starting upload for video: ${config.title}`);
    console.log(`Video path: ${videoPath}`);
    console.log(`Privacy: ${config.privacy}`);

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: videoMetadata,
      media: {
        body: createReadStream(videoPath)
      }
    });

    const videoId = response.data.id;
    if (!videoId) {
      throw new Error('Failed to get video ID from YouTube response');
    }

    console.log(`✅ Video uploaded successfully!`);
    console.log(`📺 Video ID: ${videoId}`);
    console.log(`🔗 Video URL: https://www.youtube.com/watch?v=${videoId}`);
    console.log(`🎬 Embed URL: https://www.youtube.com/embed/${videoId}`);

    // Return structured video data
    const videoData = {
      id: videoId,
      title: config.title,
      description: config.description,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      uploadDate: new Date().toISOString(),
      tags: config.tags,
      privacy: config.privacy
    };

    return videoData;
  } catch (error) {
    console.error('❌ YouTube upload failed:', error);
    throw new Error(`YouTube upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get video metadata from YouTube
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object|null>} Promise with video metadata
 */
export async function getVideoMetadata(videoId) {
  try {
    const { youtube } = await createYouTubeClient();
    
    const response = await youtube.videos.list({
      part: ['snippet', 'status', 'contentDetails'],
      id: [videoId]
    });

    const video = response.data.items?.[0];
    if (!video || !video.snippet) {
      return null;
    }

    return {
      id: videoId,
      title: video.snippet.title || '',
      description: video.snippet.description || '',
      thumbnailUrl: video.snippet.thumbnails?.maxres?.url || 
                   video.snippet.thumbnails?.high?.url || 
                   `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      uploadDate: video.snippet.publishedAt || '',
      duration: video.contentDetails?.duration || undefined,
      tags: video.snippet.tags || undefined,
      category: video.snippet.categoryId || undefined,
      privacy: (video.status?.privacyStatus) || 'public'
    };
  } catch (error) {
    console.error('Failed to get video metadata:', error);
    return null;
  }
}

/**
 * Save video metadata to JSON file
 * @param {Object} videoData - Video metadata to save
 * @param {string} outputPath - Path to save the JSON file
 */
export async function saveVideoMetadata(videoData, outputPath) {
  const defaultPath = path.join(process.cwd(), 'src', 'data', 'videos', `${videoData.id}.json`);
  const filePath = outputPath || defaultPath;
  
  // Ensure directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  
  // Save metadata
  await fs.writeFile(filePath, JSON.stringify(videoData, null, 2), 'utf-8');
  
  console.log(`📄 Video metadata saved to: ${filePath}`);
  return filePath;
}

/**
 * Load all video metadata from the videos directory
 * @returns {Promise<Array>} Promise with array of video metadata
 */
export async function loadAllVideoMetadata() {
  const videosDir = path.join(process.cwd(), 'src', 'data', 'videos');
  
  try {
    await fs.access(videosDir);
    const files = await fs.readdir(videosDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const videoDataPromises = jsonFiles.map(async (file) => {
      const filePath = path.join(videosDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    });
    
    return await Promise.all(videoDataPromises);
  } catch (error) {
    console.log('No videos directory found or no videos available');
    return [];
  }
}

/**
 * Generate embed code for a YouTube video
 * @param {string} videoId - YouTube video ID
 * @param {Object} options - Embed options
 * @returns {string} HTML embed code
 */
export function generateEmbedCode(videoId, options = {}) {
  const {
    width = 560,
    height = 315,
    autoplay = false,
    muted = false,
    controls = true
  } = options;

  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (muted) params.set('mute', '1');
  if (!controls) params.set('controls', '0');
  
  const paramString = params.toString();
  const src = `https://www.youtube.com/embed/${videoId}${paramString ? `?${paramString}` : ''}`;

  return `<iframe width="${width}" height="${height}" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}