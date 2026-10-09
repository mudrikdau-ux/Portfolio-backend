/* =========================================================
   MySQL Connection Pool
   Supports local MySQL and secure Aiven MySQL connections
   ========================================================= */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dau_portfolio',

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: 'Z'
};

/*
 * Enable SSL for the online Aiven database.
 * Local development can continue using a local MySQL server.
 */
if (process.env.DB_SSL === 'true') {
    const caPath = process.env.DB_CA_PATH
        ? path.resolve(process.env.DB_CA_PATH)
        : path.join(__dirname, '..', 'certs', 'ca.pem');

    if (!fs.existsSync(caPath)) {
        throw new Error(
            `MySQL CA certificate not found at: ${caPath}`
        );
    }

    dbConfig.ssl = {
        ca: fs.readFileSync(caPath, 'utf8'),
        rejectUnauthorized: true
    };
}

const pool = mysql.createPool(dbConfig);

async function testConnection() {
    let conn;

    try {
        conn = await pool.getConnection();
        await conn.ping();

        console.log('[DB] MySQL connection OK');
        console.log(
            `[DB] Connection mode: ${
                process.env.DB_SSL === 'true'
                    ? 'SSL enabled'
                    : 'SSL disabled'
            }`
        );

        return true;
    } catch (err) {
        console.error('[DB] Connection failed:', err.message);
        return false;
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

module.exports = { pool, testConnection };