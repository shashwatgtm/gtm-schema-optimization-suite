// GTM Conversion Optimization Configuration
// Add this as a Custom HTML tag in your GTM container

(function() {
    'use strict';
    
    // Conversion Optimization System
    window.ConversionOptimizer = {
        config: {
            endpoint: '/api/conversion',
            abTests: {
                'hero-cta-test': {
                    variants: ['control', 'expert_strategy'],
                    traffic: 0.5,
                    pages: ['/'],
                    metric: 'consultation_booking'
                },
                'pricing-layout-test': {
                    variants: ['cards', 'table'],
                    traffic: 0.5,
                    pages: ['/services'],
                    metric: 'fractional_cmo'
                }
            },
            funnelSteps: {
                'page_view': { step: 1, value: null },
                'scroll_50': { step: 2, value: 50 },
                'form_start': { step: 3, value: null },
                'form_submit': { step: 4, value: null },
                'consultation_booking': { step: 5, value: 8000 },
                'fractional_cmo': { step: 5, value: 12000 }
            }
        },
        
        // Initialize optimization system
        init: function() {
            console.log('🎯 Conversion Optimizer initialized');
            
            this.recordPageStart();
            this.initializeABTests();
            this.setupFunnelTracking();
            this.setupAttributionTracking();
            this.setupAdvancedTracking();
        },
        
        // Record page start time
        recordPageStart: function() {
            window.pageStartTime = Date.now();
            this.recordTouchPoint();
        },
        
        // Initialize A/B tests
        initializeABTests: function() {
            Object.keys(this.config.abTests).forEach(testId => {
                const test = this.config.abTests[testId];
                
                if (this.shouldRunTest(test)) {
                    const variant = this.assignVariant(testId, test);
                    this.trackTestExposure(testId, variant);
                    this.applyVariant(testId, variant);
                }
            });
        },
        
        // Check if test should run on current page
        shouldRunTest: function(test) {
            const currentPath = window.location.pathname;
            return test.pages.some(page => {
                return page === '*' || currentPath === page || currentPath.startsWith(page);
            });
        },
        
        // Assign user to test variant
        assignVariant: function(testId, test) {
            const userId = this.getUserId();
            const hash = this.hashCode(userId + testId);
            const normalized = Math.abs(hash) / Math.pow(2, 31);
            
            return normalized < test.traffic ? test.variants[0] : test.variants[1];
        },
        
        // Track A/B test exposure
        trackTestExposure: function(testId, variant) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'ab_test_exposure',
                'test_id': testId,
                'test_variant': variant,
                'user_id': this.getUserId(),
                'page_url': window.location.href,
                'timestamp': new Date().toISOString()
            });
        },
        
        // Apply variant changes
        applyVariant: function(testId, variant) {
            switch(testId) {
                case 'hero-cta-test':
                    if (variant === 'expert_strategy') {
                        const ctaButton = document.querySelector('.hero-cta, .cta-primary');
                        if (ctaButton) {
                            ctaButton.textContent = 'Get Expert GTM Strategy';
                            ctaButton.classList.add('variant-expert-strategy');
                        }
                    }
                    break;
                    
                case 'pricing-layout-test':
                    if (variant === 'table') {
                        const pricingSection = document.querySelector('.pricing-section');
                        if (pricingSection) {
                            pricingSection.classList.add('table-layout');
                        }
                    }
                    break;
            }
        },
        
        // Setup funnel tracking
        setupFunnelTracking: function() {
            // Track page view
            this.trackFunnelStep('page_view', 1);
            
            // Setup scroll tracking
            this.setupScrollTracking();
            
            // Setup form tracking
            this.setupFormTracking();
            
            // Setup CTA tracking
            this.setupCTATracking();
            
            // Setup exit intent
            this.setupExitIntentTracking();
        },
        
        // Track funnel step
        trackFunnelStep: function(stepName, stepNumber, value = null) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'funnel_step',
                'funnel_name': 'consultation_booking',
                'step_name': stepName,
                'step_number': stepNumber,
                'step_value': value,
                'user_id': this.getUserId(),
                'timestamp': new Date().toISOString(),
                'page_url': window.location.href
            });
        },
        
        // Setup scroll tracking
        setupScrollTracking: function() {
            let maxScroll = 0;
            const milestones = [25, 50, 75, 90];
            const tracked = {};
            
            window.addEventListener('scroll', () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    
                    milestones.forEach(milestone => {
                        if (scrollPercent >= milestone && !tracked[milestone]) {
                            tracked[milestone] = true;
                            this.trackFunnelStep(`scroll_${milestone}`, 2, milestone);
                        }
                    });
                }
            });
        },
        
        // Setup form tracking
        setupFormTracking: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Track form starts
                form.addEventListener('focusin', () => {
                    if (!form.dataset.tracked) {
                        form.dataset.tracked = 'true';
                        this.trackFunnelStep('form_start', 3, form.id || 'unknown_form');
                    }
                });
                
                // Track form submissions
                form.addEventListener('submit', (e) => {
                    this.trackFunnelStep('form_submit', 4, form.id || 'unknown_form');
                });
            });
        },
        
        // Setup CTA tracking
        setupCTATracking: function() {
            const ctaSelectors = [
                '.cta-button',
                '.btn-primary',
                '[data-cta]',
                'a[href*="consultation"]',
                'a[href*="contact"]',
                'button[type="submit"]'
            ];
            
            ctaSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.addEventListener('click', (e) => {
                        const ctaText = element.textContent.trim();
                        const ctaType = element.dataset.cta || 'unknown';
                        
                        this.trackFunnelStep('cta_click', 5, `${ctaType}_${ctaText}`);
                        
                        // Check for A/B test conversions
                        this.checkABTestConversion(element);
                    });
                });
            });
        },
        
        // Check for A/B test conversion
        checkABTestConversion: function(element) {
            // Determine conversion type based on element
            let conversionType = null;
            
            if (element.textContent.toLowerCase().includes('consultation') ||
                element.href?.includes('consultation')) {
                conversionType = 'consultation_booking';
            } else if (element.textContent.toLowerCase().includes('cmo') ||
                       element.href?.includes('fractional')) {
                conversionType = 'fractional_cmo';
            }
            
            if (conversionType) {
                // Track A/B test conversion
                Object.keys(this.config.abTests).forEach(testId => {
                    const test = this.config.abTests[testId];
                    if (test.metric === conversionType) {
                        const variant = this.getActiveVariant(testId);
                        if (variant) {
                            this.trackABTestConversion(testId, variant, conversionType);
                        }
                    }
                });
            }
        },
        
        // Track A/B test conversion
        trackABTestConversion: function(testId, variant, conversionType) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'ab_test_conversion',
                'test_id': testId,
                'test_variant': variant,
                'conversion_type': conversionType,
                'conversion_value': this.config.funnelSteps[conversionType]?.value || 0,
                'user_id': this.getUserId(),
                'timestamp': new Date().toISOString()
            });
        },
        
        // Setup exit intent tracking
        setupExitIntentTracking: function() {
            let exitIntentTriggered = false;
            
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY <= 0 && !exitIntentTriggered) {
                    exitIntentTriggered = true;
                    this.trackFunnelAbandonment('exit_intent', 'mouse_leave');
                }
            });
        },
        
        // Track funnel abandonment
        trackFunnelAbandonment: function(stepName, reason) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'funnel_abandonment',
                'abandoned_step': stepName,
                'abandonment_reason': reason,
                'time_spent': this.getTimeSpent(),
                'scroll_depth': this.getScrollDepth(),
                'timestamp': new Date().toISOString()
            });
        },
        
        // Setup attribution tracking
        setupAttributionTracking: function() {
            this.recordTouchPoint();
        },
        
        // Record touch point
        recordTouchPoint: function() {
            const currentTouch = this.getCurrentTouch();
            const journeyData = JSON.parse(localStorage.getItem('customer_journey') || '[]');
            
            // Don't record duplicate consecutive touch points
            const lastTouch = journeyData[journeyData.length - 1];
            if (!lastTouch || 
                lastTouch.source !== currentTouch.source || 
                lastTouch.medium !== currentTouch.medium) {
                
                journeyData.push(currentTouch);
                localStorage.setItem('customer_journey', JSON.stringify(journeyData));
            }
        },
        
        // Get current touch point
        getCurrentTouch: function() {
            const urlParams = new URLSearchParams(window.location.search);
            
            return {
                source: urlParams.get('utm_source') || this.getSourceFromReferrer(),
                medium: urlParams.get('utm_medium') || this.getMediumFromReferrer(),
                campaign: urlParams.get('utm_campaign') || 'none',
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            };
        },
        
        // Get source from referrer
        getSourceFromReferrer: function() {
            const referrer = document.referrer.toLowerCase();
            
            if (referrer.includes('google')) return 'google';
            if (referrer.includes('linkedin')) return 'linkedin';
            if (referrer.includes('twitter')) return 'twitter';
            if (referrer.includes('facebook')) return 'facebook';
            if (referrer) return 'referral';
            
            return 'direct';
        },
        
        // Get medium from referrer
        getMediumFromReferrer: function() {
            const referrer = document.referrer.toLowerCase();
            
            if (referrer.includes('google') && !referrer.includes('ads')) return 'organic';
            if (referrer.includes('linkedin') || 
                referrer.includes('twitter') || 
                referrer.includes('facebook')) return 'social';
            if (referrer) return 'referral';
            
            return 'none';
        },
        
        // Setup advanced tracking
        setupAdvancedTracking: function() {
            // Track performance metrics
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.trackPerformanceMetrics();
                }, 1000);
            });
            
            // Track user engagement
            this.trackEngagement();
        },
        
        // Track performance metrics
        trackPerformanceMetrics: function() {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'page_performance',
                    'load_time': Math.round(perfData.loadEventEnd - perfData.fetchStart),
                    'dom_ready': Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                    'timestamp': new Date().toISOString()
                });
            }
        },
        
        // Track engagement
        trackEngagement: function() {
            const milestones = [30, 60, 120, 300]; // seconds
            
            milestones.forEach(milestone => {
                setTimeout(() => {
                    if (document.visibilityState === 'visible') {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            'event': 'user_engagement',
                            'engagement_type': 'time_milestone',
                            'engagement_duration': milestone,
                            'timestamp': new Date().toISOString()
                        });
                    }
                }, milestone * 1000);
            });
        },
        
        // Utility functions
        getUserId: function() {
            let userId = localStorage.getItem('optimization_user_id');
            if (!userId) {
                userId = 'user_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('optimization_user_id', userId);
            }
            return userId;
        },
        
        getActiveVariant: function(testId) {
            return localStorage.getItem(`ab_test_${testId}_variant`);
        },
        
        getTimeSpent: function() {
            return Math.round((Date.now() - (window.pageStartTime || Date.now())) / 1000);
        },
        
        getScrollDepth: function() {
            return Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
        },
        
        hashCode: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.ConversionOptimizer.init();
        });
    } else {
        window.ConversionOptimizer.init();
    }
    
})();