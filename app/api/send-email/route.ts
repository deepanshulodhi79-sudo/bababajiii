import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { senderName, email, appPassword, recipient, subject, body } = await req.json();

    if (!email || !appPassword || !recipient) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials or recipient' },
        { status: 400 }
      );
    }

    // Port 465 SSL Transporter for Vercel
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: appPassword.replace(/\s+/g, ''), // Spaces remove karne ke liye
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Explicit inline CSS wrapper to prevent shrinking font in Outlook & Quoted Replies
    const formattedHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #222222; line-height: 1.5;">
        ${(body || '').replace(/\n/g, '<br/>')}
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${senderName || 'Sender'}" <${email}>`,
      to: recipient,
      subject: subject || 'No Subject',
      text: body, // Plain text fallback
      html: formattedHtml, // HTML body with explicit typography
      replyTo: email,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
