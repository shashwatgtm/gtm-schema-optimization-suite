// Analytics Routes
const express = require('express');
const router = express.Router();

// Get analytics overview
router.get('/overview', async (req, res) => {
    try {
        const overview = {
            timeRange: req.query.range || '30d',
            summary: {
                totalVisitors: 8247,
                totalConversions: 23,
                conversionRate: 0.28,
                revenue: 460000,
                averageOrderValue: 20000
            },
            traffic: {
                organic: { visitors: 4529, percentage: 54.9 },
                social: { visitors: 1649, percentage: 20.0 },
                direct: { visitors: 1319, percentage: 16.0 },
                paid: { visitors: 750, percentage: 9.1 }
            },
            devices: {
                desktop: { visitors: 4948, percentage: 60.0, conversionRate: 0.32 },
                mobile: { visitors: 2474, percentage: 30.0, conversionRate: 0.20 },
                tablet: { visitors: 825, percentage: 10.0, conversionRate: 0.25 }
            },
            geography: {
                'India': { visitors: 4123, percentage: 50.0, conversions: 12 },
                'United States': { visitors: 1649, percentage: 20.0, conversions: 6 },
                'United Kingdom': { visitors: 824, percentage: 10.0, conversions: 3 },
                'Canada': { visitors: 495, percentage: 6.0, conversions: 1 },
                'Australia': { visitors: 330, percentage: 4.0, conversions: 1 },
                'Others': { visitors: 826, percentage: 10.0, conversions: 0 }
            },
            topPages: [
                { path: '/', views: 2474, conversions: 8, conversionRate: 0.32 },
                { path: '/services/fractional-cmo', views: 1237, conversions: 7, conversionRate: 0.57 },
                { path: '/about', views: 989, conversions: 3, conversionRate: 0.30 },
                { path: '/services/gtm-alpha', views: 824, conversions: 3, conversionRate: 0.36 },
                { path: '/contact', views: 659, conversions: 2, conversionRate: 0.30 }
            ],
            events: {
                consultation_booking: { count: 87, value: 696000 },
                fractional_cmo: { count: 23, value: 276000 },
                gtm_audit_request: { count: 34, value: 170000 },
                rate_gtm_engagement: { count: 12, value: 12000 }
            }
        };
        
        res.json({
            success: true,
            data: overview,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Track custom event
router.post('/event', async (req, res) => {
    try {
        const { eventName, eventValue, userId, sessionId, properties } = req.body;
        
        const event = {
            id: `event-${Date.now()}`,
            name: eventName,
            value: eventValue || 0,
            userId: userId || 'anonymous',
            sessionId: sessionId || `session-${Date.now()}`,
            properties: properties || {},
            timestamp: new Date().toISOString(),
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            url: req.get('Referer') || 'unknown'
        };
        
        // In a real application, this would be stored in a database
        console.log('📊 Custom event tracked:', event);
        
        res.json({
            success: true,
            data: event,
            message: 'Event tracked successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;