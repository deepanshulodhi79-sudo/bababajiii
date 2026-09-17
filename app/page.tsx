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

    if (list.length === 0) return alert('Please enter recipient emails.');
    if (!formData.email || !formData.appPassword) return alert('Email & App Password are required.');

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

      // Safe Delay Gap (5 to 10 Seconds) - Prevents Gmail Spam Flagging
      if (i < list.length - 1) {
        const randomDelay = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        await new Promise((res) => setTimeout(res, randomDelay));
      }
    }

    setIsSending(false);
    alert('All emails processed!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Bulk Email Sender</h2>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
        <span><b>Total:</b> {status.total}</span>
        <span style={{ color: 'green' }}><b>Sent:</b> {status.sent}</span>
        <span style={{ color: 'red' }}><b>Failed:</b> {status.failed}</span>
        <span style={{ color: 'orange' }}><b>Remaining:</b> {status.remaining}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Sender Name"
          value={formData.senderName}
          onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
          style={{ padding: '8px' }}
        />
        <input
          type="email"
          placeholder="Gmail Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="App Password"
          value={formData.appPassword}
          onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          style={{ padding: '8px' }}
        />
        <textarea
          rows={5}
          placeholder="Message Body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          style={{ padding: '8px' }}
        />
        <textarea
          rows={4}
          placeholder="Recipients (one per line or comma separated)"
          value={formData.recipients}
          onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
          style={{ padding: '8px' }}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          style={{
            padding: '10px',
            background: isSending ? '#ccc' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isSending ? 'not-allowed' : 'pointer',
          }}
        >
          {isSending ? 'Sending (5-10s gap)...' : 'Start Sending'}
        </button>
      </div>
    </div>
  );
}
