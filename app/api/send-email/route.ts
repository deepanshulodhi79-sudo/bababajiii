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

    const cleanBody = body || '';
    const formattedHtml = `<div style="font-family: Arial, sans-serif; font-size: 15px; color: #222222; line-height: 1.5;">${cleanBody.replace(/\n/g, '<br/>')}</div>`;

    const info = await transporter.sendMail({
      from: `"${senderName || 'Sender'}" <${email}>`,
      to: recipient,
      subject: subject || '',
      text: cleanBody,
      html: formattedHtml,
      replyTo: email,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed' },
      { status: 500 }
    );
  }
}
