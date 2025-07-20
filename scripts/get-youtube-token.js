#!/usr/bin/env node

/**
 * YouTube OAuth 2.0 Token Generator
 * 
 * This script helps you obtain the initial OAuth 2.0 refresh token
 * required for automated YouTube uploads.
 * 
 * Prerequisites:
 * 1. Google Cloud Console project with YouTube Data API v3 enabled
 * 2. OAuth 2.0 credentials (Client ID and Client Secret)
 * 3. Authorized redirect URI: http://localhost:8080/oauth2callback
 * 
 * Usage:
 *   node scripts/get-youtube-token.js
 * 
 * Environment Variables Required:
 *   YOUTUBE_CLIENT_ID              Google OAuth2 Client ID
 *   YOUTUBE_CLIENT_SECRET          Google OAuth2 Client Secret
 *   YOUTUBE_REDIRECT_URI           OAuth2 Redirect URI (optional, defaults to localhost)
 * 
 * This script will:
 * 1. Start a local web server
 * 2. Open your browser to Google's OAuth consent screen
 * 3. Handle the callback with authorization code
 * 4. Exchange the code for access and refresh tokens
 * 5. Display the refresh token for you to save
 */

import { google } from 'googleapis';
import { createServer } from 'http';
import { parse } from 'url';
import open from 'open';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Configuration
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const PORT = process.env.OAUTH_PORT || 8080;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || `http://localhost:${PORT}/oauth2callback`;

// Validate environment variables
function validateEnvironment() {
  const requiredEnvVars = {
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    console.error(chalk.red('❌ Missing required environment variables:'));
    missingVars.forEach(varName => {
      console.error(chalk.red(`  - ${varName}`));
    });
    console.error(chalk.yellow('\n💡 Please set these environment variables:'));
    console.error(chalk.gray('   export YOUTUBE_CLIENT_ID="your_client_id"'));
    console.error(chalk.gray('   export YOUTUBE_CLIENT_SECRET="your_client_secret"'));
    console.error(chalk.yellow('\nOr add them to your .env.local file'));
    process.exit(1);
  }

  return requiredEnvVars;
}

// Create OAuth2 client
function createOAuth2Client(credentials) {
  return new google.auth.OAuth2(
    credentials.YOUTUBE_CLIENT_ID,
    credentials.YOUTUBE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// Generate authorization URL
function generateAuthUrl(oauth2Client) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Force consent screen to ensure refresh token
  });
}

// Start local server to handle OAuth callback
function startCallbackServer(oauth2Client) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const reqUrl = parse(req.url, true);
        
        if (reqUrl.pathname === '/oauth2callback') {
          const code = reqUrl.query.code;
          const error = reqUrl.query.error;
          
          if (error) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                  <h1 style="color: #dc3545;">❌ Authorization Failed</h1>
                  <p>Error: ${error}</p>
                  <p>You can close this window and try again.</p>
                </body>
              </html>
            `);
            server.close();
            reject(new Error(`OAuth authorization failed: ${error}`));
            return;
          }
          
          if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                  <h1 style="color: #dc3545;">❌ No Authorization Code</h1>
                  <p>No authorization code received. Please try again.</p>
                </body>
              </html>
            `);
            server.close();
            reject(new Error('No authorization code received'));
            return;
          }
          
          console.log(chalk.blue('🔄 Exchanging authorization code for tokens...'));
          
          // Exchange authorization code for tokens
          const { tokens } = await oauth2Client.getToken(code);
          
          // Success response
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #28a745;">✅ Authorization Successful!</h1>
                <p>You have successfully authorized the YouTube upload application.</p>
                <p>You can close this window and return to your terminal.</p>
                <div style="background: #f8f9fa; padding: 20px; margin: 20px; border-radius: 8px;">
                  <h3>Next Steps:</h3>
                  <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
                    <li>Copy the refresh token from your terminal</li>
                    <li>Add it to your environment variables</li>
                    <li>Start uploading videos!</li>
                  </ol>
                </div>
              </body>
            </html>
          `);
          
          server.close();
          resolve(tokens);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
        }
      } catch (error) {
        console.error(chalk.red('Error in callback handler:'), error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
              <h1 style="color: #dc3545;">❌ Server Error</h1>
              <p>An error occurred while processing the authorization.</p>
              <p>Please check your terminal for details and try again.</p>
            </body>
          </html>
        `);
        server.close();
        reject(error);
      }
    });

    server.listen(PORT, () => {
      console.log(chalk.green(`🚀 OAuth callback server started on port ${PORT}`));
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(chalk.red(`❌ Port ${PORT} is already in use.`));
        console.error(chalk.yellow('💡 Please close any applications using this port and try again.'));
      } else {
        console.error(chalk.red('❌ Server error:'), error);
      }
      reject(error);
    });
  });
}

