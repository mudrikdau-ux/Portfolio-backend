/* =========================================================
   Contact Route
   ========================================================= */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

/* ---------- Rate limit: max 5 submissions per 15 min per IP ---------- */
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        message: 'Too many messages sent. Please try again in 15 minutes.'
    }
});

/* ---------- POST /api/contact ---------- */
router.post('/', contactLimiter, submitContact);

module.exports = router;