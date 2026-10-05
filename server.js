/* =========================================================
   Mudrik Dau Portfolio — Backend Server
   ========================================================= */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { testConnection } = require('./config/db');
const { verifyMailer } = require('./config/mailer');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

/* ---------- Middleware ---------- */
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, same-origin)
        if (!origin) return callback(null, true);

        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow localhost on any port during development
        if (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/* ---------- Routes ---------- */
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Mudrik Dau Portfolio Backend — running',
        endpoints: {
            health: 'GET /api/health',
            contact: 'POST /api/contact'
        }
    });
});

app.get('/api/health', async (req, res) => {
    const dbOk = await testConnection();
    const mailOk = await verifyMailer();
    res.json({
        ok: dbOk && mailOk,
        database: dbOk ? 'connected' : 'failed',
        mailer: mailOk ? 'connected' : 'failed',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/contact', contactRoutes);

/* ---------- 404 ---------- */
app.use((req, res) => {
    res.status(404).json({ ok: false, message: 'Route not found.' });
});

/* ---------- Error handler ---------- */
app.use((err, req, res, next) => {
    console.error('[Error]', err.message);
    res.status(err.status || 500).json({
        ok: false,
        message: err.message || 'Internal server error.'
    });
});

/* ---------- Boot ---------- */
async function start() {
    console.log('\n=======================================');
    console.log('  Mudrik Dau Portfolio — Backend');
    console.log('=======================================\n');

    await testConnection();
    await verifyMailer();

    app.listen(PORT, () => {
        console.log(`\n[SERVER] Listening on http://localhost:${PORT}`);
        console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`[SERVER] Allowed origins: ${allowedOrigins.join(', ') || '(any)'}`);
        console.log('\nEndpoints:');
        console.log(`  GET   http://localhost:${PORT}/api/health`);
        console.log(`  POST  http://localhost:${PORT}/api/contact\n`);
    });
}

start().catch((err) => {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
});