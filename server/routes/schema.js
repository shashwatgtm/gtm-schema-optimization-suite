// Schema Performance Monitoring Routes
const express = require('express');
const router = express.Router();

// Get current schema status
router.get('/status', async (req, res) => {
    try {
        const schemaStatus = {
            total: 7,
            valid: 5,
            warnings: 1,
            errors: 1,
            types: ['Person', 'Organization', 'Service', 'FAQPage', 'Review', 'BreadcrumbList'],
            lastValidated: new Date().toISOString(),
            schemas: [
                {
                    id: 'person-schema',
                    type: 'Person',
                    status: 'valid',
                    url: '/',
                    errors: [],
                    warnings: [],
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'organization-schema',
                    type: 'Organization',
                    status: 'valid',
                    url: '/about',
                    errors: [],
                    warnings: [],
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'service-schema-fractional',
                    type: 'Service',
                    status: 'valid',
                    url: '/services/fractional-cmo',
                    errors: [],
                    warnings: [],
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'service-schema-gtm',
                    type: 'Service',
                    status: 'valid',
                    url: '/services/gtm-alpha',
                    errors: [],
                    warnings: [],
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'faq-schema',
                    type: 'FAQPage',
                    status: 'warning',
                    url: '/faq',
                    errors: [],
                    warnings: ['Duplicate question detected', 'Missing answer for question 3'],
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'review-schema',
                    type: 'Review',
                    status: 'error',
                    url: '/',
                    errors: ['Missing required property: reviewRating', 'Invalid date format in datePublished'],
                    warnings: [],
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'breadcrumb-schema',
                    type: 'BreadcrumbList',
                    status: 'valid',
                    url: '*',
                    errors: [],
                    warnings: [],
                    lastChecked: new Date().toISOString()
                }
            ]
        };
        
        res.json({
            success: true,
            data: schemaStatus,
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

// Validate all schemas
router.post('/validate', async (req, res) => {
    try {
        console.log('🔍 Starting schema validation...');
        
        // Simulate validation process
        const validationResults = {
            startTime: new Date().toISOString(),
            totalSchemas: 7,
            validatedSchemas: 7,
            results: [
                {
                    schemaType: 'Person',
                    isValid: true,
                    errors: [],
                    warnings: [],
                    validationTime: 0.234
                },
                {
                    schemaType: 'Organization',
                    isValid: true,
                    errors: [],
                    warnings: [],
                    validationTime: 0.187
                },
                {
                    schemaType: 'Service',
                    isValid: true,
                    errors: [],
                    warnings: [],
                    validationTime: 0.156
                },
                {
                    schemaType: 'FAQPage',
                    isValid: false,
                    errors: [],
                    warnings: ['Duplicate question detected', 'Missing answer for question 3'],
                    validationTime: 0.298
                },
                {
                    schemaType: 'Review',
                    isValid: false,
                    errors: ['Missing required property: reviewRating', 'Invalid date format in datePublished'],
                    warnings: [],
                    validationTime: 0.445
                }
            ],
            endTime: new Date().toISOString(),
            totalValidationTime: 1.32
        };
        
        // Broadcast update to connected clients
        if (req.app.locals.broadcast) {
            req.app.locals.broadcast.schema(validationResults);
        }
        
        res.json({
            success: true,
            data: validationResults,
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

// Get schema performance metrics
router.get('/performance', async (req, res) => {
    try {
        const { range = '30d' } = req.query;
        
        const performanceData = {
            timeRange: range,
            metrics: {
                totalSchemas: 7,
                validSchemas: 5,
                schemasWithWarnings: 1,
                schemasWithErrors: 1,
                averageValidationTime: 0.267,
                validationFrequency: '15min',
                lastValidation: new Date().toISOString()
            },
            trends: {
                validationErrors: generateTrendData(0, 3, 30),
                validationWarnings: generateTrendData(0, 2, 30),
                validationTime: generateTrendData(0.2, 0.5, 30)
            },
            topIssues: [
                { issue: 'Missing reviewRating property', count: 1, severity: 'error' },
                { issue: 'Invalid date format', count: 1, severity: 'error' },
                { issue: 'Duplicate FAQ questions', count: 1, severity: 'warning' }
            ]
        };
        
        res.json({
            success: true,
            data: performanceData,
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

// Get rich results data
router.get('/rich-results', async (req, res) => {
    try {
        const { range = '30d' } = req.query;
        
        const richResultsData = {
            timeRange: range,
            summary: {
                totalRichResults: 25,
                impressions: 12847,
                clicks: 1234,
                ctr: 9.6,
                avgPosition: 3.2
            },
            byType: {
                'Person': { count: 8, impressions: 4200, clicks: 420, ctr: 10.0 },
                'Organization': { count: 6, impressions: 3100, clicks: 310, ctr: 10.0 },
                'Service': { count: 7, impressions: 3800, clicks: 342, ctr: 9.0 },
                'FAQPage': { count: 3, impressions: 1200, clicks: 96, ctr: 8.0 },
                'Review': { count: 1, impressions: 547, clicks: 66, ctr: 12.1 }
            },
            trends: {
                impressions: generateTrendData(10000, 15000, 30),
                clicks: generateTrendData(1000, 1500, 30),
                ctr: generateTrendData(8.5, 11.2, 30),
                position: generateTrendData(2.8, 4.1, 30)
            },
            topPages: [
                { url: '/', type: 'Person', impressions: 2400, clicks: 240, ctr: 10.0 },
                { url: '/about', type: 'Organization', impressions: 1800, clicks: 180, ctr: 10.0 },
                { url: '/services/fractional-cmo', type: 'Service', impressions: 1600, clicks: 144, ctr: 9.0 }
            ]
        };
        
        res.json({
            success: true,
            data: richResultsData,
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

// Helper function to generate trend data
function generateTrendData(min, max, points) {
    const data = [];
    let current = min + (max - min) * 0.5;
    
    for (let i = 0; i < points; i++) {
        const variance = (Math.random() - 0.5) * (max - min) * 0.1;
        current = Math.max(min, Math.min(max, current + variance));
        data.push(parseFloat(current.toFixed(2)));
    }
    
    return data;
}

module.exports = router;