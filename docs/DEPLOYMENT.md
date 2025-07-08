# Deployment Guide

## Quick Deployment Options

### 1. Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shashwatgtm/gtm-schema-optimization-suite)

1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

### 2. Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 3. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/shashwatgtm/gtm-schema-optimization-suite)

### 4. Local Development

```bash
git clone https://github.com/shashwatgtm/gtm-schema-optimization-suite.git
cd gtm-schema-optimization-suite
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

## Environment Configuration

### Required Environment Variables

```env
# Google APIs
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Analytics
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_api_secret

# GTM
GTM_CONTAINER_ID=GTM-XXXXXXX
```

### Optional Environment Variables

```env
# Database (for persistence)
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# Notifications
SLACK_WEBHOOK_URL=your_slack_webhook
EMAIL_SERVICE_API_KEY=your_email_api_key

# Server
PORT=3000
NODE_ENV=production
```

## Google APIs Setup

### 1. Enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Google Search Console API
   - Google Analytics Reporting API
   - Google Sheets API (optional)

### 2. Create Credentials

1. Go to "Credentials" section
2. Create "OAuth 2.0 Client IDs"
3. Add your domain to authorized origins
4. Download credentials JSON

### 3. Get Refresh Token

```bash
# Use OAuth 2.0 Playground
# https://developers.google.com/oauthplayground/
# Select the required scopes and authorize
```

## GTM Container Setup

### 1. Import Configuration

1. Download GTM container JSON from `/gtm-config/container-export.json`
2. Go to GTM Admin → Import Container
3. Upload the JSON file
4. Choose merge or overwrite

### 2. Configure Variables

1. Update API endpoints in custom variables
2. Set your GA4 Measurement ID
3. Configure event parameters

### 3. Test Implementation

1. Use GTM Preview mode
2. Verify events are firing
3. Check data layer
4. Publish when ready

## Database Setup (Optional)

### MongoDB

```bash
# Using MongoDB Atlas
# 1. Create cluster at https://cloud.mongodb.com/
# 2. Get connection string
# 3. Set DATABASE_URL environment variable
```

### Redis

```bash
# Using Redis Cloud
# 1. Create database at https://redislabs.com/
# 2. Get connection string
# 3. Set REDIS_URL environment variable
```

## SSL/HTTPS Setup

### Automatic (Recommended)

Most platforms (Vercel, Netlify, Railway) provide automatic HTTPS.

### Manual Setup

```bash
# Using Let's Encrypt with Certbot
sudo certbot --nginx -d yourdomain.com
```

## Monitoring Setup

### Application Monitoring

```env
# Add to .env
UPTIME_ROBOT_API_KEY=your_uptimerobot_key
SENTRY_DSN=your_sentry_dsn
```

### Log Management

```bash
# Logs are stored in /logs directory
# Configure log rotation
sudo nano /etc/logrotate.d/gtm-optimization
```

## Performance Optimization

### CDN Setup

1. Use Cloudflare for static assets
2. Enable gzip compression
3. Set proper cache headers

### Database Optimization

```javascript
// Add indexes for frequently queried fields
db.validations.createIndex({ "timestamp": -1 })
db.events.createIndex({ "userId": 1, "timestamp": -1 })
```

## Security Configuration

### Environment Security

```env
# Strong JWT secret
JWT_SECRET=your_very_strong_secret_key_here

# Allowed origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Rate Limiting

```javascript
// Configure in server/middleware/rateLimiter.js
points: 100, // requests
duration: 60, // seconds
```

## Backup Strategy

### Database Backup

```bash
# MongoDB backup
mongodump --uri="$DATABASE_URL" --out=/backup/$(date +%Y%m%d)

# Schedule with cron
0 2 * * * /path/to/backup-script.sh
```

### Configuration Backup

```bash
# Backup environment variables
git add .env.example
git commit -m "Update environment template"
git push
```

## Troubleshooting

### Common Issues

1. **API Rate Limits**
   - Check Google API quotas
   - Implement proper caching
   - Use exponential backoff

2. **CORS Errors**
   - Verify ALLOWED_ORIGINS
   - Check GTM container settings
   - Validate domain configuration

3. **Schema Validation Failures**
   - Check JSON-LD syntax
   - Verify required properties
   - Test with Google's Rich Results Tool

### Debugging

```bash
# Enable debug logging
LOG_LEVEL=debug npm start

# Check application logs
tail -f logs/combined.log

# Monitor API requests
curl -X GET http://localhost:3000/api/health
```

## Scaling

### Horizontal Scaling

```bash
# Use PM2 for multiple instances
npm install -g pm2
pm2 start ecosystem.config.js
```

### Load Balancing

```nginx
# Nginx configuration
upstream app {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}
```

## Maintenance

### Regular Tasks

1. **Weekly**
   - Review error logs
   - Check API quotas
   - Validate schema status

2. **Monthly**
   - Update dependencies
   - Review performance metrics
   - Backup configurations

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Feature updates

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Update Node.js
# Use nvm to manage versions
nvm install node
nvm use node
```

## Support

For deployment issues:

1. Check the [Issues](https://github.com/shashwatgtm/gtm-schema-optimization-suite/issues) page
2. Review logs for error details
3. Contact: shashwat@gtmexpert.com
4. WhatsApp: +919810603649