// Dashboard Configuration
const config = {
    // API Endpoints
    api: {
        base: process.env.NODE_ENV === 'production' 
            ? 'https://your-domain.com/api' 
            : 'http://localhost:3000/api',
        endpoints: {
            schema: {
                status: '/schema/status',
                validate: '/schema/validate',
                performance: '/schema/performance',
                richResults: '/schema/rich-results'
            },
            conversion: {
                funnel: '/conversion/funnel',
                tests: '/conversion/tests',
                insights: '/conversion/insights',
                attribution: '/conversion/attribution'
            },
            alerts: {
                list: '/alerts/list',
                config: '/alerts/config',
                create: '/alerts/create'
            }
        }
    },

    // Update intervals (in milliseconds)
    intervals: {
        realTime: 30000,     // 30 seconds
        moderate: 300000,    // 5 minutes
        slow: 900000         // 15 minutes
    },

    // Chart configurations
    charts: {
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#2ecc71',
            warning: '#f39c12',
            danger: '#e74c3c',
            info: '#3498db'
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    },

    // Notification settings
    notifications: {
        duration: 5000,
        position: 'top-right'
    },

    // Schema validation settings
    schema: {
        validationEndpoint: 'https://validator.schema.org/',
        richResultsTestUrl: 'https://search.google.com/test/rich-results',
        requiredTypes: [
            'Person',
            'Organization', 
            'Service',
            'FAQPage',
            'Review',
            'BreadcrumbList'
        ]
    },

    // A/B testing configuration
    abTesting: {
        minSampleSize: 1000,
        confidenceLevel: 0.95,
        maxTestDuration: 30, // days
        trafficAllocation: 0.5
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
}