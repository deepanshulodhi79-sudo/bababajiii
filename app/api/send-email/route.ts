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
    });

    const textBody = body || '';
    
    // Clean, high-deliverability HTML layout
    const htmlBody = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; font-size:15px; color:#222222; line-height:1.5;">
  <div style="padding:10px;">
    ${textBody.replace(/\n/g, '<br/>')}
  </div>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: `"${senderName || 'Sender'}" <${email}>`,
      to: recipient,
      subject: subject || '',
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed' },
      { status: 500 }
    );
  }
}
