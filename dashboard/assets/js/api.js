// API Helper Functions
class APIClient {
    constructor() {
        this.baseURL = config.api.base;
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await fetch(url, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: options.body ? JSON.stringify(options.body) : undefined
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Cache successful responses
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Schema API methods
    async getSchemaStatus() {
        return await this.request(config.api.endpoints.schema.status);
    }

    async validateSchemas() {
        return await this.request(config.api.endpoints.schema.validate, {
            method: 'POST'
        });
    }

    async getSchemaPerformance(timeRange = '30d') {
        return await this.request(`${config.api.endpoints.schema.performance}?range=${timeRange}`);
    }

    async getRichResultsData(timeRange = '30d') {
        return await this.request(`${config.api.endpoints.schema.richResults}?range=${timeRange}`);
    }

    // Conversion API methods
    async getFunnelData() {
        return await this.request(config.api.endpoints.conversion.funnel);
    }

    async getABTests() {
        return await this.request(config.api.endpoints.conversion.tests);
    }

    async createABTest(testConfig) {
        return await this.request(config.api.endpoints.conversion.tests, {
            method: 'POST',
            body: testConfig
        });
    }

    async getOptimizationInsights() {
        return await this.request(config.api.endpoints.conversion.insights);
    }

    async getAttributionData() {
        return await this.request(config.api.endpoints.conversion.attribution);
    }

    // Alerts API methods
    async getAlerts() {
        return await this.request(config.api.endpoints.alerts.list);
    }

    async updateAlertConfig(alertConfig) {
        return await this.request(config.api.endpoints.alerts.config, {
            method: 'PUT',
            body: alertConfig
        });
    }

    // Real-time data simulation (for development)
    generateMockData() {
        return {
            schemas: {
                total: 7,
                valid: 5,
                warnings: 1,
                errors: 1,
                types: ['Person', 'Organization', 'Service', 'FAQPage', 'Review']
            },
            richResults: {
                count: 25,
                impressions: 12847,
                clicks: 1234,
                ctr: 9.6,
                avgPosition: 3.2
            },
            conversion: {
                rate: 5.8,
                funnel: [
                    { step: 'Visitors', count: 8247, rate: 100 },
                    { step: 'Qualified Leads', count: 412, rate: 5.0 },
                    { step: 'Consultations', count: 87, rate: 21.1 },
                    { step: 'Customers', count: 23, rate: 26.4 }
                ],
                pipelineValue: 460000
            },
            abTests: [
                {
                    id: 'hero-cta-test',
                    name: 'Hero Section CTA',
                    status: 'running',
                    confidence: 47,
                    lift: 18,
                    variants: ['control', 'expert_strategy']
                },
                {
                    id: 'pricing-layout',
                    name: 'Pricing Page Layout',
                    status: 'running',
                    confidence: 73,
                    lift: 31,
                    variants: ['cards', 'table']
                }
            ]
        };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Create global API client instance
const api = new APIClient();
window.api = api;