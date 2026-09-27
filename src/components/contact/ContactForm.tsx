import { useState } from 'react';
import { FaUser, FaEnvelope, FaCommentDots, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { validateContact } from '@/validation/contact';
import type { ContactApiResponse } from '@/types/contact';

type Phase = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Contact / feedback form wired to POST /api/contact.
 * Client validation mirrors the server rules; success is only shown
 * after the backend confirms the message was stored.
 */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<Phase>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [sentTo, setSentTo] = useState({ name: '', email: '' });

  const submitting = phase === 'submitting';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const check = validateContact({ name, email, feedback: message });
    setErrors({ name: check.errors.name, email: check.errors.email, message: check.errors.feedback });
    if (!check.valid) return;

    setPhase('submitting');
    setServerMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: check.value.name, email: check.value.email, feedback: check.value.feedback }),
      });
      let data: ContactApiResponse | null = null;
      try {
        data = (await res.json()) as ContactApiResponse;
      } catch {
        data = null;
      }
      if (res.ok && data && data.success) {
        setSentTo({ name: check.value.name, email: check.value.email });
        setName('');
        setEmail('');
        setMessage('');
        setErrors({});
        setPhase('success');
      } else if (data && !data.success && data.errors) {
        setErrors({ name: data.errors.name, email: data.errors.email, message: data.errors.feedback });
        setServerMessage(data.message);
        setPhase('error');
      } else {
        setServerMessage(data && !data.success ? data.message : 'Unable to send your message. Please try again.');
        setPhase('error');
      }
    } catch {
      // Network down / backend unreachable — never fake success.
      setServerMessage('Unable to connect to the server. Please check your connection and try again.');
      setPhase('error');
    }
  };

  const sendAnother = () => {
    setPhase('idle');
    setServerMessage('');
    setErrors({});
  };

  const inputClass = (invalid: boolean) =>
    `w-full glass p-3 rounded-xl focus:outline-none focus:ring-2 ${
      invalid ? 'focus:ring-red-500 ring-1 ring-red-500' : 'focus:ring-primary'
    }`;

  if (phase === 'success') {
    return (
      <div className="text-center py-6 space-y-3">
        <FaCheckCircle className="text-4xl text-green-500 mx-auto" aria-hidden="true" />
        <h2 className="text-2xl font-bold">Message Sent</h2>
        <p className="text-muted-foreground" aria-live="polite">
          Thank you{sentTo.name ? `, ${sentTo.name}` : ''}! Your feedback has been received
          {sentTo.email ? ` and we will get back to you at ${sentTo.email}` : ''}.
        </p>
        <button
          onClick={sendAnother}
          className="mt-2 px-6 py-2 glass rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {phase === 'error' && serverMessage && (
        <div
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-600 dark:text-red-400 flex items-start gap-2"
          role="alert"
        >
          <FaExclamationCircle className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{serverMessage}</span>
        </div>
      )}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
          <FaUser className="inline mr-1.5 text-muted-foreground" aria-hidden="true" />
          Your Name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          maxLength={100}
          placeholder="Your Name"
          className={inputClass(!!errors.name)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          aria-busy={submitting}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
          <FaEnvelope className="inline mr-1.5 text-muted-foreground" aria-hidden="true" />
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="Email"
          className={inputClass(!!errors.email)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
          <FaCommentDots className="inline mr-1.5 text-muted-foreground" aria-hidden="true" />
          Feedback
        </label>
        <textarea
          id="contact-message"
          rows={4}
          maxLength={5000}
          placeholder="Your feedback..."
          className={inputClass(!!errors.message)}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-sm text-red-500 mt-1" role="alert">
            {errors.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <FaPaperPlane aria-hidden="true" />
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
