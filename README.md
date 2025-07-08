# GTM Schema Performance Monitoring & Conversion Optimization Suite

🚀 **Complete implementation for live schema monitoring and conversion optimization with real data integration**

## Features

### 📊 Schema Performance Monitoring
- Real-time schema validation
- Google Search Console integration
- Rich results tracking
- Automated error alerts
- Performance metrics dashboard

### 🎯 Conversion Optimization
- A/B testing framework
- Funnel tracking
- Attribution modeling
- User behavior analytics
- Automated optimization recommendations

## Quick Start

### 1. Schema Performance Dashboard
```bash
# Clone repository
git clone https://github.com/shashwatgtm/gtm-schema-optimization-suite.git
cd gtm-schema-optimization-suite

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your API keys and configuration

# Start development server
npm run dev
```

### 2. GTM Implementation
```javascript
// Add to your GTM container
// Import the GTM configurations from /gtm-config/

// 1. Schema Monitoring
<script src="./gtm-config/schema-monitoring.js"></script>

// 2. Conversion Optimization
<script src="./gtm-config/conversion-optimization.js"></script>
```

### 3. Environment Variables
```env
# Google Search Console
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Google Analytics
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_api_secret

# GTM Configuration
GTM_CONTAINER_ID=GTM-XXXXXXX

# Database (Optional - for storing historical data)
DATABASE_URL=your_database_url
```

## Live Data Sources

✅ **Google Search Console API** - Rich results performance
✅ **Google Analytics 4 API** - Conversion tracking
✅ **GTM DataLayer** - Real-time events
✅ **Schema Validation API** - Live schema checking
✅ **Performance APIs** - Core Web Vitals

## Deployment Options

### Option 1: Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shashwatgtm/gtm-schema-optimization-suite)

### Option 2: Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/shashwatgtm/gtm-schema-optimization-suite)

### Option 3: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Option 4: Local Development
```bash
npm run dev  # Starts on http://localhost:3000
```

## File Structure

```
├── dashboard/
│   ├── index.html              # Main dashboard
│   ├── schema-monitoring.html  # Schema performance page
│   ├── conversion-optimization.html # A/B testing page
│   └── assets/
│       ├── css/
│       ├── js/
│       └── data/
├── gtm-config/
│   ├── schema-monitoring.js    # GTM schema tracking
│   ├── conversion-optimization.js # GTM A/B testing
│   └── custom-variables.js     # GTM variables
├── api/
│   ├── schema-validation.js    # Schema validation API
│   ├── search-console.js       # GSC data fetching
│   ├── analytics.js            # GA4 data processing
│   └── optimization.js         # A/B test management
├── server/
│   ├── app.js                  # Express server
│   ├── routes/
│   └── middleware/
└── docs/
    ├── installation.md
    ├── api-documentation.md
    └── troubleshooting.md
```

## Real Data Integration

### Schema Performance Monitoring
- **Live validation**: Checks schemas every 15 minutes
- **GSC integration**: Pulls rich results data daily
- **Error alerts**: Slack/email notifications
- **Performance tracking**: Historical data storage

### Conversion Optimization
- **Real-time A/B testing**: Live traffic splitting
- **Event tracking**: Comprehensive funnel analytics
- **Attribution modeling**: Multi-touch attribution
- **Automated optimization**: AI-powered recommendations

## API Endpoints

### Schema Monitoring
```
GET /api/schema/status          # Current schema status
GET /api/schema/validate        # Validate all schemas
GET /api/schema/performance     # Performance metrics
POST /api/schema/alerts        # Configure alerts
```

### Conversion Optimization
```
GET /api/conversion/funnel      # Funnel performance
GET /api/conversion/tests       # A/B test results
POST /api/conversion/test       # Create new test
GET /api/conversion/attribution # Attribution data
```

## Integration Guide

### Step 1: Google APIs Setup
1. Enable Google Search Console API
2. Enable Google Analytics Reporting API
3. Create service account credentials
4. Configure OAuth 2.0 for web applications

### Step 2: GTM Container Setup
1. Import GTM configuration files
2. Configure custom variables
3. Set up triggers and tags
4. Test in preview mode

### Step 3: Dashboard Configuration
1. Configure API endpoints
2. Set up data refresh intervals
3. Configure alert thresholds
4. Test live data flow

## Support

- 📧 **Email**: shashwat@gtmexpert.com
- 💬 **GitHub Issues**: [Create an issue](https://github.com/shashwatgtm/gtm-schema-optimization-suite/issues)
- 📞 **WhatsApp**: +919810603649
- 🔗 **LinkedIn**: [linkedin.com/in/shashwatghosh](https://linkedin.com/in/shashwatghosh)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Ready for enterprise-level analytics and optimization with real data! 🚀**