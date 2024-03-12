import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GOOGLE_SMTP_USER, // your gmail address
    pass: process.env.GOOGLE_SMTP_PASSWORD, // your gmail password or app-specific password
  },
});

export const defaultSender =
  process.env.DEFAULT_SENDER_EMAIL || 'admin@example.com';
