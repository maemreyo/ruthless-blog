# 🎬 YouTube Integration Quick Setup

This guide helps you quickly set up the YouTube API v3 integration for automated video uploads.

## ⚡ Quick Start

### 1. Prerequisites

- Google Cloud Console account
- YouTube channel
- Node.js and npm/pnpm installed

### 2. Google Cloud Setup

1. **Create/Select Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing

2. **Enable YouTube Data API v3**:
   - APIs & Services > Library
   - Search "YouTube Data API v3" > Enable

3. **Create OAuth 2.0 Credentials**:
   - APIs & Services > Credentials
   - Create Credentials > OAuth 2.0 Client ID
   - Application type: "Desktop application" or "Web application"
   - Authorized redirect URIs: `http://localhost:8080/oauth2callback`

4. **Download Credentials**:
   - Download JSON file and extract `client_id` and `client_secret`

### 3. Environment Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your credentials to `.env.local`**:
   ```bash
   YOUTUBE_CLIENT_ID="your_client_id_here"
   YOUTUBE_CLIENT_SECRET="your_client_secret_here"
   ```

### 4. Get Refresh Token

Run the token generator to get your refresh token:

```bash
npm run get-youtube-token
```

This will:
- Start a local server
- Open your browser for OAuth consent
- Generate and display your refresh token

**Add the refresh token to `.env.local`**:
```bash
YOUTUBE_REFRESH_TOKEN="your_refresh_token_here"
```

### 5. Test Your Setup

```bash
# Test with dry run (no actual upload)
npm run upload-video path/to/test-video.mp4 \
  --title "Test Video" \
  --description "Testing YouTube integration" \
  --privacy unlisted \
  --dry-run
```

## 🚀 Usage Examples

### Automatic Upload Workflow

1. **Add video to upload directory**:
   ```bash
   cp my-tutorial.mp4 videos_to_upload/
   ```

2. **Optional: Add metadata file**:
   ```bash
   cat > videos_to_upload/my-tutorial.json << EOF
   {
     "title": "Amazing Tutorial",
     "description": "Learn something amazing",
     "tags": ["tutorial", "programming"],
     "privacy": "unlisted"
   }
   EOF
   ```

3. **Push to trigger automation**:
   ```bash
   git add videos_to_upload/
   git commit -m "Add new tutorial video"
   git push  # 🎬 GitHub Actions will upload automatically!
   ```

### Manual Upload

```bash
npm run upload-video my-video.mp4 \
  --title "My Amazing Video" \
  --description "Great content here" \
  --tags "tutorial,programming,javascript" \
  --privacy unlisted
```

### Blog Integration

```tsx
// React component
import YouTubeEmbed from '@/components/blog/YouTubeEmbed';

<YouTubeEmbed videoId="dQw4w9WgXcQ" />
```

```markdown
<!-- Markdown shortcode -->
[video:dQw4w9WgXcQ]
```

## 🔧 GitHub Actions Setup

For automated uploads, add these secrets to your GitHub repository:

1. **Repository Settings > Secrets and Variables > Actions**
2. **Add the following secrets**:
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET` 
   - `YOUTUBE_REFRESH_TOKEN`
   - `YOUTUBE_REDIRECT_URI` (optional, defaults to localhost)

## 📊 API Quotas

- **Free tier**: 10,000 units/day
- **Video upload**: ~1,600 units per video
- **Daily limit**: ~6 videos per day (free tier)

## 🆘 Troubleshooting

### Common Issues

1. **"Quota exceeded"**:
   - Check [Google Cloud Console](https://console.cloud.google.com/) quota usage
   - Wait for daily reset or request quota increase

2. **"Authentication failed"**:
   - Verify environment variables are set correctly
   - Re-run `npm run get-youtube-token` to get fresh tokens

3. **"Video format not supported"**:
   - Use supported formats: MP4, MOV, AVI, MKV, WebM
   - Check file isn't corrupted

4. **Browser doesn't open during token setup**:
   - Manually visit the URL shown in terminal
   - Check if port 8080 is available

### Debug Commands

```bash
# Test upload without actually uploading
npm run upload-video video.mp4 --title "Test" --dry-run

# Check if tokens work
node -e "
const { createYouTubeClient } = require('./dist/lib/youtube');
createYouTubeClient().then(() => console.log('✅ Auth working!'))
"
```

## 📚 Full Documentation

For complete documentation see: [`docs/youtube-integration.md`](docs/youtube-integration.md)

## 🎯 What You Get

✅ **Automated video uploads** via GitHub Actions  
✅ **Seamless blog integration** with React components  
✅ **Metadata management** with JSON storage  
✅ **CLI tools** for manual uploads  
✅ **Error handling** and retry logic  
✅ **Security** with GitHub Secrets  
✅ **Responsive embeds** with lazy loading  

🎉 **You're ready to start uploading videos automatically!**