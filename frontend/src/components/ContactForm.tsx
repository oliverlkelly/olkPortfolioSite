import { useState } from 'react';
import type { Profile } from '@/types';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  profile: Profile | null;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

const EMPTY: FormData = { name: '', email: '', subject: '', message: '' };

export function ContactForm({ profile }: ContactFormProps) {
  const [form, setForm]   = useState<FormData>(EMPTY);
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())                    e.name    = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email   = 'Valid email required';
    if (!form.message.trim())                 e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setState('loading');
    try {
      // Build a mailto link as a lightweight fallback (no backend email service required)
      // For production, swap this for a real API call to /api/contact or a service like Resend.
      const subject = encodeURIComponent(form.subject || `Portfolio contact from ${form.name}`);
      const body    = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      );
      const mailto  = `mailto:${profile?.email ?? ''}?subject=${subject}&body=${body}`;

      // Simulate brief async (real impl: await fetch('/api/contact', { method:'POST', body: JSON.stringify(form) }))
      await new Promise((r) => setTimeout(r, 800));
      window.location.href = mailto;
      setState('success');
      setForm(EMPTY);
    } catch {
      setState('error');
    }
  };

  return (
    <div className={styles.formWrap}>
      <p className={styles.formLabel}>Send a message</p>

      {state === 'success' ? (
        <div className={styles.success}>
          <span className={styles.successIcon}>✓</span>
          <p>Message queued in your mail client.</p>
          <button className={styles.resetBtn} onClick={() => setState('idle')}>
            Send another
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <Field
              label="Name"
              id="name"
              type="text"
              value={form.name}
              error={errors.name}
              onChange={handleChange('name')}
              placeholder="Your name"
            />
            <Field
              label="Email"
              id="email"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
            />
          </div>
          <Field
            label="Subject"
            id="subject"
            type="text"
            value={form.subject}
            onChange={handleChange('subject')}
            placeholder="What's it about?"
          />
          <Field
            label="Message"
            id="message"
            type="textarea"
            value={form.message}
            error={errors.message}
            onChange={handleChange('message')}
            placeholder="Tell me about your project or opportunity…"
            rows={5}
          />

          {state === 'error' && (
            <p className={styles.errorBanner}>
              Something went wrong. Please email directly instead.
            </p>
          )}

          <div className={styles.formFooter}>
            <span className={styles.formNote}>
              Or email directly:{' '}
              <a href={`mailto:${profile?.email}`}>{profile?.email}</a>
            </span>
            <button
              type="submit"
              className={`${styles.submitBtn} ${state === 'loading' ? styles.loading : ''}`}
              disabled={state === 'loading'}
            >
              {state === 'loading' ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  Send message
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ─── Reusable field ─── */
interface FieldProps {
  label:     string;
  id:        string;
  type:      'text' | 'email' | 'textarea';
  value:     string;
  error?:    string;
  onChange:  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?:     number;
}

function Field({ label, id, type, value, error, onChange, placeholder, rows }: FieldProps) {
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          className={styles.input}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows ?? 4}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={styles.input}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
