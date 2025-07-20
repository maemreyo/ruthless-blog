#!/usr/bin/env node

/**
 * YouTube Video Upload Script
 * 
 * This script uploads videos to YouTube using the YouTube Data API v3
 * and saves the video metadata for use in blog posts.
 * 
 * Usage:
 *   node scripts/upload-video.js <video-path> [options]
 * 
 * Options:
 *   --title "Video Title"           Video title (required)
 *   --description "Description"     Video description
 *   --tags "tag1,tag2,tag3"        Comma-separated tags
 *   --privacy public|unlisted|private  Privacy setting (default: unlisted)
 *   --category-id "22"             YouTube category ID (default: 22 - People & Blogs)
 *   --output-dir "path"            Output directory for metadata (default: src/data/videos)
 * 
 * Environment Variables Required:
 *   YOUTUBE_CLIENT_ID              Google OAuth2 Client ID
 *   YOUTUBE_CLIENT_SECRET          Google OAuth2 Client Secret
 *   YOUTUBE_REDIRECT_URI           OAuth2 Redirect URI (default: http://localhost:8080/oauth2callback)
 *   YOUTUBE_REFRESH_TOKEN          OAuth2 Refresh Token
 * 
 * Example:
 *   node scripts/upload-video.js ./videos/my-tutorial.mp4 \
 *     --title "Amazing Tutorial" \
 *     --description "Learn something amazing in this tutorial" \
 *     --tags "tutorial,programming,javascript" \
 *     --privacy unlisted
 */

import { promises as fs } from 'fs';
import path from 'path';
import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

