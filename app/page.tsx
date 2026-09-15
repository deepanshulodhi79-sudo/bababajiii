'use client';

import { useState } from 'react';

export default function BulkEmailSender() {
  const [formData, setFormData] = useState({
    senderName: '',
    email: '',
    appPassword: '',
    subject: '',
    body: '',
    recipients: '',
  });

  const [status, setStatus] = useState({ total: 0, sent: 0, failed: 0, remaining: 0 });
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const list = formData.recipients
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (list.length === 0) return alert('Enter recipients.');
    if (!formData.email || !formData.appPassword) return alert('Enter email & app password.');

    const currentBatchConfig = { ...formData };

    setIsSending(true);
    setStatus({ total: list.length, sent: 0, failed: 0, remaining: list.length });

    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < list.length; i++) {
      const recipient = list[i];

      try {
        const res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderName: currentBatchConfig.senderName,
            email: currentBatchConfig.email,
            appPassword: currentBatchConfig.appPassword,
            subject: currentBatchConfig.subject,
            body: currentBatchConfig.body,
            recipient: recipient,
          }),
        });

        const data = await res.json();
        if (data.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      } catch (err) {
        failedCount++;
      }

      setStatus({
        total: list.length,
        sent: sentCount,
        failed: failedCount,
        remaining: list.length - (sentCount + failedCount),
      });

      if (i < list.length - 1) {
        const randomDelay = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        await new Promise((res) => setTimeout(res, randomDelay));
      }
    }

    setIsSending(false);
    alert('Finished!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Simple Email Sender</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <span>Total: {status.total}</span> | 
        <span style={{ color: 'green' }}> Sent: {status.sent}</span> | 
        <span style={{ color: 'red' }}> Failed: {status.failed}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Sender Name"
          value={formData.senderName}
          onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Gmail Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="App Password"
          value={formData.appPassword}
          onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
        <textarea
          rows={4}
          placeholder="Message Body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
        />
        <textarea
          rows={3}
          placeholder="Recipients (one per line)"
          value={formData.recipients}
          onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
        />
        <button onClick={handleSend} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Emails'}
        </button>
      </div>
    </div>
  );
}
