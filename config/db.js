/* =========================================================
   MySQL Connection Pool
   ========================================================= */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
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
});

async function testConnection() {
    try {
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();
        console.log('[DB] MySQL connection OK');
        return true;
    } catch (err) {
        console.error('[DB] Connection failed:', err.message);
        return false;
    }
}

module.exports = { pool, testConnection };