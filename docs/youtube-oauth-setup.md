# YouTube OAuth Setup - Test Users Configuration

This document explains the crucial "Test Users" configuration step that's often missed in YouTube API OAuth setup.

## 🚨 Critical Step: OAuth Test Users

When you create an OAuth application in Google Cloud Console, your app starts in **"Testing" status**. This means Google restricts access to only users you explicitly approve, even if you own the project.

### Why This Matters

**Common Error:**
```
Error 403: access_denied
Details: The developer has not given you access to this app.
```

**Root Cause:** Your Google account is not added as a "Test User" in the OAuth consent screen.

## Step-by-Step Configuration

### 1. Access OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one with YouTube Data API v3 enabled)
3. Navigate to: **APIs & Services** → **OAuth consent screen**
4. Or visit directly: `https://console.cloud.google.com/apis/credentials/consent`

### 2. Configure App Information (if not done)

Fill out the required fields:
- **App name**: "Ruthless Blog YouTube Integration" (or your preferred name)
- **User support email**: Your email address
- **Developer contact information**: Your email address

### 3. Add Test Users (CRITICAL STEP)

**Find the "Test Users" Section:**
```
┌─────────────────────────────────────────┐
│ OAuth consent screen                    │
│                                         │
│ App information                         │
│ ├ App name: Ruthless Blog YouTube...    │
│ ├ User support email: your@email.com   │
│ └ Developer contact: your@email.com     │
│                                         │
│ Scopes                                  │
│ └ ../auth/youtube.upload                │
│                                         │
│ Test users                              │  ← THIS IS CRUCIAL!
│ ├ [Empty or existing emails]           │
│ └ [+ ADD USERS] button                  │
│                                         │
│ Summary                                 │
│ └ Publishing status: Testing            │
└─────────────────────────────────────────┘
```

**Add Your Email:**
1. In the **"Test users"** section, click **"+ ADD USERS"**
2. Enter the Google account email you'll use for authentication
3. Example: `ngonhuthanhtrung1409@gmail.com`
4. Click **"SAVE"**

**After Adding:**
```
Test users
├ ngonhuthanhtrung1409@gmail.com    [Remove]
└ + ADD USERS
```

### 4. Verify Configuration

**Check these settings:**
- ✅ **Publishing status**: "Testing" (normal for development)
- ✅ **Test users**: Your email is listed
- ✅ **Scopes**: `https://www.googleapis.com/auth/youtube.upload`

## Testing Your Setup

### Quick Test Command
```bash
npm run test-youtube-auth
```

This generates a test OAuth URL. If the URL gives a 403 error, recheck your test users configuration.

### Get Refresh Token
```bash
npm run get-youtube-token
```

**Expected Flow:**
1. Script opens browser to Google OAuth
2. You sign in with the email added to "Test users"
3. Grant permissions for YouTube upload
4. Receive refresh token in terminal

## Common Issues and Solutions

### Issue 1: "App Not Verified"
**Error:** "This app isn't verified"
**Solution:** 
- Click "Advanced" → "Go to [App Name] (unsafe)"
- This is normal for testing mode applications

### Issue 2: "Access Denied"
**Error:** `403: access_denied`
**Solutions:**
1. **Most Common**: Email not in test users list
2. Check YouTube Data API v3 is enabled
3. Verify redirect URI matches exactly: `http://localhost:8080/oauth2callback`

### Issue 3: "Invalid Redirect URI"
**Error:** `redirect_uri_mismatch`
**Solution:** 
1. Go to **Credentials** → Edit OAuth 2.0 Client ID
2. Add authorized redirect URI: `http://localhost:8080/oauth2callback`
3. Try both `localhost` and `127.0.0.1` variations if needed

## Production Considerations

### App Verification
For production use, you'll need to:
1. Submit app for verification
2. Complete Google's review process
3. Publish the app to remove "Testing" restrictions

### Security Best Practices
- Use environment variables for credentials
- Store refresh tokens securely
- Rotate credentials periodically
- Monitor API usage in Google Cloud Console

## Environment Variables Setup

After successful OAuth flow, add to `.env.local`:
```bash
YOUTUBE_CLIENT_ID="your_client_id"
YOUTUBE_CLIENT_SECRET="your_client_secret"
YOUTUBE_REDIRECT_URI="http://localhost:8080/oauth2callback"
YOUTUBE_REFRESH_TOKEN="your_refresh_token"
```

## Verification Checklist

- [ ] Google Cloud project created
- [ ] YouTube Data API v3 enabled
- [ ] OAuth 2.0 credentials created
- [ ] OAuth consent screen configured
- [ ] **Your email added to test users** ⭐ CRITICAL
- [ ] Redirect URI configured correctly
- [ ] Test authentication successful
- [ ] Refresh token obtained and stored

## Support

If you encounter issues:
1. Check Google Cloud Console → APIs & Services → Credentials
2. Verify OAuth consent screen → Test users
3. Test with: `npm run test-youtube-auth`
4. Review Google Cloud Console logs for detailed errors

The "Test Users" configuration is the most commonly missed step that causes 403 access_denied errors. Always ensure your authentication email is explicitly added to the test users list.