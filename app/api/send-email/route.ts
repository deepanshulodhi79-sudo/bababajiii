import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { senderName, email, appPassword, recipient, subject, body } = await req.json();

    if (!email || !appPassword || !recipient) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      );
    }

    const cleanBody = body || '';
    const cleanSubject = subject || '';
    const sender = senderName ? senderName.trim() : email.split('@')[0];

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

    // Consistent font rendering wrapper (Prevents font shrinking in Outlook / Replies)
    const formattedHtml = `
      <div style="font-family: Arial, sans-serif; font-size: 15px; color: #222222; line-height: 1.5;">
        ${cleanBody.replace(/\n/g, '<br/>')}
      </div>
    `;

    const domain = email.split('@')[1] || 'gmail.com';
    const customMessageId = `<${Date.now()}.${Math.random().toString(36).substring(2, 9)}@${domain}>`;

    const info = await transporter.sendMail({
      from: `"${sender}" <${email}>`,
      to: recipient,
      subject: cleanSubject,
      text: cleanBody,
      html: formattedHtml,
      replyTo: email,
      messageId: customMessageId,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
      },
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
