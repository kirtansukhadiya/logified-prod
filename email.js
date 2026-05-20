const dns = require('dns');
const nodemailer = require('nodemailer');

// Render often has no working IPv6 route to Gmail; force IPv4 DNS lookup
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

function ipv4Lookup(hostname, options, callback) {
  dns.lookup(hostname, { family: 4 }, (err, address, family) => {
    if (err) return callback(err);
    callback(null, address, family);
  });
}

function getEmailConfig() {
  const user = (process.env.EMAIL_USER || process.env.GMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '');
  const contactTo = (process.env.CONTACT_TO || user || 'info.logified@gmail.com').trim();

  return { user, pass, contactTo };
}

function buildContactEmailContent({ name, email, phone, message }) {
  const receivedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
      <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #007bff, #0056b3); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">LOGIFIED SOLUTIONS</h1>
          <p style="color: #e3f2fd; margin: 10px 0 0 0; font-size: 16px;">New Contact Form Inquiry</p>
        </div>
        <div style="padding: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Contact Details</h3>
            <p style="margin: 8px 0; color: #555;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 8px 0; color: #555;"><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${phone ? `<p style="margin: 8px 0; color: #555;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
          </div>
          <div style="background: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px; line-height: 1.6; color: #555;">
              ${escapeHtml(message).replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 14px; margin: 30px 0 0; text-align: center;">Received on ${receivedAt}</p>
        </div>
      </div>
    </div>
  `;

  const text = [
    'LOGIFIED SOLUTIONS - New Contact Form Inquiry',
    '============================================',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : '',
    '',
    'Message:',
    message,
    '',
    `Received on: ${receivedAt}`
  ].filter(Boolean).join('\n');

  return {
    subject: `New Inquiry from ${name} - LOGIFIED SOLUTIONS`,
    html,
    text
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createGmailTransporter(user, pass) {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== undefined
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port,
    secure,
    auth: { user, pass },
    lookup: ipv4Lookup,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    ...(port === 587 && { requireTLS: true })
  });
}

async function sendViaGmail({ name, email, phone, message }, config) {
  const transporter = createGmailTransporter(config.user, config.pass);
  const content = buildContactEmailContent({ name, email, phone, message });

  await transporter.sendMail({
    from: `"LOGIFIED SOLUTIONS" <${config.user}>`,
    to: config.contactTo,
    replyTo: email,
    subject: content.subject,
    html: content.html,
    text: content.text
  });
}

async function sendContactEmail(payload) {
  const config = getEmailConfig();

  if (!config.user || !config.pass) {
    const error = new Error('Gmail is not configured. Set EMAIL_USER and EMAIL_PASS (Gmail App Password).');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  await sendViaGmail(payload, config);
  return { provider: 'gmail', to: config.contactTo };
}

async function verifyEmailConfig() {
  const config = getEmailConfig();

  if (!config.user || !config.pass) {
    return { ready: false, provider: null, reason: 'missing_credentials' };
  }

  try {
    const transporter = createGmailTransporter(config.user, config.pass);
    await transporter.verify();
    return { ready: true, provider: 'gmail', to: config.contactTo };
  } catch (error) {
    return { ready: false, provider: 'gmail', reason: error.message };
  }
}

module.exports = {
  getEmailConfig,
  sendContactEmail,
  verifyEmailConfig
};
