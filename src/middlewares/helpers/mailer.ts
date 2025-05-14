import nodemailer, { SentMessageInfo } from 'nodemailer';

interface MailingData {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async (mailingData: MailingData): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.ECOM_EMAIL,
      pass: process.env.ECOM_PASSWORD,
    },
  });

  try {
    const info: SentMessageInfo = await transporter.sendMail(mailingData);
    console.log(`Message sent: ${info.response}`);
  } catch (err) {
    console.log(`Problem sending email: ${err}`);
    const error = new Error('There was a problem while sending an email');
    throw error;
  }
};
