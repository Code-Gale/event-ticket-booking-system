const express = require('express');
const { initializeEvent, bookTicket, cancelBooking, viewEventStatus } = require('../controllers/eventController');
const { generalLimiter, sensitiveLimiter } = require('../middleware/rateLimiter');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Initialize event with general rate limiter
router.post('/initialize', generalLimiter, initializeEvent);

// Book a ticket and cancel a booking with sensitive rate limiter
router.post('/book', sensitiveLimiter, protect, bookTicket);
router.post('/cancel', sensitiveLimiter, protect, cancelBooking);

// View event status with general rate limiter
router.get('/status/:eventId', generalLimiter, viewEventStatus);

module.exports = router;
