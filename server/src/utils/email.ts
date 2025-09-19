import nodemailer from 'nodemailer';
import { config } from '../config/config';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.mailHost,
  port: config.mailPort,
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Clinic Management System" <${config.mailUser}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};