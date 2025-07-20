# YouTube API v3 Integration

This documentation covers the complete YouTube video integration system that allows automatic video uploads and seamless blog integration.

## Overview

The YouTube integration system provides:
- **Automated video uploads** via GitHub Actions
- **Video metadata management** with JSON storage
- **Blog integration** with embed components
- **CLI tools** for manual video management
- **OAuth 2.0 authentication** with refresh tokens

## Prerequisites

### 1. Google Cloud Console Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable YouTube Data API v3**:
   - Navigate to APIs & Services > Library
   - Search for "YouTube Data API v3"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Desktop application" or "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8080/oauth2callback`
     - `https://your-domain.com/oauth2callback` (for production)

4. **Download Credentials**:
   - Download the JSON credentials file
   - Extract `client_id`, `client_secret`, and `redirect_uris`

### 2. OAuth 2.0 Refresh Token

You need to obtain a refresh token for automated uploads:

```bash
# Run the OAuth flow to get refresh token
npm run get-youtube-token
# or directly:
node scripts/get-youtube-token.js
```

### 3. Environment Variables

Set up the following environment variables:

```bash
# .env.local or GitHub Secrets
YOUTUBE_CLIENT_ID="your_google_client_id"
YOUTUBE_CLIENT_SECRET="your_google_client_secret"
YOUTUBE_REDIRECT_URI="http://localhost:8080/oauth2callback"
YOUTUBE_REFRESH_TOKEN="your_refresh_token"
```

## Usage

### Automatic Upload Workflow

1. **Add video to upload directory**:
   ```bash
   # Copy your video file
   cp my-tutorial.mp4 videos_to_upload/
   
   # Optional: Create metadata file
   cat > videos_to_upload/my-tutorial.json << EOF
   {
     "title": "Amazing Tutorial",
     "description": "Learn something amazing in this tutorial",
     "tags": ["tutorial", "programming", "javascript"],
     "privacy": "unlisted"
   }
   EOF
   ```

2. **Commit and push**:
   ```bash
   git add videos_to_upload/
   git commit -m "Add new tutorial video"
   git push
   ```

3. **GitHub Actions automatically**:
   - Detects new videos in `videos_to_upload/`
   - Uploads them to your YouTube channel
   - Saves metadata to `src/data/videos/`
   - Cleans up the upload directory
   - Provides embed codes in the action summary

### Manual Upload

```bash
# Upload a single video
node scripts/upload-video.js ./my-video.mp4 \
  --title "My Amazing Video" \
  --description "This is a great video about..." \
  --tags "tutorial,programming,javascript" \
  --privacy unlisted

# Dry run (test without uploading)
node scripts/upload-video.js ./my-video.mp4 \
  --title "Test Video" \
  --dry-run
```

### Manual Trigger via GitHub Actions

1. Go to your repository on GitHub
2. Navigate to Actions > YouTube Video Upload Automation
3. Click "Run workflow"
4. Fill in the video details:
   - Video path (e.g., `videos/my-video.mp4`)
   - Title, description, tags
   - Privacy setting

## Blog Integration

### Using the YouTube Component

```tsx
import YouTubeEmbed from '@/components/blog/YouTubeEmbed';

// Basic usage
<YouTubeEmbed videoId="dQw4w9WgXcQ" />

// With custom options
<YouTubeEmbed 
  videoId="dQw4w9WgXcQ"
  title="My Video Title"
  width={640}
  height={360}
  autoplay={false}
  muted={false}
  controls={true}
  showPreview={true}
/>
```

### Markdown Integration

Use video shortcodes in your markdown content:

```markdown
# My Blog Post

Here's an embedded video:

[video:dQw4w9WgXcQ]

Or with responsive sizing:

[video:dQw4w9WgXcQ responsive]
```

### Tiptap Integration

The video metadata is automatically available for Tiptap rich text editor integration.

## File Structure

