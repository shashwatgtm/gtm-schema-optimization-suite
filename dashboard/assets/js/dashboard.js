// Main Dashboard Controller
class Dashboard {
    constructor() {
        this.isInitialized = false;
        this.updateIntervals = {};
        this.socket = null;
        this.currentTab = 'overview';
        
        // Bind methods
        this.init = this.init.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.setupRealTimeUpdates = this.setupRealTimeUpdates.bind(this);
    }

    // Initialize dashboard
    async init() {
        if (this.isInitialized) return;
        
        try {
            console.log('🚀 Initializing Dashboard...');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize charts
            chartManager.initializeCharts();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup real-time updates
            this.setupRealTimeUpdates();
            
            // Setup WebSocket connection
            this.initializeWebSocket();
            
            this.isInitialized = true;
            console.log('✅ Dashboard initialized successfully');
            
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            this.showNotification('Dashboard initialization failed', 'error');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Refresh button (if exists)
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAllData();
            });
        }

        // Schema validation button
        const validateBtn = document.getElementById('validateSchemas');
        if (validateBtn) {
            validateBtn.addEventListener('click', () => {
                this.validateSchemas();
            });
        }

        // Alert configuration
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateAlertConfig(e.target.id, e.target.checked);
            });
        });
    }

    // Switch between tabs
    switchTab(tabName) {
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected tab and button
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Load tab-specific data
        this.loadTabData(tabName);
    }

    // Load initial data
    async loadInitialData() {
        try {
            // For development, use mock data
            // In production, this would call real APIs
            const mockData = api.generateMockData();
            
            this.updateOverviewMetrics(mockData);
            this.updateSchemaStatus(mockData.schemas);
            this.updateConversionData(mockData.conversion);
            this.updateABTests(mockData.abTests);
            
            this.updateStatus('schemaStatus', 'online');
            this.updateStatus('conversionStatus', 'online');
            this.updateLastUpdated();
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.updateStatus('schemaStatus', 'offline');
            this.updateStatus('conversionStatus', 'offline');
        }
    }

    // Load tab-specific data
    async loadTabData(tabName) {
        switch (tabName) {
            case 'schema':
                await this.loadSchemaData();
                break;
            case 'conversion':
                await this.loadConversionData();
                break;
            case 'alerts':
                await this.loadAlertsData();
                break;
            default:
                // Overview tab - already loaded
                break;
        }
    }

    // Update overview metrics
    updateOverviewMetrics(data) {
        this.updateElement('totalSchemas', data.schemas.total);
        this.updateElement('richResultsCount', data.richResults.count);
        this.updateElement('conversionRate', `${data.conversion.rate}%`);
        this.updateElement('pipelineValue', `$${data.conversion.pipelineValue.toLocaleString()}`);
        
        // Update change indicators
        this.updateChangeIndicator('schemaChange', '+2 this week', 'positive');
        this.updateChangeIndicator('richResultsChange', '+3 this week', 'positive');
        this.updateChangeIndicator('conversionChange', '+0.8% this month', 'positive');
        this.updateChangeIndicator('revenueChange', '+15% this month', 'positive');
    }

    // Update schema status
    updateSchemaStatus(schemaData) {
        const healthGrid = document.getElementById('schemaHealthGrid');
        if (!healthGrid) return;

        const schemas = [
            { name: 'Person Schema', status: 'valid', type: 'Person' },
            { name: 'Organization Schema', status: 'valid', type: 'Organization' },
            { name: 'Service Schema', status: 'valid', type: 'Service' },
            { name: 'FAQ Schema', status: 'warning', type: 'FAQPage' },
            { name: 'Review Schema', status: 'error', type: 'Review' }
        ];

        healthGrid.innerHTML = schemas.map(schema => `
            <div class="schema-item ${schema.status}">
                <div class="schema-name">${schema.name}</div>
                <div class="schema-status">
                    <span class="status-indicator ${schema.status}"></span>
                    ${schema.status.charAt(0).toUpperCase() + schema.status.slice(1)}
                </div>
            </div>
        `).join('');
    }

    // Update conversion data
    updateConversionData(conversionData) {
        const funnelSteps = document.getElementById('funnelSteps');
        if (!funnelSteps) return;

        funnelSteps.innerHTML = conversionData.funnel.map(step => `
            <div class="funnel-step">
                <div class="step-title">${step.step}</div>
                <div class="step-count">${step.count.toLocaleString()}</div>
                <div class="step-rate">${step.rate}%</div>
            </div>
        `).join('');
    }

    // Update A/B tests
    updateABTests(abTestsData) {
        const testsGrid = document.getElementById('abTestsGrid');
        if (!testsGrid) return;

        testsGrid.innerHTML = abTestsData.map(test => `
            <div class="ab-test-card ${test.status}">
                <div class="test-header">
                    <h4>${test.name}</h4>
                    <span class="test-status ${test.status}">${test.status.toUpperCase()}</span>
                </div>
                <div class="test-metrics">
                    <div class="metric">
                        <span class="metric-value">${test.confidence}%</span>
                        <span class="metric-label">Confidence</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">+${test.lift}%</span>
                        <span class="metric-label">Lift</span>
                    </div>
                </div>
                <div class="test-actions">
                    <button class="btn-small" onclick="viewTestDetails('${test.id}')">View Details</button>
                    ${test.status === 'running' ? 
                        `<button class="btn-small btn-danger" onclick="stopTest('${test.id}')">Stop Test</button>` :
                        `<button class="btn-small btn-success" onclick="declareWinner('${test.id}')">Declare Winner</button>`
                    }
                </div>
            </div>
        `).join('');
    }

    // Setup real-time updates
    setupRealTimeUpdates() {
        // Update every 30 seconds
        this.updateIntervals.realTime = setInterval(() => {
            this.refreshCurrentTabData();
        }, config.intervals.realTime);

        // Update every 5 minutes
        this.updateIntervals.moderate = setInterval(() => {
            this.refreshModeratePriorityData();
        }, config.intervals.moderate);

        // Update every 15 minutes
        this.updateIntervals.slow = setInterval(() => {
            this.refreshLowPriorityData();
        }, config.intervals.slow);
    }

    // Initialize WebSocket connection
    initializeWebSocket() {
        try {
            this.socket = io(config.api.base);
            
            this.socket.on('connect', () => {
                console.log('🔌 WebSocket connected');
                this.showNotification('Real-time updates connected', 'success');
            });

            this.socket.on('disconnect', () => {
                console.log('🔌 WebSocket disconnected');
                this.showNotification('Real-time updates disconnected', 'warning');
            });

            this.socket.on('schema_update', (data) => {
                this.handleSchemaUpdate(data);
            });

            this.socket.on('conversion_update', (data) => {
                this.handleConversionUpdate(data);
            });

            this.socket.on('alert', (alert) => {
                this.handleAlert(alert);
            });
            
        } catch (error) {
            console.warn('WebSocket connection failed:', error);
        }
    }

    // Handle real-time schema updates
    handleSchemaUpdate(data) {
        console.log('📊 Schema update received:', data);
        this.updateSchemaStatus(data);
        this.updateLastUpdated();
    }

    // Handle real-time conversion updates
    handleConversionUpdate(data) {
        console.log('🎯 Conversion update received:', data);
        this.updateConversionData(data);
        this.updateLastUpdated();
    }

    // Handle alerts
    handleAlert(alert) {
        console.log('🚨 Alert received:', alert);
        this.showNotification(alert.message, alert.type);
        this.addToAlertsFeed(alert);
    }

    // Utility methods
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    updateChangeIndicator(id, value, type) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            element.className = `metric-change ${type}`;
        }
    }

    updateStatus(statusId, status) {
        const statusElement = document.getElementById(statusId);
        if (statusElement) {
            const dot = statusElement.querySelector('.status-dot');
            if (dot) {
                dot.className = `status-dot ${status}`;
            }
        }
    }

    updateLastUpdated() {
        const updateTime = document.getElementById('updateTime');
        if (updateTime) {
            updateTime.textContent = new Date().toLocaleTimeString();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            notification.remove();
        }, config.notifications.duration);
    }

    // Data refresh methods
    async refreshAllData() {
        this.showNotification('Refreshing all data...', 'info');
        await this.loadInitialData();
    }

    async refreshCurrentTabData() {
        await this.loadTabData(this.currentTab);
    }

    async refreshModeratePriorityData() {
        // Refresh conversion funnel, A/B tests
        console.log('🔄 Refreshing moderate priority data');
    }

    async refreshLowPriorityData() {
        // Refresh schema validation, rich results
        console.log('🔄 Refreshing low priority data');
    }

    // Cleanup
    destroy() {
        // Clear intervals
        Object.values(this.updateIntervals).forEach(interval => {
            clearInterval(interval);
        });
        
        // Disconnect WebSocket
        if (this.socket) {
            this.socket.disconnect();
        }
        
        // Destroy charts
        chartManager.destroyCharts();
        
        this.isInitialized = false;
    }
}

// Global functions for button callbacks
function createNewTest() {
    alert('🧪 Creating new A/B test... (Feature coming soon)');
}

function viewTestDetails(testId) {
    alert(`📊 Viewing details for test: ${testId}`);
}

function stopTest(testId) {
    if (confirm('Are you sure you want to stop this test?')) {
        alert(`⏹️ Stopping test: ${testId}`);
    }
}

function declareWinner(testId) {
    alert(`🏆 Declaring winner for test: ${testId}`);
}

// Initialize dashboard when DOM is ready
let dashboard;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dashboard = new Dashboard();
        dashboard.init();
    });
} else {
    dashboard = new Dashboard();
    dashboard.init();
}

// Export for global access
window.dashboard = dashboard;