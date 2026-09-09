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

    if (list.length === 0) return alert('Please add at least one recipient.');

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
            senderName: formData.senderName,
            email: formData.email,
            appPassword: formData.appPassword,
            subject: formData.subject,
            body: formData.body,
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
    }

    setIsSending(false);
    alert('Bulk email sending finished!');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center justify-center text-slate-800">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">🛡️ Secure Mail Console</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        
        {/* Left Form */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">✍️ Compose Message</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Sender Name"
              className="p-2 border rounded"
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Your Gmail"
              className="p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="16-char App Password"
              className="p-2 border rounded"
              value={formData.appPassword}
              onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
            />
            <input
              type="text"
              placeholder="Email Subject"
              className="p-2 border rounded"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <textarea
            rows={5}
            placeholder="Message Body (HTML or Plain Text)"
            className="w-full p-2 border rounded"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
        </div>

        {/* Right Form & Status */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">👥 Recipients</h2>
            <textarea
              rows={4}
              placeholder="Paste emails (comma or line separated)..."
              className="w-full p-2 border rounded"
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">📊 Progress Monitor</h2>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-100 p-2 rounded"><p className="text-sm">TOTAL</p><p className="text-lg font-bold">{status.total}</p></div>
              <div className="bg-green-100 text-green-700 p-2 rounded"><p className="text-sm">SENT</p><p className="text-lg font-bold">{status.sent}</p></div>
              <div className="bg-red-100 text-red-700 p-2 rounded"><p className="text-sm">FAILED</p><p className="text-lg font-bold">{status.failed}</p></div>
              <div className="bg-yellow-100 text-yellow-700 p-2 rounded"><p className="text-sm">REMAINING</p><p className="text-lg font-bold">{status.remaining}</p></div>
            </div>

            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {isSending ? 'Sending Emails...' : '🚀 Send All'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