```
├── videos_to_upload/          # Upload staging directory
│   ├── my-video.mp4          # Video files
│   └── my-video.json         # Optional metadata
├── src/
│   ├── data/videos/          # Video metadata storage
│   │   └── [video-id].json   # Generated metadata files
│   ├── lib/
│   │   ├── youtube.ts        # YouTube API integration
│   │   └── video-utils.ts    # Video utilities
│   └── components/blog/
│       └── YouTubeEmbed.tsx  # React component
├── scripts/
│   └── upload-video.js       # Upload script
└── .github/workflows/
    └── upload-video.yml      # GitHub Actions workflow
```

## Video Metadata Format

```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Amazing Tutorial",
  "description": "Learn something amazing",
  "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "uploadDate": "2025-01-20T10:30:00Z",
  "duration": "PT4M13S",
  "tags": ["tutorial", "programming"],
  "category": "22",
  "privacy": "unlisted"
}
```

## API Limits and Quotas

- **Daily Quota**: 10,000 units per day (free tier)
- **Upload Cost**: 1600 units per video upload
- **Metadata Cost**: 1 unit per metadata request
- **Daily Upload Limit**: ~6 videos per day (free tier)

## Troubleshooting

### Common Issues

1. **"Quota exceeded" error**:
   - Check your Google Cloud Console quota usage
   - Wait until quota resets (daily)
   - Request quota increase if needed

2. **"Authentication failed" error**:
   - Verify OAuth credentials in environment variables
   - Check if refresh token is valid
   - Re-run OAuth flow to get new tokens

3. **"Video format not supported" error**:
   - Ensure video format is supported (MP4, MOV, AVI, etc.)
   - Check file size limits (varies by account)
   - Verify video is not corrupted

4. **GitHub Actions failing**:
   - Check repository secrets are set correctly
   - Verify workflow permissions
   - Check action logs for detailed error messages

### Debug Mode

```bash
# Enable debug logging
DEBUG=youtube:* node scripts/upload-video.js video.mp4 --title "Test"

# Test with dry run
node scripts/upload-video.js video.mp4 --title "Test" --dry-run
```

## Security Considerations

1. **Never commit credentials** to repository
2. **Use GitHub Secrets** for environment variables
3. **Rotate refresh tokens** periodically
4. **Monitor API usage** in Google Cloud Console
5. **Review uploaded videos** regularly

## Advanced Configuration

### Custom Video Categories

Update the category mapping in `scripts/upload-video.js`:

```javascript
const categories = {
  'tech': '28',      // Science & Technology
  'gaming': '20',    // Gaming
  'music': '10',     // Music
  'education': '27', // Education
  'default': '22'    // People & Blogs
};
```

### Batch Processing

```bash
# Process multiple videos
for video in videos_to_upload/*.mp4; do
  node scripts/upload-video.js "$video" \
    --title "$(basename "$video" .mp4)" \
    --privacy unlisted
done
```

### Custom Workflow Triggers

Modify `.github/workflows/upload-video.yml` to trigger on:
- Specific branches
- Manual dispatch
- Scheduled uploads
- External webhooks

## Integration with Blog Posts

### Automatic Video Discovery

```typescript
// In your blog post component
import { loadAllVideoMetadata } from '@/lib/youtube';
import { parseVideoMentions } from '@/lib/video-utils';

// Automatically embed videos mentioned in content
const videos = await loadAllVideoMetadata();
const videoIds = parseVideoMentions(postContent);
const relatedVideos = videos.filter(v => videoIds.includes(v.id));
```

### SEO Optimization

- Videos automatically include structured data
- Thumbnail images for social sharing
- Proper video sitemaps
- Loading optimization with lazy loading

## Monitoring and Analytics

### Upload Success Tracking

- GitHub Actions provide upload summaries
- Error notifications via GitHub
- Metadata validation and storage
- Automatic cleanup of processed files

### YouTube Analytics

Use YouTube Analytics API (additional setup required) for:
- View counts and engagement metrics
- Traffic source analysis
- Audience demographics
- Revenue tracking (if monetized)

This integration provides a complete, automated solution for managing YouTube videos within your blog workflow while maintaining security and reliability.