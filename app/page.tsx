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

    if (list.length === 0) return alert('Please enter at least one recipient email.');
    if (!formData.email || !formData.appPassword) return alert('Gmail address and App Password are required.');

    // FIX: Freeze current credentials for the entire batch execution
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
            email: currentBatchConfig.email, // Always uses ID 'A' until loop finishes
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

      // 2-Second Delay
      if (i < list.length - 1) {
        await new Promise((res) => setTimeout(res, 800));
      }
    }

    setIsSending(false);
    alert('Campaign Execution Completed!');
  };

  return (
    // Rest of your JSX form layout remains exactly the same
    <div>...</div>
  );
}
