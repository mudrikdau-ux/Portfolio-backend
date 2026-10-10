/* =========================================================
   Resend Email API
   Sends emails through HTTPS instead of Gmail SMTP
   ========================================================= */

const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const transporter = {
    async sendMail(options) {
        if (!resend) {
            throw new Error(
                'RESEND_API_KEY is missing from the environment.'
            );
        }

        const from = process.env.RESEND_FROM;

        if (!from) {
            throw new Error(
                'RESEND_FROM is missing from the environment.'
            );
        }

        const payload = {
            from,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        if (options.replyTo) {
            payload.replyTo = options.replyTo;
        }

        if (options.text) {
            payload.text = options.text;
        }

        const { data, error } = await resend.emails.send(payload);

        if (error) {
            throw new Error(
                error.message || 'Resend failed to send the email.'
            );
        }

        console.log('[MAIL] Email accepted by Resend:', data.id);

        return {
            messageId: data.id
        };
    }
};

async function verifyMailer() {
    if (!process.env.RESEND_API_KEY) {
        console.error('[MAIL] RESEND_API_KEY is not configured.');
        return false;
    }

    if (!process.env.RESEND_FROM) {
        console.error('[MAIL] RESEND_FROM is not configured.');
        return false;
    }

    console.log('[MAIL] Resend API configured.');
    return true;
}

module.exports = {
    transporter,
    verifyMailer
};