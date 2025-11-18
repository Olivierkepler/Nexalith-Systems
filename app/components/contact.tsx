'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

type FormState = 'idle' | 'loading' | 'success' | 'error';
type Errors = Record<string, string>;

const MAX_MSG = 800;

/* ================================
   Contact Form — Nexalith Systems
   ================================ */
export default function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();
  const hpId = useId(); // honeypot

  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    company: '', // honeypot
  });

  const progress = useAnimationControls();
  const statusRef = useRef<HTMLDivElement | null>(null);
  const [formShake, setFormShake] = useState(false);

  const msgCount = values.message.length;
  const msgPct = Math.min(100, Math.round((msgCount / MAX_MSG) * 100));

  // Beautified phone formatting
  function formatPhone(input: string) {
    const trimmed = input.trim();
    const hasPlus = trimmed.startsWith('+');
    if (hasPlus) return trimmed.replace(/[^\d+()\-\s]/g, '');

    const digits = input.replace(/\D/g, '').slice(0, 15);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`.trim();
  }

  function setField<K extends keyof typeof values>(k: K, v: string) {
    const next = k === 'phone' ? formatPhone(v) : v;
    setValues((s) => ({ ...s, [k]: next }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }));
  }

  function validate(current = values) {
    const e: Errors = {};

    if (!current.name.trim()) {
      e.name = 'Please enter your name.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email)) {
      e.email = 'Enter a valid email address.';
    }

    if (current.phone && !/^[+()\-\d\s]{7,}$/.test(current.phone)) {
      e.phone = 'Enter a valid phone number.';
    }

    const msg = current.message.trim();
    if (msg.length < 10) {
      e.message = 'Please provide at least 10 characters.';
    } else if (msg.length > MAX_MSG) {
      e.message = `Keep it under ${MAX_MSG} characters.`;
    }

    // Honeypot: any value here marks spam
    if (current.company) {
      e.message = 'Spam detected.';
    }

    return e;
  }

  function handleBlur<K extends keyof typeof values>(k: K) {
    setTouched((t) => ({ ...t, [k]: true }));
    const e = validate();
    if (e[k as string]) {
      setErrors((prev) => ({ ...prev, [k as string]: e[k as string] }));
    }
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    const currentErrors = validate();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length) {
      setFormShake(true);
      setTimeout(() => setFormShake(false), 300);

      const firstKey = Object.keys(currentErrors)[0];
      const node = document.getElementById(
        firstKey === 'name'
          ? nameId
          : firstKey === 'email'
          ? emailId
          : firstKey === 'phone'
          ? phoneId
          : messageId
      );
      node?.focus();
      return;
    }

    setState('loading');
    statusRef.current?.focus();

    progress.start({ width: '18%' });

    try {
      progress.start({ width: '55%', transition: { duration: 0.5 } });

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      progress.start({ width: '92%', transition: { duration: 0.4 } });

      if (!res.ok) throw new Error('Request failed');

      setState('success');
      progress.start({ width: '100%', transition: { duration: 0.25 } });

      setValues({ name: '', email: '', phone: '', message: '', company: '' });
      setTouched({});
      setErrors({});
    } catch {
      setState('error');
    } finally {
      setTimeout(() => {
        progress.start({ width: '0%' });
        setState('idle');
      }, 3400);
    }
  }

  // Autoresize message field – event-based, no need to re-run on each change
  useEffect(() => {
    const ta = document.getElementById(messageId) as HTMLTextAreaElement | null;
    if (!ta) return;

    const resize = () => {
      ta.style.height = '0px';
      ta.style.height = ta.scrollHeight + 'px';
    };

    resize();
    ta.addEventListener('input', resize);

    return () => ta.removeEventListener('input', resize);
  }, [messageId]);

  // Cmd/Ctrl+Enter submit shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter') {
        onSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // we intentionally rely on latest closure, so no deps here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 pt-40">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-center">
          Contact Nexalith Systems
        </h1>
        <p className="text-center text-gray-600">
          We’d love to hear about your project, app idea, or business needs.
        </p>
      </div>

      <GradientBackdrop />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-10 overflow-hidden rounded-3xl border bg-white/75 shadow-xl backdrop-blur-xl"
        style={{ borderColor: 'rgba(30,58,138,0.12)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <aside className="relative hidden md:block">
            <LeftPane state={state} />
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-blue-100/30 to-transparent" />
          </aside>

          <section className="p-6 sm:p-8">
            <div
              ref={statusRef}
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {state === 'loading'
                ? 'Sending…'
                : state === 'success'
                ? 'Message sent.'
                : state === 'error'
                ? 'Error sending message.'
                : ''}
            </div>

            <header className="mb-6">
              <Pill>Inquiry Form</Pill>
              <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900">
                Tell us about the project you want to build
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                We respond within 1 business day.
              </p>
            </header>

            <motion.form
              onSubmit={onSubmit}
              animate={formShake ? { x: [0, -8, 6, -4, 0] } : {}}
              transition={{ duration: 0.28 }}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  id={nameId}
                  label="Your Name"
                  value={values.name}
                  error={touched.name ? errors.name : ''}
                  onBlur={() => handleBlur('name')}
                  onChange={(v) => setField('name', v)}
                  autoComplete="name"
                  icon={<IconUser />}
                  valid={touched.name && !errors.name && !!values.name.trim()}
                />

                <Field
                  id={emailId}
                  label="Email Address"
                  type="email"
                  value={values.email}
                  error={touched.email ? errors.email : ''}
                  onBlur={() => handleBlur('email')}
                  onChange={(v) => setField('email', v)}
                  autoComplete="email"
                  icon={<IconMail />}
                  valid={touched.email && !errors.email && !!values.email}
                />

                <Field
                  id={phoneId}
                  label="Phone Number (optional)"
                  value={values.phone}
                  error={touched.phone ? errors.phone : ''}
                  onBlur={() => handleBlur('phone')}
                  onChange={(v) => setField('phone', v)}
                  autoComplete="tel"
                  icon={<IconPhone />}
                  valid={touched.phone && !errors.phone && !!values.phone}
                />

                {/* Honeypot */}
                <div className="hidden">
                  <label htmlFor={hpId}>Company</label>
                  <input
                    id={hpId}
                    name="company"
                    value={values.company}
                    onChange={(e) => setField('company', e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    id={messageId}
                    label="Project Details"
                    value={values.message}
                    error={touched.message ? errors.message : ''}
                    onBlur={() => handleBlur('message')}
                    onChange={(v) => setField('message', v)}
                    placeholder="Describe the kind of business app or service you need…"
                    icon={<IconNote />}
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <div className="h-1 w-full rounded bg-gray-100">
                      <div
                        className={`h-1 rounded ${
                          msgPct > 90
                            ? 'bg-red-400'
                            : msgPct > 70
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${msgPct}%` }}
                        aria-hidden
                      />
                    </div>
                    <span
                      className={`ml-3 text-xs ${
                        msgCount > MAX_MSG ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      {msgCount}/{MAX_MSG}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500">
                  Secure form • No promotional messages
                </span>

                <SubmitButton state={state} progress={progress} />
              </div>

              <ToastArea>
                {state === 'success' && (
                  <Toast
                    intent="success"
                    text="Your message has been received. We’ll contact you shortly."
                  />
                )}
                {state === 'error' && (
                  <Toast
                    intent="error"
                    text="Unable to send message. Please try again."
                  />
                )}
              </ToastArea>
            </motion.form>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

/* ===== Left Pane (Brand/Trust) ===== */
function LeftPane({ state }: { state: FormState }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-l-3xl bg-gradient-to-br from-blue-50 via-white to-amber-50 p-8">
      {/* Static soft background, no heavy looping animation */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[32rem] w-[32rem] rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <StepHeader state={state} />

        <ul className="mt-8 space-y-4 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <Badge>Avg. Response</Badge>
            <span>~4 business hours</span>
          </li>
          <li className="flex items-start gap-3">
            <Badge>Services</Badge>
            <span>App Development • UI/UX • Business Solutions</span>
          </li>
          <li className="flex items-start gap-3">
            <Badge>Capabilities</Badge>
            <span>Business Apps • Portfolio Sites • Service Platforms</span>
          </li>
        </ul>

        <div className="mt-auto pt-8 text-xs text-gray-500">
          Tip: Press{' '}
          <kbd className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-white">
            ⌘
          </kbd>
          /
          <kbd className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-white">
            Ctrl
          </kbd>{' '}
          +{' '}
          <kbd className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-white">
            Enter
          </kbd>{' '}
          to send
        </div>
      </div>
    </div>
  );
}

function StepHeader({ state }: { state: FormState }) {
  const steps = [
    { label: 'Details' },
    { label: 'Send' },
    { label: state === 'success' ? 'Done' : 'Status' },
  ];
  const active = state === 'idle' ? 1 : state === 'loading' ? 2 : 3;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Start Your Nexalith Project
      </h2>
      <div className="mt-3 flex items-center gap-2">
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const on = stepNum <= active;
          return (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                  on ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`text-xs ${
                  on ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className="mx-1 h-px w-6 bg-gray-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Small UI Parts ===== */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-700">
      {children}
    </span>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-w-[88px] justify-center rounded-md bg-blue-600/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700">
      {children}
    </span>
  );
}

function GradientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          'radial-gradient(90% 60% at 0% 0%, rgba(30,58,138,0.06), transparent 60%), radial-gradient(70% 50% at 100% 0%, rgba(245,158,11,0.08), transparent 60%)',
      }}
    />
  );
}

/* ===== Submit Button ===== */
function SubmitButton({
  state,
  progress,
}: {
  state: FormState;
  progress: ReturnType<typeof useAnimationControls>;
}) {
  return (
    <motion.button
      type="submit"
      whileTap={{ scale: 0.98 }}
      disabled={state === 'loading'}
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-600 disabled:opacity-60"
    >
      <motion.span
        initial={{ width: '0%' }}
        animate={progress}
        className="absolute left-0 top-0 h-full bg-white/15"
        aria-hidden
      />

      <AnimatePresence initial={false} mode="wait">
        {state === 'loading' ? (
          <motion.span
            key="sending"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="inline-flex items-center gap-2"
          >
            <Spinner /> Sending…
          </motion.span>
        ) : state === 'success' ? (
          <motion.span
            key="sent"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="inline-flex items-center gap-2"
          >
            <Checkmark /> Sent!
          </motion.span>
        ) : state === 'error' ? (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="inline-flex items-center gap-2"
          >
            <Crossmark /> Retry
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            Send Inquiry →
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ===== Inputs ===== */
function Field(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  valid?: boolean;
}) {
  const {
    id,
    label,
    value,
    onChange,
    onBlur,
    error,
    type = 'text',
    autoComplete,
    icon,
    valid,
  } = props;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
          {icon}
        </div>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`peer block w-full   rounded-xl border pl-10 pr-9 pt-8 pb-2 text-sm text-gray-900 outline-none transition placeholder-transparent focus:ring-2
          ${
            error
              ? 'border-red-300 ring-red-200'
              : 'border-gray-200 focus:ring-amber-200'
          }`}
        placeholder={label}
      />

      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-9 top-2.5 z-10 bg-white px-1 text-xs text-gray-500 transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs`}
      >
        {label}
      </label>

      {valid && !error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
          <MiniTick />
        </div>
      )}

      {error && (
        <p id={describedBy} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Textarea(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  const { id, label, value, onChange, onBlur, error, placeholder, icon } =
    props;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-3 opacity-60">
          {icon}
        </div>
      )}

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={4}
        placeholder={label}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`peer block w-full resize-none rounded-xl border pl-10 pr-3 pt-10 pb-2 text-sm text-gray-900 outline-none transition placeholder-transparent focus:ring-2
          ${
            error
              ? 'border-red-300 ring-red-200'
              : 'border-gray-200 focus:ring-amber-200'
          }`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-9 top-2.5 z-10 bg-white px-1 text-xs text-gray-500 transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs`}
      >
        {label}
      </label>
      {error && (
        <p id={describedBy} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
      {placeholder && (
        <p className="mt-1 text-xs text-gray-500">{placeholder}</p>
      )}
    </div>
  );
}

/* ===== Icons ===== */
function IconUser() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c2-3 10-3 12 0" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 6h16v12H4z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.32 1.7.6 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.17a2 2 0 0 1 2.11-.45c.8.28 1.64.48 2.5.6A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconNote() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className="text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}

function MiniTick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className="text-emerald-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
  );
}

function Checkmark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M20 6L9 17l-5-5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Crossmark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ===== Toasts ===== */
function ToastArea({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-3 right-3 z-50 flex flex-col gap-2"
    >
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}

function Toast({ intent, text }: { intent: 'success' | 'error'; text: string }) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 16, opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={`pointer-events-auto rounded-lg px-4 py-2 text-sm text-white shadow-lg backdrop-blur
        ${
          intent === 'success'
            ? 'bg-emerald-600/95'
            : 'bg-red-600/95'
        }`}
      role="status"
    >
      {text}
    </motion.div>
  );
}
