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

    if (list.length === 0) return alert('Please add recipients!');
    if (!formData.email || !formData.appPassword) return alert('Gmail & App Password are required!');

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

      if (i < list.length - 1) {
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    setIsSending(false);
    alert('Campaign Finished!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-xl flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">🛡️ Secure Mail Console</h1>
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full font-bold">Vercel Ready</span>
        </header>

        {/* Progress Monitor */}
        <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 grid grid-cols-4 gap-4 text-center">
          <div className="bg-slate-700/50 p-3 rounded-xl"><p className="text-xs text-slate-400 font-bold">TOTAL</p><p className="text-2xl font-extrabold text-blue-400">{status.total}</p></div>
          <div className="bg-slate-700/50 p-3 rounded-xl"><p className="text-xs text-slate-400 font-bold">SENT</p><p className="text-2xl font-extrabold text-emerald-400">{status.sent}</p></div>
          <div className="bg-slate-700/50 p-3 rounded-xl"><p className="text-xs text-slate-400 font-bold">FAILED</p><p className="text-2xl font-extrabold text-red-400">{status.failed}</p></div>
          <div className="bg-slate-700/50 p-3 rounded-xl"><p className="text-xs text-slate-400 font-bold">REMAINING</p><p className="text-2xl font-extrabold text-yellow-400">{status.remaining}</p></div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-lg font-bold border-b border-slate-700 pb-2">✍️ Compose</h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Sender Name" className="bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm" value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} />
              <input type="email" placeholder="Your Gmail" className="bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="password" placeholder="16-char App Password" className="bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm" value={formData.appPassword} onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })} />
              <input type="text" placeholder="Subject" className="bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            </div>
            <textarea rows={5} placeholder="Body (HTML supported)" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm" value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} />
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4">👥 Recipients</h2>
              <textarea rows={7} placeholder="Paste emails (comma or line separated)" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm" value={formData.recipients} onChange={(e) => setFormData({ ...formData, recipients: e.target.value })} />
            </div>
            <button onClick={handleSend} disabled={isSending} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl transition disabled:bg-slate-700">
              {isSending ? 'Sending...' : '🚀 Launch Campaign'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
