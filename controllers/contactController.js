/* =========================================================
   Contact Controller
   Handles POST /api/contact
   ========================================================= */

const { pool } = require('../config/db');
const { transporter } = require('../config/mailer');
const adminNotification = require('../templates/admin-notification');
const userWelcome = require('../templates/user-welcome');
const userThankYou = require('../templates/user-thankyou');

/* ---------- Validators ---------- */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function clean(str, maxLen) {
    return String(str || '').trim().slice(0, maxLen);
}

/* ---------- Log email sending to DB ---------- */
async function logEmail({ contactId, recipient, type, status, error }) {
    try {
        await pool.execute(
            `INSERT INTO email_log (contact_id, recipient, type, status, error)
             VALUES (?, ?, ?, ?, ?)`,
            [contactId || null, recipient, type, status, error || null]
        );
    } catch (err) {
        console.error('[logEmail] Failed:', err.message);
    }
}

/* =========================================================
   POST /api/contact
   ========================================================= */
async function submitContact(req, res) {
    const name = clean(req.body.name, 120);
    const email = clean(req.body.email, 180).toLowerCase();
    const subject = clean(req.body.subject, 200);
    const message = clean(req.body.message, 5000);

    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
    const userAgent = clean(req.headers['user-agent'], 255);

    /* ---------- Validate ---------- */
    const errors = {};
    if (!name || name.length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!isValidEmail(email)) errors.email = 'Please provide a valid email.';
    if (!subject || subject.length < 3) errors.subject = 'Subject must be at least 3 characters.';
    if (!message || message.length < 10) errors.message = 'Message must be at least 10 characters.';

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            ok: false,
            message: 'Validation failed.',
            errors
        });
    }

    try {
        /* ---------- 1) Is this email already in our DB? ---------- */
        const [rows] = await pool.execute(
            'SELECT id FROM contacts WHERE email = ? LIMIT 1',
            [email]
        );
        const isFirstTime = rows.length === 0;

        /* ---------- 2) Save to MySQL ---------- */
        const [insertResult] = await pool.execute(
            `INSERT INTO contacts
                (name, email, subject, message, ip_address, user_agent, is_first_time)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, subject, message, ip, userAgent, isFirstTime ? 1 : 0]
        );
        const contactId = insertResult.insertId;

        /* ---------- 3) Send email to admin (you) ---------- */
        let emailSent = 0;
        try {
            const { subject: subj, html } = adminNotification({
                name, email, subject, message, ip,
                createdAt: new Date().toISOString()
            });

            await transporter.sendMail({
                from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
                to: process.env.MAIL_TO,
                replyTo: `"${name}" <${email}>`,
                subject: subj,
                html
            });

            emailSent = 1;
            await logEmail({
                contactId, recipient: process.env.MAIL_TO,
                type: 'admin', status: 'sent'
            });
        } catch (err) {
            console.error('[Contact] Admin email failed:', err.message);
            await logEmail({
                contactId, recipient: process.env.MAIL_TO,
                type: 'admin', status: 'failed', error: err.message
            });
        }

        /* ---------- 4) Send auto-reply to user ---------- */
        let autoReplySent = 0;
        try {
            const template = isFirstTime
                ? userWelcome({ name, subject, message })
                : userThankYou({ name, subject, message });

            await transporter.sendMail({
                from: `"Mudrik Dau" <${process.env.MAIL_USER}>`,
                to: email,
                subject: template.subject,
                html: template.html
            });

            autoReplySent = 1;
            await logEmail({
                contactId, recipient: email,
                type: isFirstTime ? 'welcome' : 'thankyou',
                status: 'sent'
            });
        } catch (err) {
            console.error('[Contact] Auto-reply failed:', err.message);
            await logEmail({
                contactId, recipient: email,
                type: isFirstTime ? 'welcome' : 'thankyou',
                status: 'failed', error: err.message
            });
        }

        /* ---------- 5) Update contact record ---------- */
        await pool.execute(
            `UPDATE contacts SET email_sent = ?, auto_reply_sent = ? WHERE id = ?`,
            [emailSent, autoReplySent, contactId]
        );

        /* ---------- 6) Respond ---------- */
        return res.status(200).json({
            ok: true,
            message: isFirstTime
                ? 'Your message was sent! Welcome — check your inbox for a confirmation.'
                : 'Your message was sent! Thanks for reaching out again.',
            data: {
                id: contactId,
                isFirstTime,
                emailSent: !!emailSent,
                autoReplySent: !!autoReplySent
            }
        });

    } catch (err) {
        console.error('[Contact] Submit error:', err);
        return res.status(500).json({
            ok: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
}

module.exports = { submitContact };