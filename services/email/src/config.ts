import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
	port: parseInt(process.env.SMTP_PORT || '2525'),
});

export const defaultSender =
	process.env.DEFAULT_SENDER_EMAIL || 'admin@example.com';
