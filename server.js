/* =========================================================
   Mudrik Dau Portfolio - Backend Server
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

/* ---------- Trust Proxy ---------- */

app.set('trust proxy', 1);

/* ---------- Security Middleware ---------- */

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: 'cross-origin'
        }
    })
);

/* ---------- CORS Configuration ---------- */

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header,
            // such as Postman and server-side requests.
            if (!origin) {
                return callback(null, true);
            }

            // Allow configured website origins.
            if (
                allowedOrigins.length === 0 ||
                allowedOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            // Allow localhost during development only.
            if (
                process.env.NODE_ENV !== 'production' &&
                /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
            ) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    })
);

/* ---------- Request Parsing ---------- */

app.use(
    express.json({
        limit: '100kb'
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: '100kb'
    })
);

/* ---------- Request Logging ---------- */

app.use(
    morgan(
        process.env.NODE_ENV === 'production'
            ? 'combined'
            : 'dev'
    )
);

/* ---------- Root Route ---------- */

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'Mudrik Dau Portfolio Backend - running',
        endpoints: {
            health: 'GET /api/health',
            contact: 'POST /api/contact'
        }
    });
});

/* ---------- Health Check ---------- */

// Respond immediately so Render can check the HTTP service
// without waiting for MySQL or SMTP connection checks.
app.get('/api/health', (req, res) => {
    res.status(200).json({
        ok: true,
        service: 'Mudrik Dau Portfolio Backend',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

/* ---------- Contact Routes ---------- */

app.use('/api/contact', contactRoutes);

/* ---------- 404 Handler ---------- */

app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: 'Route not found.'
    });
});

/* ---------- Error Handler ---------- */

app.use((err, req, res, next) => {
    console.error('[Error]', err.message);

    res.status(err.status || 500).json({
        ok: false,
        message: err.message || 'Internal server error.'
    });
});

/* ---------- Server Startup ---------- */

async function start() {
    console.log('\n=======================================');
    console.log('  Mudrik Dau Portfolio - Backend');
    console.log('=======================================\n');

    // Start the HTTP server without waiting for external services.
    const server = app.listen(PORT, () => {
        console.log(`\n[SERVER] Listening on port ${PORT}`);

        console.log(
            `[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`
        );

        console.log(
            `[SERVER] Allowed origins: ${
                allowedOrigins.join(', ') || '(any)'
            }`
        );

        console.log('\nEndpoints:');
        console.log('  GET   /');
        console.log('  GET   /api/health');
        console.log('  POST  /api/contact\n');
    });

    server.on('error', (err) => {
        console.error('[SERVER] Failed to start:', err.message);
        process.exitCode = 1;
    });

    // Test MySQL in the background.
    // Database failures will not block the HTTP health check.
    testConnection().catch((err) => {
        console.error(
            '[DB] Unexpected connection check error:',
            err.message
        );
    });

    // Verify SMTP in the background.
    // SMTP failures will not block server startup.
    verifyMailer().catch((err) => {
        console.error(
            '[MAIL] Unexpected verification error:',
            err.message
        );
    });
}

/* ---------- Start Application ---------- */

start().catch((err) => {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
});