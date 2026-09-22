const nodemailer = require('nodemailer');

const sendContactEmail = async ({
  toEmail,
  recipientName,
  senderName,
  senderEmail,
  company,
  subject,
  message,
}) => {
  const emailSubject = subject?.trim() || `New Portfolio Inquiry from ${senderName}`;
  const companyInfo = company?.trim()
    ? `<p style="margin: 4px 0;"><strong>Company:</strong> ${company}</p>`
    : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 24px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
        .content { padding: 24px; }
        .sender-box { background: #f8fafc; border-left: 4px solid #4f46e5; padding: 14px 18px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
        .sender-box p { margin: 4px 0; color: #334155; }
        .message-box { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; line-height: 1.6; font-size: 15px; color: #1e293b; white-space: pre-wrap; }
        .footer { padding: 18px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
        .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 600; margin-top: 20px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Portfolio Message</h1>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; color: #e0e7ff;">Someone reached out via your DevFolio portfolio</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; margin-top: 0;">Hi <strong>${recipientName || 'Developer'}</strong>,</p>
          <div class="sender-box">
            <p style="margin: 4px 0;"><strong>Sender:</strong> ${senderName}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${senderEmail}" style="color: #4f46e5;">${senderEmail}</a></p>
            ${companyInfo}
            <p style="margin: 4px 0;"><strong>Subject:</strong> ${emailSubject}</p>
          </div>
          <div class="message-box">
${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
          <div style="text-align: center;">
            <a href="mailto:${senderEmail}?subject=Re: ${encodeURIComponent(emailSubject)}" class="btn">Reply to ${senderName}</a>
          </div>
        </div>
        <div class="footer">
          This email was delivered automatically by your DevFolio Portfolio Generator backend.
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if SMTP is configured in environment
  let transporter;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test transporter for seamless zero-config local development
    console.log('[Mailer] No SMTP credentials configured in .env. Creating test Ethereal transporter...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"DevFolio Portfolio" <${process.env.EMAIL_USER || 'no-reply@devfolio.local'}>`,
    to: toEmail,
    replyTo: senderEmail,
    subject: `[DevFolio] ${emailSubject}`,
    html: htmlContent,
    text: `New portfolio message from ${senderName} (${senderEmail}):\n\n${message}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Mailer] Message delivered to ${toEmail}. ID: ${info.messageId}`);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[Mailer] Preview Email URL: ${previewUrl}`);
  }

  return {
    success: true,
    messageId: info.messageId,
    previewUrl,
  };
};

module.exports = { sendContactEmail };
