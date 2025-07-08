// Express.js Server for GTM Schema Optimization Suite
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import route handlers
const schemaRoutes = require('./routes/schema');
const conversionRoutes = require('./routes/conversion');
const alertsRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Global variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline", "https://cdn.jsdelivr.net", "https://cdn.socket.io"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"],
            fontSrc: ["'self'", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    }
}));

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000"],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', rateLimiter);

// Logging
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, '../dashboard')));

// API Routes
app.use('/api/schema', schemaRoutes);
app.use('/api/conversion', conversionRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: NODE_ENV,
        uptime: process.uptime()
    });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'GTM Schema Optimization Suite API',
        version: '1.0.0',
        endpoints: {
            schema: {
                'GET /api/schema/status': 'Get current schema status',
                'POST /api/schema/validate': 'Validate all schemas',
                'GET /api/schema/performance': 'Get schema performance metrics',
                'GET /api/schema/rich-results': 'Get rich results data'
            },
            conversion: {
                'GET /api/conversion/funnel': 'Get conversion funnel data',
                'GET /api/conversion/tests': 'Get A/B test results',
                'POST /api/conversion/tests': 'Create new A/B test',
                'GET /api/conversion/insights': 'Get optimization insights',
                'GET /api/conversion/attribution': 'Get attribution data'
            },
            alerts: {
                'GET /api/alerts/list': 'Get recent alerts',
                'PUT /api/alerts/config': 'Update alert configuration',
                'POST /api/alerts/create': 'Create new alert'
            },
            analytics: {
                'GET /api/analytics/overview': 'Get analytics overview',
                'POST /api/analytics/event': 'Track custom event'
            }
        }
    });
});

// Serve dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/index.html'));
});

// Catch-all for SPA routing
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        res.sendFile(path.join(__dirname, '../dashboard/index.html'));
    }
});

// Error handling
app.use(errorHandler);

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log(`📱 Client connected: ${socket.id}`);
    
    // Send initial connection confirmation
    socket.emit('connected', {
        message: 'Connected to GTM Optimization Suite',
        timestamp: new Date().toISOString()
    });
    
    // Handle client subscription to data streams
    socket.on('subscribe', (dataType) => {
        console.log(`🔔 Client ${socket.id} subscribed to ${dataType}`);
        socket.join(dataType);
    });
    
    socket.on('unsubscribe', (dataType) => {
        console.log(`🔕 Client ${socket.id} unsubscribed from ${dataType}`);
        socket.leave(dataType);
    });
    
    socket.on('disconnect', () => {
        console.log(`📱 Client disconnected: ${socket.id}`);
    });
});

// Real-time data broadcasting functions
function broadcastSchemaUpdate(data) {
    io.to('schema').emit('schema_update', data);
}

function broadcastConversionUpdate(data) {
    io.to('conversion').emit('conversion_update', data);
}

function broadcastAlert(alert) {
    io.emit('alert', alert);
}

// Export broadcasting functions for use in routes
app.locals.broadcast = {
    schema: broadcastSchemaUpdate,
    conversion: broadcastConversionUpdate,
    alert: broadcastAlert
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 GTM Schema Optimization Suite running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔗 API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = { app, server, io };