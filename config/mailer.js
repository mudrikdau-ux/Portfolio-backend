/* =========================================================
   Nodemailer Transport (Gmail SMTP)
   ========================================================= */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

async function verifyMailer() {
    try {
        await transporter.verify();
        console.log('[MAIL] SMTP connection OK');
        return true;
    } catch (err) {
        console.error('[MAIL] SMTP verify failed:', err.message);
        return false;
    }
}

module.exports = { transporter, verifyMailer };