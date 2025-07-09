// Simple rate limiter middleware without external dependencies
const rateLimitStore = new Map();

const rateLimitMiddleware = (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const limit = 100; // 100 requests per minute
    
    // Clean old entries
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now - data.resetTime > windowMs) {
            rateLimitStore.delete(ip);
        }
    }
    
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now
        });
        return next();
    }
    
    const userData = rateLimitStore.get(key);
    
    if (now - userData.resetTime > windowMs) {
        userData.count = 1;
        userData.resetTime = now;
        return next();
    }
    
    if (userData.count >= limit) {
        return res.status(429).json({
            success: false,
            error: 'Too Many Requests',
            retryAfter: Math.ceil((windowMs - (now - userData.resetTime)) / 1000),
            timestamp: new Date().toISOString()
        });
    }
    
    userData.count++;
    next();
};

module.exports = rateLimitMiddleware;