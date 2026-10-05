/* =========================================================
   Email Template: Welcome (First-time sender)
   ========================================================= */

function userWelcome({ name, subject, message }) {
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
    <title>Thanks for reaching out!</title>
</head>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0e1a;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#101524;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);border:1px solid #1a2135;">

                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#00e5ff 0%,#0077ff 60%,#a855f7 100%);padding:40px 32px 30px;text-align:center;">
                            <div style="display:inline-block;width:64px;height:64px;border-radius:18px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);line-height:64px;font-size:28px;font-weight:800;color:#ffffff;">👋</div>
                            <h1 style="margin:20px 0 6px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.02em;">Welcome, ${safe(name)}!</h1>
                            <p style="margin:0;color:rgba(255,255,255,0.9);font-size:14px;">Thanks for reaching out — I got your message.</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:36px 32px;">
                            <p style="margin:0 0 18px;color:#d1d7e3;font-size:16px;line-height:1.7;">
                                Hi <strong style="color:#ffffff;">${safe(name)}</strong>,
                            </p>
                            <p style="margin:0 0 18px;color:#b8c0d4;font-size:15px;line-height:1.75;">
                                Thank you for contacting me through my portfolio.
                                This is the first time you've reached out, so a warm welcome from Zanzibar! 🌴
                            </p>
                            <p style="margin:0 0 26px;color:#b8c0d4;font-size:15px;line-height:1.75;">
                                I've received your message and will get back to you as soon as possible — usually within 24 hours.
                            </p>

                            <!-- Your message recap -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#161c2e;border:1px solid #232b40;border-radius:12px;margin-bottom:26px;">
                                <tr>
                                    <td style="padding:20px 22px;">
                                        <p style="margin:0 0 6px;color:#00e5ff;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">Your message</p>
                                        <p style="margin:0 0 4px;color:#8a93ad;font-size:12px;"><strong style="color:#d1d7e3;">Subject:</strong> ${safe(subject)}</p>
                                        <p style="margin:10px 0 0;color:#d1d7e3;font-size:14px;line-height:1.7;white-space:pre-wrap;">${safe(message)}</p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 22px;color:#b8c0d4;font-size:15px;line-height:1.75;">
                                In the meantime, feel free to explore my work or reach out through any of my socials.
                            </p>

                            <!-- CTAs -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding:6px 0;">
                                        <a href="https://mudrikdau-ux.github.io/Mudrik-Portfolio/projects.html"
                                           style="display:inline-block;padding:13px 26px;background:linear-gradient(135deg,#00e5ff,#0077ff);color:#0a0e1a;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;margin:4px;">
                                            View My Projects
                                        </a>
                                        <a href="https://mudrikdau-ux.github.io/Mudrik-Portfolio/"
                                           style="display:inline-block;padding:13px 26px;background:transparent;color:#00e5ff;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;margin:4px;border:1px solid #232b40;">
                                            Visit Portfolio
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Signature -->
                    <tr>
                        <td style="padding:0 32px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #232b40;padding-top:22px;">
                                <tr>
                                    <td style="padding-top:22px;">
                                        <p style="margin:0 0 2px;color:#f5f7fa;font-size:15px;font-weight:700;">Mudrik Mohamed Othman <span style="color:#00e5ff;">(DAU)</span></p>
                                        <p style="margin:0;color:#8a93ad;font-size:13px;">Full-Stack Developer · Zanzibar, Tanzania</p>
                                        <p style="margin:6px 0 0;font-size:13px;">
                                            <a href="mailto:mudrikdau@gmail.com" style="color:#00e5ff;text-decoration:none;">mudrikdau@gmail.com</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 32px;background:#0e131f;border-top:1px solid #1a2135;text-align:center;">
                            <p style="margin:0;color:#5a6382;font-size:12px;line-height:1.6;">
                                This is an automated confirmation — no need to reply to this email.<br />
                                © ${new Date().getFullYear()} Mudrik Dau · Built with care in Zanzibar 🇹🇿
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
        subject: `👋 Welcome ${name} — Your message has been received`,
        html
    };
}

module.exports = userWelcome;