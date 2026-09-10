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
      secure: true,
      auth: {
        user: email,
        pass: appPassword.replace(/\s+/g, ''),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Clean Outlook-friendly HTML Wrapper with standard inline font styles
    const formattedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            p, div { font-family: Arial, sans-serif !important; font-size: 16px !important; color: #222222 !important; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; color: #222222;">
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #222222; line-height: 1.6;">
            ${(body || '').replace(/\n/g, '<br/>')}
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"${senderName || 'Sender'}" <${email}>`,
      to: recipient,
      subject: subject || 'No Subject',
      text: body, // Plain text match helps Inbox placement
      html: formattedHtml,
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
