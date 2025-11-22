const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Validate email configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file.');
  }

  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail' || !process.env.EMAIL_SERVICE) {
    console.log('Creating Gmail transporter...');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  }

  // For SMTP (generic)
  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST is required when using SMTP service.');
  }

  console.log('Creating SMTP transporter...');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, userName) => {
  try {
    console.log('Creating email transporter...');
    const transporter = createTransporter();

    // Verify transporter
    await transporter.verify();
    console.log('Email transporter verified successfully');

    const mailOptions = {
      from: `"StockMaster" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - StockMaster',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: #dbc39f; padding: 20px; text-align: center; }
            .content { background-color: #f5f1eb; padding: 30px; }
            .otp-box { background-color: #fff; border: 2px solid #1a1a1a; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #1a1a1a; letter-spacing: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { color: #d32f2f; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>STOCK SYNC</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${userName || 'User'},</p>
              <p>You have requested to reset your password. Use the OTP below to complete the process:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p>This OTP will expire in <strong>10 minutes</strong>.</p>
              
              <p class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact support immediately.
              </p>
              
              <p>Best regards,<br>StockMaster Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} StockMaster. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset OTP - StockMaster
        
        Hello ${userName || 'User'},
        
        You have requested to reset your password. Use the OTP below:
        
        OTP: ${otp}
        
        This OTP will expire in 10 minutes.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        StockMaster Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Send welcome email (optional)
const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"StockMaster" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to StockMaster',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1a1a1a; color: #dbc39f; padding: 20px; text-align: center; }
            .content { background-color: #f5f1eb; padding: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>STOCK SYNC</h1>
            </div>
            <div class="content">
              <h2>Welcome to StockMaster!</h2>
              <p>Hello ${userName},</p>
              <p>Your account has been successfully created. You can now log in and start managing your inventory.</p>
              <p>Best regards,<br>StockMaster Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email
    return { success: false };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};

