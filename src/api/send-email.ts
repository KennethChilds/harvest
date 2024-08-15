import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { promisify } from 'util';

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Promisify middleware
const runMiddleware = promisify(upload.single('file'));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Run the middleware


      const { email } = req.body;
      const file = (req as any).file;

      if (!email || !file) {
        return res.status(400).json({ error: 'Email and file are required' });
      }

      // Create a nodemailer transporter (replace with your SMTP settings)
      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your-email@example.com',
          pass: 'your-password',
        },
      });

      // Send email with PDF attachment
      await transporter.sendMail({
        from: 'your-email@example.com',
        to: email,
        subject: 'Your NFT Sale Receipt',
        text: 'Thank you for using our NFT sale service. Please find attached your receipt.',
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer,
          },
        ],
      });

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}