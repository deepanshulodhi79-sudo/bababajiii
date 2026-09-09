import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { senderName, email, appPassword, recipient, subject, body } = await req.json();

    if (!email || !appPassword || !recipient) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: appPassword,
      },
    });

    await transporter.sendMail({
      from: `"${senderName || email}" <${email}>`,
      to: recipient,
      subject: subject || 'No Subject',
      html: body || '',
    });

    return NextResponse.json({ success: true, recipient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
