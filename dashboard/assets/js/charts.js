// Chart Management
class ChartManager {
    constructor() {
        this.charts = {};
        this.defaultOptions = config.charts.options;
        this.colors = config.charts.colors;
    }

    // Initialize all charts
    initializeCharts() {
        this.createSchemaPerformanceChart();
        this.createConversionFunnelChart();
        this.createRichResultsChart();
    }

    // Schema Performance Trend Chart
    createSchemaPerformanceChart() {
        const ctx = document.getElementById('schemaPerformanceChart');
        if (!ctx) return;

        const data = {
            labels: this.getLast30Days(),
            datasets: [
                {
                    label: 'Valid Schemas',
                    data: this.generateTrendData(5, 7, 30),
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.success + '20',
                    tension: 0.4
                },
                {
                    label: 'Rich Results',
                    data: this.generateTrendData(20, 30, 30),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    tension: 0.4
                }
            ]
        };

        this.charts.schemaPerformance = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                ...this.defaultOptions,
                plugins: {
                    title: {
                        display: true,
                        text: 'Schema Performance Over Time'
                    }
                }
            }
        });
    }

    // Conversion Funnel Chart
    createConversionFunnelChart() {
        const ctx = document.getElementById('conversionFunnelChart');
        if (!ctx) return;

        const data = {
            labels: ['Visitors', 'Qualified Leads', 'Consultations', 'Customers'],
            datasets: [{
                label: 'Conversion Funnel',
                data: [8247, 412, 87, 23],
                backgroundColor: [
                    this.colors.info,
                    this.colors.warning,
                    this.colors.danger,
                    this.colors.success
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };

        this.charts.conversionFunnel = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                ...this.defaultOptions,
                plugins: {
                    title: {
                        display: true,
                        text: 'Current Conversion Funnel'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Rich Results Performance Chart
    createRichResultsChart() {
        const ctx = document.getElementById('richResultsChart');
        if (!ctx) return;

        const data = {
            labels: this.getLast30Days(),
            datasets: [
                {
                    label: 'Impressions',
                    data: this.generateTrendData(10000, 15000, 30),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    yAxisID: 'y'
                },
                {
                    label: 'Clicks',
                    data: this.generateTrendData(800, 1500, 30),
                    borderColor: this.colors.secondary,
                    backgroundColor: this.colors.secondary + '20',
                    yAxisID: 'y1'
                }
            ]
        };

        this.charts.richResults = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                ...this.defaultOptions,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Impressions'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Clicks'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Rich Results Performance Trend'
                    }
                }
            }
        });
    }

    // Update chart data
    updateChart(chartName, newData) {
        if (this.charts[chartName]) {
            this.charts[chartName].data = newData;
            this.charts[chartName].update();
        }
    }

    // Helper method to get last 30 days
    getLast30Days() {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return days;
    }

    // Generate trend data for testing
    generateTrendData(min, max, points) {
        const data = [];
        let current = min + (max - min) * 0.5;
        
        for (let i = 0; i < points; i++) {
            const variance = (Math.random() - 0.5) * (max - min) * 0.1;
            current = Math.max(min, Math.min(max, current + variance));
            data.push(Math.round(current));
        }
        
        return data;
    }

    // Destroy all charts
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Create global chart manager instance
const chartManager = new ChartManager();
window.chartManager = chartManager;