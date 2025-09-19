import nodemailer from 'nodemailer';
import { config } from './config';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: config.mailHost,
  port: config.mailPort,
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

export const sendResetPasswordEmail = async (to: string, resetLink: string): Promise<void> => {
  const mailOptions = {
    from: `"Clinic Management" <${config.mailUser}>`,
    to,
    subject: 'Reset Password',
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset password email');
  }
};