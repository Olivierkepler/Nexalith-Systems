'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

type FormState = 'idle' | 'loading' | 'success' | 'error';
type Errors = Record<string, string>;

const MAX_MSG = 800;

/* ================================
   Contact Form — Luxe Split Layout
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

  // Beautified phone formatting
  function formatPhone(input: string) {
    const hasPlus = input.trim().startsWith('+');
    if (hasPlus) return input.replace(/[^\d+()\-\s]/g, '');
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
    if (!current.name.trim()) e.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email)) e.email = 'Enter a valid email.';
    if (current.phone && !/^[+()\-\d\s]{7,}$/.test(current.phone)) e.phone = 'Enter a valid phone.';
    if (current.message.trim().length < 10) e.message = 'Tell us a bit more (10+ chars).';
    if (current.message.length > MAX_MSG) e.message = `Keep it under ${MAX_MSG} characters.`;
    if (current.company) e.message = 'Spam detected.'; // honeypot
    return e;
  }

  function handleBlur<K extends keyof typeof values>(k: K) {
    setTouched((t) => ({ ...t, [k]: true }));
    const e = validate();
    if (e[k as string]) setErrors((prev) => ({ ...prev, [k as string]: e[k as string] }));
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const eNow = validate();
    setErrors(eNow);

    if (Object.keys(eNow).length) {
      // little shake on error
      setFormShake(true);
      setTimeout(() => setFormShake(false), 300);
      // focus first invalid
      const firstKey = Object.keys(eNow)[0];
      const node = document.getElementById(
        firstKey === 'name' ? nameId :
        firstKey === 'email' ? emailId :
        firstKey === 'phone' ? phoneId :
        messageId
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
        progress.start({ width: '0%' }); // reset for next time
        setState('idle');
      }, 3400);
    }
  }

  // textarea autoresize
  useEffect(() => {
    const ta = document.getElementById(messageId) as HTMLTextAreaElement | null;
    if (!ta) return;
    const on = () => { ta.style.height = '0px'; ta.style.height = ta.scrollHeight + 'px'; };
    on(); ta.addEventListener('input', on);
    return () => ta.removeEventListener('input', on);
  }, [messageId, values.message]);

  // Cmd/Ctrl+Enter submit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter') onSubmit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [values]);

  const msgCount = useMemo(() => values.message.length, [values.message]);
  const msgPct = Math.min(100, Math.round((msgCount / MAX_MSG) * 100));

  // Layout flourish state
  const [formShake, setFormShake] = useState(false);

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 pt-40">
<div className='mb-10'>

<h1 className='text-4xl font-bold text-center '>
  Contact Us
</h1>
<p className='text-center text-gray-600'>
  We are here to help you with your construction needs.
</p>
</div>


      {/* Background polish */}
      <GradientBackdrop />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border bg-white/75 shadow-xl backdrop-blur-xl mb-10"
        style={{ borderColor: 'rgba(30,58,138,0.12)' }}
      >
        {/* subtle animated ring */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          whileHover={{ boxShadow: '0 0 0 2px rgba(245,158,11,0.28), 0 40px 90px -50px rgba(30,58,138,0.35)' }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        />

        {/* Split layout */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: brand & trust cues */}
          <aside className="relative hidden md:block">
            <LeftPane state={state} />

            {/* decorative edge gradient */}
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-blue-100/30 to-transparent" />
          </aside>

          {/* Right: form */}
          <section className="p-6 sm:p-8">
            {/* SR live region */}
            <div
              ref={statusRef}
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {state === 'loading' ? 'Sending…' : state === 'success' ? 'Message sent.' : state === 'error' ? 'Something went wrong.' : ''}
            </div>

            {/* Title */}
            <header className="mb-6">
              <Pill>Project Inquiry</Pill>
              <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900">Tell us about your project</h3>
              <p className="mt-1 text-sm text-gray-600">We’ll get back within 1 business day.</p>
            </header>

            <motion.form
              onSubmit={onSubmit}
              animate={formShake ? { x: [0, -8, 6, -4, 0] } : {}}
              transition={{ duration: 0.28 }}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  id={nameId}
                  label="Full name"
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
                  label="Email"
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
                  label="Phone (optional)"
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

                {/* Message (full width) */}
                <div className="md:col-span-2">
                  <Textarea
                    id={messageId}
                    label="Project details"
                    value={values.message}
                    error={touched.message ? errors.message : ''}
                    onBlur={() => handleBlur('message')}
                    onChange={(v) => setField('message', v)}
                    placeholder="Square footage, room types, timeline, budget range…"
                    icon={<IconNote />}
                  />

                  {/* Character meter */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="h-1 w-full rounded bg-gray-100">
                      <div
                        className={`h-1 rounded ${msgPct > 90 ? 'bg-red-400' : msgPct > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${msgPct}%` }}
                        aria-hidden
                      />
                    </div>
                    <span className={`ml-3 text-xs ${msgCount > MAX_MSG ? 'text-red-600' : 'text-gray-500'}`}>
                      {msgCount}/{MAX_MSG}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit row */}
              <div className="mt-7 flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500">Protected by spam checks • No marketing emails</span>

                <SubmitButton state={state} progress={progress} />
              </div>

              {/* Toasts */}
              <ToastArea>
                {state === 'success' && <Toast intent="success" text="Thanks! We’ll be in touch shortly." />}
                {state === 'error' && <Toast intent="error" text="Something went wrong. Please try again." />}
              </ToastArea>
            </motion.form>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

/* ===== Left Pane (brand/trust) ===== */
function LeftPane({ state }: { state: FormState }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-l-3xl bg-gradient-to-br from-blue-50 via-white to-amber-50 p-8">
      {/* Floating shapes */}
      <motion.div
        className="absolute -top-24 -left-24 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(30,58,138,0.20), transparent 70%)' }}
        animate={{ x: [0, 28, -18, 0], y: [0, -16, 22, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(245,158,11,0.22), transparent 70%)' }}
        animate={{ x: [0, -20, 12, 0], y: [0, 16, -14, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        <StepHeader state={state} />
        <ul className="mt-8 space-y-4 text-sm text-gray-700">
          <li className="flex items-start gap-3">
            <Badge>Avg. reply</Badge>
            <span>~4 working hours</span>
          </li>
          <li className="flex items-start gap-3">
            <Badge>Coverage</Badge>
            <span>Licensed • Insured • Guaranteed</span>
          </li>
          <li className="flex items-start gap-3">
            <Badge>Projects</Badge>
            <span>Kitchen • Bathroom • Additions • Exterior</span>
          </li>
        </ul>

        <div className="mt-auto pt-8 text-xs text-gray-500">
          Tip: Press <kbd className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-white">⌘</kbd>/<kbd className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-white">Ctrl</kbd> + <kbd className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-white">Enter</kbd> to send
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
      <h2 className="text-lg font-semibold text-gray-900">Start your project</h2>
      <div className="mt-3 flex items-center gap-2">
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const on = stepNum <= active;
          return (
            <div key={s.label} className="flex items-center gap-2">
              <motion.div
                className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${on ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                initial={false}
                animate={{ scale: on ? 1 : 0.96 }}
              >
                {stepNum}
              </motion.div>
              <span className={`text-xs ${on ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="mx-1 h-px w-6 bg-gray-300" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Tiny UI atoms ===== */
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

/* ===== Submit Button with progress & states ===== */
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
      {/* progress film */}
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
            Send message →
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ===== Fields ===== */
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
  const { id, label, value, onChange, onBlur, error, type = 'text', autoComplete, icon, valid } = props;
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="relative">
      {/* icon */}
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
        className={`peer block w-full rounded-xl border pl-10 pr-9 pt-5 pb-2 text-sm text-gray-900 outline-none transition placeholder-transparent focus:ring-2
          ${error ? 'border-red-300 ring-red-200' : 'border-gray-200 focus:ring-amber-200'}`}
        placeholder={label}
      />

      {/* floating label */}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-9 top-2.5 z-10 px-1 text-xs transition-all bg-white text-gray-500
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs`}
      >
        {label}
      </label>

      {/* valid tick */}
      {valid && !error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
          <MiniTick />
        </div>
      )}

      {error && <p id={describedBy} className="mt-1 text-xs text-red-600">{error}</p>}
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
  const { id, label, value, onChange, onBlur, error, placeholder, icon } = props;
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
        className={`peer block w-full resize-none rounded-xl border pl-10 pr-3 pt-5 pb-2 text-sm text-gray-900 outline-none transition placeholder-transparent focus:ring-2
          ${error ? 'border-red-300 ring-red-200' : 'border-gray-200 focus:ring-amber-200'}`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-9 top-2.5 z-10 px-1 text-xs transition-all bg-white text-gray-500
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs`}
      >
        {label}
      </label>
      {error && <p id={describedBy} className="mt-1 text-xs text-red-600">{error}</p>}
      {placeholder && <p className="mt-1 text-xs text-gray-500">{placeholder}</p>}
    </div>
  );
}

/* ===== Icons (inline, no extra deps) ===== */
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c2-3 10-3 12 0" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16v12H4z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.32 1.7.6 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.17a2 2 0 0 1 2.11-.45c.8.28 1.64.48 2.5.6A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconNote() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}
function MiniTick() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* ===== Small system bits ===== */
function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />;
}
function Checkmark() {
  return (
    <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <motion.path
        d="M20 6L9 17l-5-5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.svg>
  );
}
function Crossmark() {
  return (
    <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <motion.path
        d="M18 6L6 18M6 6l12 12"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35 }}
      />
    </motion.svg>
  );
}

/* Toast stack */
function ToastArea({ children }: { children: React.ReactNode }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed bottom-3 right-3 z-50 flex flex-col gap-2">
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
        ${intent === 'success' ? 'bg-emerald-600/95' : 'bg-red-600/95'}`}
      role="status"
    >
      {text}
    </motion.div>
  );
}
