// Alerts Management Routes
const express = require('express');
const router = express.Router();

// Get recent alerts
router.get('/list', async (req, res) => {
    try {
        const alerts = {
            recent: [
                {
                    id: 'alert-001',
                    type: 'error',
                    title: 'Schema Validation Failed',
                    message: 'Review schema has 2 validation errors that need immediate attention',
                    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                    severity: 'high',
                    resolved: false,
                    source: 'schema_monitor'
                },
                {
                    id: 'alert-002',
                    type: 'warning',
                    title: 'Conversion Rate Drop',
                    message: 'Mobile conversion rate decreased by 15% compared to last week',
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    severity: 'medium',
                    resolved: false,
                    source: 'conversion_monitor'
                },
                {
                    id: 'alert-003',
                    type: 'success',
                    title: 'A/B Test Winner Declared',
                    message: 'Pricing layout test completed with 31% conversion improvement',
                    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    severity: 'low',
                    resolved: true,
                    source: 'ab_testing'
                },
                {
                    id: 'alert-004',
                    type: 'info',
                    title: 'Rich Results Improvement',
                    message: 'Person schema achieved featured snippet position for "GTM Expert India"',
                    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
                    severity: 'low',
                    resolved: true,
                    source: 'rich_results'
                }
            ],
            stats: {
                total: 24,
                unresolved: 2,
                high: 1,
                medium: 1,
                low: 22
            },
            config: {
                schemaAlerts: true,
                performanceAlerts: true,
                conversionAlerts: true,
                emailNotifications: true,
                slackNotifications: false
            }
        };
        
        res.json({
            success: true,
            data: alerts,
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

// Update alert configuration
router.put('/config', async (req, res) => {
    try {
        const { schemaAlerts, performanceAlerts, conversionAlerts, emailNotifications, slackNotifications } = req.body;
        
        const updatedConfig = {
            schemaAlerts: schemaAlerts !== undefined ? schemaAlerts : true,
            performanceAlerts: performanceAlerts !== undefined ? performanceAlerts : true,
            conversionAlerts: conversionAlerts !== undefined ? conversionAlerts : true,
            emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
            slackNotifications: slackNotifications !== undefined ? slackNotifications : false,
            updatedAt: new Date().toISOString()
        };
        
        res.json({
            success: true,
            data: updatedConfig,
            message: 'Alert configuration updated successfully',
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

// Create new alert
router.post('/create', async (req, res) => {
    try {
        const { type, title, message, severity, source } = req.body;
        
        const newAlert = {
            id: `alert-${Date.now()}`,
            type: type || 'info',
            title,
            message,
            severity: severity || 'medium',
            source: source || 'manual',
            timestamp: new Date().toISOString(),
            resolved: false
        };
        
        // Broadcast alert to connected clients
        if (req.app.locals.broadcast) {
            req.app.locals.broadcast.alert(newAlert);
        }
        
        res.status(201).json({
            success: true,
            data: newAlert,
            message: 'Alert created successfully',
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