// Main function
async function getYouTubeToken() {
  try {
    console.log(chalk.blue('\n🎬 YouTube OAuth 2.0 Token Generator'));
    console.log(chalk.gray('='.repeat(50)));
    
    // Validate environment
    const credentials = validateEnvironment();
    
    // Create OAuth2 client
    const oauth2Client = createOAuth2Client(credentials);
    
    // Generate authorization URL
    const authUrl = generateAuthUrl(oauth2Client);
    
    console.log(chalk.cyan('\n📋 Setup Information:'));
    console.log(chalk.cyan(`Client ID: ${credentials.YOUTUBE_CLIENT_ID.substring(0, 20)}...`));
    console.log(chalk.cyan(`Redirect URI: ${REDIRECT_URI}`));
    console.log(chalk.cyan(`Scopes: ${SCOPES.join(', ')}`));
    
    console.log(chalk.yellow('\n🔐 Starting OAuth 2.0 Authorization Flow...'));
    console.log(chalk.gray('This will:'));
    console.log(chalk.gray('1. Start a local web server'));
    console.log(chalk.gray('2. Open your browser to Google\'s consent screen'));
    console.log(chalk.gray('3. Handle the authorization callback'));
    console.log(chalk.gray('4. Generate your refresh token'));
    
    // Start callback server
    const tokensPromise = startCallbackServer(oauth2Client);
    
    // Open browser
    console.log(chalk.blue('\n🌐 Opening your browser for authorization...'));
    console.log(chalk.gray(`If it doesn't open automatically, visit: ${authUrl}`));
    
    try {
      await open(authUrl);
    } catch (openError) {
      console.log(chalk.yellow('⚠️  Could not auto-open browser. Please manually visit the URL above.'));
    }
    
    // Wait for authorization
    console.log(chalk.blue('\n⏳ Waiting for authorization...'));
    console.log(chalk.gray('Please complete the authorization in your browser.'));
    
    const tokens = await tokensPromise;
    
    // Display results
    console.log(chalk.green('\n✅ Authorization completed successfully!'));
    console.log(chalk.gray('='.repeat(50)));
    
    if (tokens.refresh_token) {
      console.log(chalk.green('\n🎉 SUCCESS! Here are your tokens:'));
      console.log(chalk.blue('\n📋 Add these to your environment variables:'));
      console.log(chalk.gray('='.repeat(50)));
      console.log(chalk.cyan('YOUTUBE_REFRESH_TOKEN="' + tokens.refresh_token + '"'));
      
      if (tokens.access_token) {
        console.log(chalk.gray('\n# Access token (expires in ~1 hour):'));
        console.log(chalk.gray('# YOUTUBE_ACCESS_TOKEN="' + tokens.access_token + '"'));
      }
      
      console.log(chalk.gray('='.repeat(50)));
      
      console.log(chalk.yellow('\n💡 Next Steps:'));
      console.log(chalk.gray('1. Copy the YOUTUBE_REFRESH_TOKEN above'));
      console.log(chalk.gray('2. Add it to your .env.local file or GitHub Secrets'));
      console.log(chalk.gray('3. You can now upload videos using the upload script!'));
      
      console.log(chalk.blue('\n🚀 Test your setup:'));
      console.log(chalk.gray('   npm run upload-video path/to/video.mp4 --title "Test Video" --dry-run'));
      
    } else {
      console.log(chalk.yellow('\n⚠️  Warning: No refresh token received.'));
      console.log(chalk.yellow('This usually means you already authorized this app before.'));
      console.log(chalk.yellow('To get a new refresh token:'));
      console.log(chalk.gray('1. Go to https://myaccount.google.com/permissions'));
      console.log(chalk.gray('2. Remove this app from your authorized apps'));
      console.log(chalk.gray('3. Run this script again'));
    }
    
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to get YouTube token:'), error.message);
    
    if (error.message.includes('authorization')) {
      console.error(chalk.yellow('\n💡 Authorization Tips:'));
      console.error(chalk.gray('- Make sure you grant all requested permissions'));
      console.error(chalk.gray('- Use the same Google account that owns the YouTube channel'));
      console.error(chalk.gray('- Check that YouTube Data API v3 is enabled in Google Cloud Console'));
    }
    
    if (error.code === 'EADDRINUSE') {
      console.error(chalk.yellow('\n💡 Port in use. Try running:'));
      console.error(chalk.gray('   killall node  # (to stop other Node.js processes)'));
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  getYouTubeToken();
}

export default { getYouTubeToken };