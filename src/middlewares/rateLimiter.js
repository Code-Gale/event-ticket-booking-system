const rateLimit = require('express-rate-limit');

// General rate limiter (e.g., 100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Too many requests, please try again later.',
});

// Stricter limiter for sensitive routes since it's a ticketing api(e.g., 10 requests per minute)
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many attempts, please slow down.',
});

module.exports = { generalLimiter, sensitiveLimiter };
