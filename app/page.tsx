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
    // Current loop and fetch logic remain same
    // (Ensure the 3-second delay is included for inbox delivery)
  };

  return (
    <div className="min-h-screen bg-bulk-bg p-8 flex flex-col items-center justify-center font-sans text-gray-800">
      <div className="w-full max-w-7xl flex flex-col gap-6">
        
        {/* Main Header with Gradient */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🛡️</span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Secure Mail Console</h1>
              <p className="text-sm opacity-80">Send bulk emails confidently</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Vercel Status:</span>
            <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold">Online</span>
          </div>
        </header>

        {/* Dynamic State Monitor Area */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-grow">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Monitor</h2>
            <p className="text-sm text-gray-600">Track progress in real-time</p>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <p className="text-xs text-blue-800 font-semibold">TOTAL</p>
              <p className="text-3xl font-extrabold text-blue-600">{status.total}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
              <p className="text-xs text-emerald-800 font-semibold">SENT</p>
              <p className="text-3xl font-extrabold text-emerald-600">{status.sent}</p>
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <p className="text-xs text-red-800 font-semibold">FAILED</p>
              <p className="text-3xl font-extrabold text-red-600">{status.failed}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
              <p className="text-xs text-yellow-800 font-semibold">REMAINING</p>
              <p className="text-3xl font-extrabold text-yellow-600">{status.remaining}</p>
            </div>
          </div>
        </section>

        {/* Form Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Message Composition */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5">
            <h3 className="text-xl font-bold text-gray-950 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="text-2xl">✍️</span> Compose Message
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sender Name"
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Gmail"
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="16-char App Password"
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition"
                value={formData.appPassword}
                onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
              />
              <input
                type="text"
                placeholder="Email Subject"
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <textarea
              rows={6}
              placeholder="Message Body (HTML or Plain Text)"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            />
          </div>

          {/* Right: Recipients */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex-grow flex flex-col gap-5">
              <h3 className="text-xl font-bold text-gray-950 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span className="text-2xl">👥</span> Recipients
              </h3>
              <textarea
                rows={4}
                placeholder="Paste emails (comma or line separated)..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition flex-grow"
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              />
            </div>

            {/* Action Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-4">
              <button
                onClick={handleSend}
                disabled={isSending}
                className={`w-full py-4 text-white font-extrabold text-lg rounded-xl shadow-md transition transform duration-150 ${
                  isSending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95'
                }`}
              >
                {isSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Sending Campaigns...
                  </span>
                ) : (
                  '🚀 Launch Campaign (Send All)'
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
