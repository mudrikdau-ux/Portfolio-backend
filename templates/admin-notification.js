/* =========================================================
   Email Template: Notification to Admin (You)
   ========================================================= */

function adminNotification({ name, email, subject, message, ip, createdAt }) {
    const safe = (s) => String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0e1a;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#101524;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);border:1px solid #1a2135;">

                    <!-- Header -->
                    <tr>
                        <td style="padding:0;background:linear-gradient(135deg,#00e5ff 0%,#0077ff 60%,#a855f7 100%);">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding:32px 32px 24px;text-align:center;">
                                        <div style="display:inline-block;width:56px;height:56px;border-radius:14px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);line-height:56px;font-size:24px;font-weight:800;color:#ffffff;">D</div>
                                        <h1 style="margin:16px 0 4px;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.02em;">New Contact Message</h1>
                                        <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;">From your portfolio contact form</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 22px;color:#b8c0d4;font-size:15px;line-height:1.6;">
                                You received a new message from your portfolio. Here are the details:
                            </p>

                            <!-- Sender card -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#161c2e;border:1px solid #232b40;border-radius:12px;margin-bottom:20px;">
                                <tr>
                                    <td style="padding:18px 22px;">
                                        <p style="margin:0 0 4px;color:#00e5ff;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">From</p>
                                        <p style="margin:0 0 2px;color:#f5f7fa;font-size:16px;font-weight:700;">${safe(name)}</p>
                                        <p style="margin:0;color:#8a93ad;font-size:13px;">
                                            <a href="mailto:${safe(email)}" style="color:#00e5ff;text-decoration:none;">${safe(email)}</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Subject -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#161c2e;border:1px solid #232b40;border-radius:12px;margin-bottom:20px;">
                                <tr>
                                    <td style="padding:18px 22px;">
                                        <p style="margin:0 0 4px;color:#a855f7;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Subject</p>
                                        <p style="margin:0;color:#f5f7fa;font-size:15px;font-weight:600;">${safe(subject)}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#161c2e;border:1px solid #232b40;border-radius:12px;margin-bottom:24px;">
                                <tr>
                                    <td style="padding:22px;">
                                        <p style="margin:0 0 12px;color:#22e07a;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Message</p>
                                        <p style="margin:0;color:#d1d7e3;font-size:15px;line-height:1.75;white-space:pre-wrap;">${safe(message)}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Reply CTA -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding:8px 0 4px;">
                                        <a href="mailto:${safe(email)}?subject=Re:%20${encodeURIComponent(subject)}"
                                           style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#00e5ff,#0077ff);color:#0a0e1a;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;letter-spacing:0.02em;">
                                            Reply to ${safe(name)}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:26px 0 0;padding-top:20px;border-top:1px solid #232b40;color:#5a6382;font-size:12px;line-height:1.6;">
                                <strong style="color:#8a93ad;">Metadata:</strong><br />
                                IP: ${safe(ip || 'unknown')} &nbsp;·&nbsp; Received: ${safe(createdAt || new Date().toISOString())}
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:22px 32px;background:#0e131f;border-top:1px solid #1a2135;text-align:center;">
                            <p style="margin:0;color:#5a6382;font-size:12px;">
                                © ${new Date().getFullYear()} Mudrik Dau · Portfolio Backend
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    return {
        subject: `📩 New message from ${name} — ${subject}`,
        html
    };
}

module.exports = adminNotification;