try {
  const envPath = join(projectRoot, '.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  
  // Parse .env.local file
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      // Handle both export and direct assignment formats
      const cleanLine = trimmedLine.replace(/^export\s+/, '');
      const [key, ...valueParts] = cleanLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  // .env.local file doesn't exist or can't be read, continue with system env vars
}

// Import our YouTube library (compiled from TypeScript)
import { uploadVideoToYouTube, saveVideoMetadata } from '../src/lib/youtube.js';

// Parse command line arguments
program
  .version('1.0.0')
  .description('Upload videos to YouTube and save metadata')
  .argument('<video-path>', 'Path to the video file to upload')
  .option('-t, --title <title>', 'Video title (required)')
  .option('-d, --description <description>', 'Video description', '')
  .option('--tags <tags>', 'Comma-separated tags', '')
  .option('-p, --privacy <privacy>', 'Privacy setting: public, unlisted, private', 'unlisted')
  .option('-c, --category-id <categoryId>', 'YouTube category ID', '22')
  .option('-o, --output-dir <outputDir>', 'Output directory for metadata', 'src/data/videos')
  .option('--dry-run', 'Simulate upload without actually uploading', false)
  .parse();

const options = program.opts();
const videoPath = program.args[0];

// Validate required options
if (!options.title) {
  console.error(chalk.red('❌ Error: --title is required'));
  process.exit(1);
}

if (!videoPath) {
  console.error(chalk.red('❌ Error: Video path is required'));
  process.exit(1);
}

// Validate privacy setting
const validPrivacySettings = ['public', 'unlisted', 'private'];
if (!validPrivacySettings.includes(options.privacy)) {
  console.error(chalk.red(`❌ Error: Invalid privacy setting. Must be one of: ${validPrivacySettings.join(', ')}`));
  process.exit(1);
}

// Validate environment variables
function validateEnvironment() {
  const requiredEnvVars = [
    'YOUTUBE_CLIENT_ID',
    'YOUTUBE_CLIENT_SECRET',
    'YOUTUBE_REFRESH_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(chalk.red('❌ Missing required environment variables:'));
    missingVars.forEach(varName => {
      console.error(chalk.red(`  - ${varName}`));
    });
    console.error(chalk.yellow('\n💡 Please set these environment variables or add them to your .env file'));
    process.exit(1);
  }
}

// Main upload function
async function uploadVideo() {
  try {
    // Validate environment
    validateEnvironment();

    // Validate video file exists
    try {
      await fs.access(videoPath);
    } catch (error) {
      console.error(chalk.red(`❌ Video file not found: ${videoPath}`));
      process.exit(1);
    }

    // Get file stats
    const stats = await fs.stat(videoPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(chalk.blue('\n📹 YouTube Video Upload'));
    console.log(chalk.gray('='.repeat(50)));
    console.log(chalk.cyan(`File: ${path.basename(videoPath)}`));
    console.log(chalk.cyan(`Size: ${fileSizeMB} MB`));
    console.log(chalk.cyan(`Title: ${options.title}`));
    console.log(chalk.cyan(`Privacy: ${options.privacy}`));
    if (options.description) {
      console.log(chalk.cyan(`Description: ${options.description.substring(0, 100)}${options.description.length > 100 ? '...' : ''}`));
    }
    if (options.tags) {
      console.log(chalk.cyan(`Tags: ${options.tags}`));
    }
    console.log(chalk.gray('='.repeat(50)));

    // Dry run mode
    if (options.dryRun) {
      console.log(chalk.yellow('\n🗺️ DRY RUN MODE - No actual upload will be performed'));
      console.log(chalk.green('✅ All validations passed!'));
      console.log(chalk.blue('💡 Remove --dry-run flag to perform actual upload'));
      return;
    }

    // Prepare upload configuration
    const uploadConfig = {
      title: options.title,
      description: options.description,
      tags: options.tags ? options.tags.split(',').map(tag => tag.trim()) : [],
      categoryId: options.categoryId,
      privacy: options.privacy
    };

    // Start upload
    const spinner = ora('Uploading video to YouTube...').start();
    
    try {
      const videoData = await uploadVideoToYouTube(videoPath, uploadConfig);
      spinner.succeed('Video uploaded successfully!');

      // Save metadata
      const metadataSpinner = ora('Saving video metadata...').start();
      const outputPath = path.join(options.outputDir, `${videoData.id}.json`);
      await saveVideoMetadata(videoData, outputPath);
      metadataSpinner.succeed('Metadata saved successfully!');

      // Display results
      console.log(chalk.green('\n✅ Upload completed successfully!'));
      console.log(chalk.gray('='.repeat(50)));
      console.log(chalk.green(`🎥 Video ID: ${videoData.id}`));
      console.log(chalk.green(`🔗 Watch URL: https://www.youtube.com/watch?v=${videoData.id}`));
      console.log(chalk.green(`🎬 Embed URL: https://www.youtube.com/embed/${videoData.id}`));
      console.log(chalk.green(`📄 Metadata: ${outputPath}`));
      console.log(chalk.gray('='.repeat(50)));
      
      // Generate embed code example
      console.log(chalk.blue('\n📋 Embed code for your blog posts:'));
      console.log(chalk.gray('\n```html'));
      console.log(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoData.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
      console.log(chalk.gray('```\n'));
      
      console.log(chalk.blue('📋 Markdown embed code:'));
      console.log(chalk.gray('\n```markdown'));
      console.log(`[![${videoData.title}](https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg)](https://www.youtube.com/watch?v=${videoData.id})`);
      console.log(chalk.gray('```\n'));

    } catch (uploadError) {
      spinner.fail('Upload failed!');
      throw uploadError;
    }

  } catch (error) {
    console.error(chalk.red(`\n❌ Upload failed: ${error.message}`));
    
    if (error.message.includes('quota')) {
      console.error(chalk.yellow('💡 This might be a YouTube API quota limit issue.'));
      console.error(chalk.yellow('   Check your Google Cloud Console for quota usage.'));
    }
    
    if (error.message.includes('authentication') || error.message.includes('credentials')) {
      console.error(chalk.yellow('💡 This might be an authentication issue.'));
      console.error(chalk.yellow('   Check your YouTube API credentials and refresh token.'));
    }
    
    process.exit(1);
  }
}

// Run the upload
uploadVideo();