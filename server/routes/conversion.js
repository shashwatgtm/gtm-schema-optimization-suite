// Conversion Optimization Routes
const express = require('express');
const router = express.Router();

// Get conversion funnel data
router.get('/funnel', async (req, res) => {
    try {
        const funnelData = {
            timeRange: req.query.range || '30d',
            funnel: [
                {
                    step: 'Website Visitors',
                    count: 8247,
                    rate: 100,
                    dropOff: 0,
                    conversionRate: 100
                },
                {
                    step: 'Qualified Leads',
                    count: 412,
                    rate: 5.0,
                    dropOff: 7835,
                    conversionRate: 5.0
                },
                {
                    step: 'Consultation Bookings',
                    count: 87,
                    rate: 21.1,
                    dropOff: 325,
                    conversionRate: 1.06
                },
                {
                    step: 'Customers',
                    count: 23,
                    rate: 26.4,
                    dropOff: 64,
                    conversionRate: 0.28
                }
            ],
            metrics: {
                totalVisitors: 8247,
                totalConversions: 23,
                overallConversionRate: 0.28,
                averageOrderValue: 20000,
                totalRevenue: 460000,
                revenuePerVisitor: 55.8
            },
            trends: {
                visitors: generateTrendData(7000, 9000, 30),
                leads: generateTrendData(350, 450, 30),
                bookings: generateTrendData(70, 100, 30),
                customers: generateTrendData(18, 28, 30)
            }
        };
        
        res.json({
            success: true,
            data: funnelData,
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

// Get A/B test results
router.get('/tests', async (req, res) => {
    try {
        const abTests = {
            active: [
                {
                    id: 'hero-cta-test',
                    name: 'Hero Section CTA',
                    status: 'running',
                    startDate: '2025-07-01',
                    endDate: '2025-07-21',
                    traffic: 0.5,
                    variants: [
                        {
                            name: 'control',
                            traffic: 0.5,
                            visitors: 1423,
                            conversions: 71,
                            conversionRate: 4.99,
                            confidence: 0
                        },
                        {
                            name: 'expert_strategy',
                            traffic: 0.5,
                            visitors: 1401,
                            conversions: 84,
                            conversionRate: 5.99,
                            confidence: 47
                        }
                    ],
                    metric: 'consultation_booking',
                    significance: 0.47,
                    winner: null,
                    lift: 20.0
                }
            ],
            completed: [
                {
                    id: 'contact-form-test',
                    name: 'Contact Form Fields',
                    status: 'completed',
                    startDate: '2025-06-15',
                    endDate: '2025-07-05',
                    winner: 'reduced_fields',
                    lift: 42.3,
                    significance: 0.99,
                    implemented: true
                }
            ]
        };
        
        res.json({
            success: true,
            data: abTests,
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

// Create new A/B test
router.post('/tests', async (req, res) => {
    try {
        const { name, variants, metric, traffic, duration } = req.body;
        
        const newTest = {
            id: `${name.toLowerCase().replace(/\\s+/g, '-')}-${Date.now()}`,
            name,
            status: 'draft',
            variants,
            metric,
            traffic: traffic || 0.5,
            duration: duration || 21,
            createdAt: new Date().toISOString(),
            createdBy: 'user'
        };
        
        res.status(201).json({
            success: true,
            data: newTest,
            message: 'A/B test created successfully',
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

// Get optimization insights
router.get('/insights', async (req, res) => {
    try {
        const insights = {
            aiInsights: [
                {
                    id: 'conversion-opportunity',
                    title: '🎯 Conversion Opportunity',
                    description: 'Your consultation booking rate is 18% above industry average, but the lead-to-consultation gap presents a $140K annual opportunity.',
                    impact: 'high',
                    estimatedLift: 35,
                    estimatedRevenue: 140000
                },
                {
                    id: 'mobile-experience',
                    title: '📱 Mobile Experience',
                    description: 'Mobile users have 23% lower conversion rates. Mobile optimization could increase revenue by $85K annually.',
                    impact: 'high',
                    estimatedLift: 23,
                    estimatedRevenue: 85000
                }
            ],
            recommendations: [
                {
                    priority: 'high',
                    title: 'Implement Smart Lead Scoring',
                    description: 'Current lead qualification is manual. AI-powered scoring could increase booking rates by 35%.',
                    estimatedImpact: 156000,
                    implementationTime: '2 weeks'
                }
            ]
        };
        
        res.json({
            success: true,
            data: insights,
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

// Get attribution data
router.get('/attribution', async (req, res) => {
    try {
        const attributionData = {
            model: 'multi-touch',
            timeRange: req.query.range || '30d',
            conversions: {
                total: 23,
                bySource: {
                    'google/organic': { conversions: 12, revenue: 240000, percentage: 52.2 },
                    'linkedin/social': { conversions: 6, revenue: 120000, percentage: 26.1 },
                    'direct/none': { conversions: 3, revenue: 60000, percentage: 13.0 },
                    'google/cpc': { conversions: 2, revenue: 40000, percentage: 8.7 }
                }
            },
            customerJourney: {
                averageTouchpoints: 4.2,
                averageJourneyLength: 18,
                topPaths: [
                    { path: 'Google → Homepage → Services → Contact', conversions: 8 },
                    { path: 'LinkedIn → About → Services → Contact', conversions: 6 }
                ]
            }
        };
        
        res.json({
            success: true,
            data: attributionData,
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
        data.push(Math.round(current));
    }
    
    return data;
}

module.exports = router;