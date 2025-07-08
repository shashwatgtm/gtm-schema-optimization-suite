// GTM Schema Performance Monitoring Configuration
// Add this as a Custom HTML tag in your GTM container

(function() {
    'use strict';
    
    // Schema Performance Monitoring System
    window.SchemaMonitor = {
        config: {
            endpoint: '/api/schema',
            validationInterval: 900000, // 15 minutes
            alertThresholds: {
                errorCount: 1,
                warningCount: 3,
                performanceDrop: 0.15 // 15%
            }
        },
        
        // Initialize monitoring
        init: function() {
            console.log('🔍 Schema Monitor initialized');
            this.validateOnLoad();
            this.setupPeriodicValidation();
            this.trackSchemaChanges();
            this.setupSearchConsoleIntegration();
        },
        
        // Validate schemas on page load
        validateOnLoad: function() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.performValidation(), 2000);
                });
            } else {
                setTimeout(() => this.performValidation(), 2000);
            }
        },
        
        // Setup periodic validation
        setupPeriodicValidation: function() {
            setInterval(() => {
                this.performValidation();
            }, this.config.validationInterval);
        },
        
        // Perform schema validation
        performValidation: function() {
            const schemas = this.extractSchemas();
            const results = this.validateSchemas(schemas);
            
            // Send to GA4
            this.trackValidationResults(results);
            
            // Check for alerts
            this.checkAlerts(results);
            
            // Send to backend
            this.sendToBackend(results);
        },
        
        // Extract all schemas from page
        extractSchemas: function() {
            const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
            const schemas = [];
            
            schemaScripts.forEach((script, index) => {
                try {
                    const data = JSON.parse(script.textContent);
                    schemas.push({
                        index: index,
                        type: data['@type'] || 'Unknown',
                        data: data,
                        element: script
                    });
                } catch (error) {
                    schemas.push({
                        index: index,
                        type: 'Invalid',
                        error: error.message,
                        element: script
                    });
                }
            });
            
            return schemas;
        },
        
        // Validate schema structure
        validateSchemas: function(schemas) {
            const results = {
                total: schemas.length,
                valid: 0,
                warnings: 0,
                errors: 0,
                schemas: []
            };
            
            schemas.forEach(schema => {
                const validation = this.validateSingleSchema(schema);
                results.schemas.push(validation);
                
                if (validation.isValid && validation.warnings.length === 0) {
                    results.valid++;
                } else if (validation.isValid && validation.warnings.length > 0) {
                    results.warnings++;
                } else {
                    results.errors++;
                }
            });
            
            return results;
        },
        
        // Validate single schema
        validateSingleSchema: function(schema) {
            const errors = [];
            const warnings = [];
            
            if (schema.error) {
                errors.push(schema.error);
                return {
                    type: schema.type,
                    isValid: false,
                    errors: errors,
                    warnings: warnings
                };
            }
            
            const data = schema.data;
            
            // Basic validation
            if (!data['@context']) errors.push('Missing @context');
            if (!data['@type']) errors.push('Missing @type');
            
            // Type-specific validation
            switch (data['@type']) {
                case 'Person':
                    this.validatePerson(data, errors, warnings);
                    break;
                case 'Organization':
                    this.validateOrganization(data, errors, warnings);
                    break;
                case 'Service':
                    this.validateService(data, errors, warnings);
                    break;
                case 'FAQPage':
                    this.validateFAQPage(data, errors, warnings);
                    break;
                case 'Review':
                    this.validateReview(data, errors, warnings);
                    break;
            }
            
            return {
                type: data['@type'],
                isValid: errors.length === 0,
                errors: errors,
                warnings: warnings
            };
        },
        
        // Person schema validation
        validatePerson: function(data, errors, warnings) {
            if (!data.name) errors.push('Person missing name');
            if (!data.jobTitle) warnings.push('Person missing jobTitle');
            if (!data.worksFor) warnings.push('Person missing worksFor');
            
            if (data.aggregateRating) {
                if (!data.aggregateRating.ratingValue) {
                    errors.push('AggregateRating missing ratingValue');
                }
                if (!data.aggregateRating.reviewCount) {
                    warnings.push('AggregateRating missing reviewCount');
                }
            }
        },
        
        // Organization schema validation
        validateOrganization: function(data, errors, warnings) {
            if (!data.name) errors.push('Organization missing name');
            if (!data.url) warnings.push('Organization missing URL');
            if (!data.logo) warnings.push('Organization missing logo');
            if (!data.contactPoint) warnings.push('Organization missing contactPoint');
        },
        
        // Service schema validation
        validateService: function(data, errors, warnings) {
            if (!data.name) errors.push('Service missing name');
            if (!data.provider) warnings.push('Service missing provider');
            if (!data.description) warnings.push('Service missing description');
        },
        
        // FAQ schema validation
        validateFAQPage: function(data, errors, warnings) {
            if (!data.mainEntity || !Array.isArray(data.mainEntity)) {
                errors.push('FAQPage missing mainEntity array');
                return;
            }
            
            const questions = new Set();
            data.mainEntity.forEach((item, index) => {
                if (!item.name) errors.push(`FAQ item ${index} missing question`);
                if (!item.acceptedAnswer) errors.push(`FAQ item ${index} missing answer`);
                
                if (item.name && questions.has(item.name)) {
                    warnings.push(`Duplicate question: "${item.name}"`);
                }
                questions.add(item.name);
            });
        },
        
        // Review schema validation
        validateReview: function(data, errors, warnings) {
            if (!data.itemReviewed) errors.push('Review missing itemReviewed');
            if (!data.reviewRating) errors.push('Review missing reviewRating');
            if (!data.author) errors.push('Review missing author');
            if (!data.datePublished) errors.push('Review missing datePublished');
        },
        
        // Track validation results in GA4
        trackValidationResults: function(results) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'schema_validation_complete',
                'schema_total': results.total,
                'schema_valid': results.valid,
                'schema_warnings': results.warnings,
                'schema_errors': results.errors,
                'page_url': window.location.href,
                'timestamp': new Date().toISOString()
            });
            
            // Track individual schema types
            results.schemas.forEach(schema => {
                window.dataLayer.push({
                    'event': 'schema_type_validation',
                    'schema_type': schema.type,
                    'schema_valid': schema.isValid,
                    'schema_error_count': schema.errors.length,
                    'schema_warning_count': schema.warnings.length
                });
            });
        },
        
        // Check for alerts
        checkAlerts: function(results) {
            if (results.errors >= this.config.alertThresholds.errorCount) {
                this.sendAlert('error', 'Schema Validation Errors', 
                    `${results.errors} schema validation errors detected`);
            }
            
            if (results.warnings >= this.config.alertThresholds.warningCount) {
                this.sendAlert('warning', 'Schema Validation Warnings', 
                    `${results.warnings} schema validation warnings detected`);
            }
        },
        
        // Send alert
        sendAlert: function(type, title, message) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'schema_alert',
                'alert_type': type,
                'alert_title': title,
                'alert_message': message,
                'timestamp': new Date().toISOString()
            });
            
            // Send to backend
            if (typeof fetch !== 'undefined') {
                fetch('/api/alerts/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: type,
                        title: title,
                        message: message,
                        source: 'schema_monitor'
                    })
                }).catch(error => {
                    console.warn('Failed to send alert to backend:', error);
                });
            }
        },
        
        // Send results to backend
        sendToBackend: function(results) {
            if (typeof fetch !== 'undefined') {
                fetch('/api/schema/validation-results', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        results: results,
                        url: window.location.href,
                        timestamp: new Date().toISOString()
                    })
                }).catch(error => {
                    console.warn('Failed to send validation results to backend:', error);
                });
            }
        },
        
        // Track schema changes
        trackSchemaChanges: function() {
            const observer = new MutationObserver((mutations) => {
                let schemaChanged = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const addedNodes = Array.from(mutation.addedNodes);
                        const removedNodes = Array.from(mutation.removedNodes);
                        
                        [...addedNodes, ...removedNodes].forEach(node => {
                            if (node.tagName === 'SCRIPT' && 
                                node.type === 'application/ld+json') {
                                schemaChanged = true;
                            }
                        });
                    }
                });
                
                if (schemaChanged) {
                    console.log('🔄 Schema change detected, re-validating...');
                    setTimeout(() => this.performValidation(), 1000);
                }
            });
            
            observer.observe(document.head, { childList: true, subtree: true });
            observer.observe(document.body, { childList: true, subtree: true });
        },
        
        // Setup Search Console integration (placeholder)
        setupSearchConsoleIntegration: function() {
            // This would require server-side integration with Search Console API
            console.log('🔍 Search Console integration ready');
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.SchemaMonitor.init();
        });
    } else {
        window.SchemaMonitor.init();
    }
    
})();

// GTM Custom Variables
// Create these variables in your GTM container:

// Variable Name: Schema Types Active
// Variable Type: Custom JavaScript
function() {
    const schemas = document.querySelectorAll('script[type="application/ld+json"]');
    const types = [];
    
    schemas.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            if (data['@type']) {
                types.push(data['@type']);
            }
        } catch (e) {
            // Invalid JSON
        }
    });
    
    return types.join(',');
}

// Variable Name: Schema Validation Status
// Variable Type: Custom JavaScript
function() {
    if (window.SchemaMonitor && window.SchemaMonitor.lastValidationResults) {
        const results = window.SchemaMonitor.lastValidationResults;
        return results.valid + '/' + results.total;
    }
    return 'unknown';
}

// Variable Name: Rich Results Status
// Variable Type: Custom JavaScript
function() {
    const schemas = document.querySelectorAll('script[type="application/ld+json"]');
    return schemas.length > 0 ? 'active' : 'inactive';
}