import { Router, Request, Response } from 'express';

const router = Router();

interface ContactBody {
  name:     string;
  email:    string;
  subject?: string;
  message:  string;
}

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body as ContactBody;

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // TODO: swap this block for a real email service (e.g. Resend, SendGrid, Nodemailer)
  // Example with Resend:
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: 'portfolio@yourdomain.com',
  //     to: process.env.CONTACT_EMAIL!,
  //     subject: subject || `Portfolio contact from ${name}`,
  //     text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  //   });

  console.log(`📬 Contact form submission:`);
  console.log(`   From: ${name} <${email}>`);
  console.log(`   Subject: ${subject ?? '(none)'}`);
  console.log(`   Message: ${message.slice(0, 120)}${message.length > 120 ? '…' : ''}`);

  res.json({ data: { sent: true } });
});

export default router;
