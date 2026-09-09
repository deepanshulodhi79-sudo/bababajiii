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

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL Port for Vercel
      auth: {
        user: email,
        pass: appPassword.replace(/\s+/g, ''),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Clean plain text to line breaks HTML wrapper
    const formattedHtml = `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">${(body || '')
      .replace(/\n/g, '<br/>')}</div>`;

    const info = await transporter.sendMail({
      from: `"${senderName || 'Sender'}" <${email}>`,
      to: recipient,
      subject: subject || 'No Subject',
      text: body, // Fallback text
      html: formattedHtml, // Primary HTML format to pass Gmail spam filters
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
