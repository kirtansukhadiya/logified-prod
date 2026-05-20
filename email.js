const axios = require('axios');

function getEmailConfig() {
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const contactTo = (process.env.CONTACT_TO || 'info.logified@gmail.com').trim();
  const emailFrom = (process.env.EMAIL_FROM || 'LOGIFIED SOLUTIONS <onboarding@resend.dev>').trim();

  return { resendApiKey, contactTo, emailFrom };
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

async function sendViaResend({ name, email, phone, message }, config) {
  const content = buildContactEmailContent({ name, email, phone, message });

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: config.emailFrom,
        to: [config.contactTo],
        reply_to: email,
        subject: content.subject,
        html: content.html,
        text: content.text
      },
      {
        headers: {
          Authorization: `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    return response.data;
  } catch (error) {
    const apiMessage = error.response?.data?.message;
    throw new Error(apiMessage || error.message);
  }
}

async function sendContactEmail(payload) {
  const config = getEmailConfig();

  if (!config.resendApiKey) {
    const error = new Error('Resend is not configured. Set RESEND_API_KEY in your environment.');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  await sendViaResend(payload, config);
  return { provider: 'resend', to: config.contactTo };
}

async function verifyEmailConfig() {
  const config = getEmailConfig();

  if (!config.resendApiKey) {
    return { ready: false, provider: null, reason: 'missing_credentials' };
  }

  return { ready: true, provider: 'resend', to: config.contactTo, from: config.emailFrom };
}

module.exports = {
  getEmailConfig,
  sendContactEmail,
  verifyEmailConfig
};
