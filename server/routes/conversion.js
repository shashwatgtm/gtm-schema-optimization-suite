// Conversion Optimization Routes
const express = require('express');
const router = express.Router();
const { getConversionFunnel, getABTestResults, createABTest } = require('../services/conversionService');

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
                },
                {
                    id: 'pricing-layout-test',
                    name: 'Pricing Page Layout',
                    status: 'running',
                    startDate: '2025-06-28',
                    endDate: '2025-07-18',
                    traffic: 0.5,
                    variants: [
                        {
                            name: 'cards',
                            traffic: 0.5,
                            visitors: 892,
                            conversions: 27,
                            conversionRate: 3.03,
                            confidence: 0
                        },
                        {
                            name: 'table',
                            traffic: 0.5,
                            visitors: 876,
                            conversions: 35,
                            conversionRate: 3.99,
                            confidence: 73
                        }
                    ],
                    metric: 'fractional_cmo',
                    significance: 0.73,
                    winner: null,
                    lift: 31.7
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
            ],
            draft: [
                {
                    id: 'social-proof-test',
                    name: 'Social Proof Placement',
                    status: 'draft',
                    metric: 'consultation_booking',
                    estimatedLift: 15,
                    readyToLaunch: true
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
            id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            name,
            status: 'draft',
            variants,
            metric,
            traffic: traffic || 0.5,
            duration: duration || 21,
            createdAt: new Date().toISOString(),
            createdBy: 'user', // In real app, get from auth
            estimatedSampleSize: Math.ceil(1000 / (traffic || 0.5)),
            estimatedDuration: duration || 21
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
                    description: 'Your consultation booking rate is 18% above industry average, but the lead-to-consultation gap presents a $140K annual opportunity. Consider implementing progressive profiling.',
                    impact: 'high',
                    estimatedLift: 35,
                    estimatedRevenue: 140000,
                    actionItems: [
                        'Implement progressive profiling',
                        'Add lead scoring system',
                        'Create nurture email sequence'
                    ]
                },
                {
                    id: 'mobile-experience',
                    title: '📱 Mobile Experience',
                    description: 'Mobile users have 23% lower conversion rates. Key issues: form abandonment at 67% and CTA visibility below 50%. Mobile optimization could increase revenue by $85K annually.',
                    impact: 'high',
                    estimatedLift: 23,
                    estimatedRevenue: 85000,
                    actionItems: [
                        'Optimize mobile forms',
                        'Improve CTA visibility',
                        'Reduce page load time'
                    ]
                },
                {
                    id: 'timing-optimization',
                    title: '⏰ Timing Optimization',
                    description: 'Peak conversion times: Tue-Thu 10AM-2PM IST. Scheduling CTAs and follow-ups during these windows could improve close rates by 28%.',
                    impact: 'medium',
                    estimatedLift: 28,
                    estimatedRevenue: 45000,
                    actionItems: [
                        'Schedule email campaigns for peak times',
                        'Optimize ad scheduling',
                        'Add time-based CTAs'
                    ]
                }
            ],
            recommendations: [
                {
                    priority: 'high',
                    title: 'Implement Smart Lead Scoring',
                    description: 'Current lead qualification is manual. Implementing AI-powered scoring could increase consultation booking rates by 35% and save 12 hours weekly.',
                    estimatedImpact: 156000,
                    implementationTime: '2 weeks',
                    effort: 'medium'
                },
                {
                    priority: 'high',
                    title: 'Mobile Conversion Optimization',
                    description: 'Mobile conversion rate is 23% below desktop. Optimizing mobile experience could capture additional $85K in lost revenue.',
                    estimatedImpact: 85000,
                    implementationTime: '3 weeks',
                    effort: 'high'
                }
            ],
            performanceAlerts: [
                {
                    type: 'opportunity',
                    message: 'Case study page visitors have 3.2x higher booking rates - consider adding more case studies',
                    severity: 'medium'
                },
                {
                    type: 'warning',
                    message: 'Mobile bounce rate increased 15% this week',
                    severity: 'high'
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
                },
                byCampaign: {
                    'gtm-expertise': { conversions: 8, revenue: 160000 },
                    'fractional-cmo': { conversions: 7, revenue: 140000 },
                    'organic-search': { conversions: 5, revenue: 100000 },
                    'linkedin-content': { conversions: 3, revenue: 60000 }
                }
            },
            customerJourney: {
                averageTouchpoints: 4.2,
                averageJourneyLength: 18, // days
                topPaths: [
                    { path: 'Google → Homepage → Services → Contact', conversions: 8 },
                    { path: 'LinkedIn → About → Services → Contact', conversions: 6 },
                    { path: 'Direct → Homepage → Contact', conversions: 3 }
                ]
            },
            attribution: {
                firstTouch: {
                    'google/organic': 45.2,
                    'linkedin/social': 28.6,
                    'direct/none': 19.0,
                    'referral': 7.2
                },
                lastTouch: {
                    'direct/none': 39.1,
                    'google/organic': 34.8,
                    'linkedin/social': 17.4,
                    'google/cpc': 8.7
                },
                timeDecay: {
                    'google/organic': 42.1,
                    'linkedin/social': 24.3,
                    'direct/none': 21.7,
                    'google/cpc': 11.9
                }
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