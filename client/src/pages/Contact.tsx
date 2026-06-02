import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Mail,
  Send,
  User,
  FileText,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SUPPORT_EMAIL = 'support@jobtrack.app';

const TOPICS = [
  'General Question',
  'Bug Report',
  'Feature Request',
  'Account Help',
  'Other',
];

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MessageCircle;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-neon-blue/10 flex items-center justify-center">
        <Icon size={18} className="text-neon-blue" />
      </div>
      <div>
        <h2 className="font-semibold text-base">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-medium">
        {label}
        {required && <span className="text-neon-rose ml-0.5">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none focus:border-neon-blue/50 transition-colors placeholder:text-muted-foreground/50';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: TOPICS[0],
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    toast.success('Email address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', topic: TOPICS[0], subject: '', message: '' });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[800px] space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Have a question or need help? We'd love to hear from you.
        </p>
      </motion.div>

      {/* Contact Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <SectionHeader
          icon={MessageCircle}
          title="Send a Message"
          description="Fill out the form and we'll respond within 24 hours"
        />

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 gap-3 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-neon-emerald/10 flex items-center justify-center">
              <CheckCircle size={28} className="text-neon-emerald" />
            </div>
            <div>
              <p className="text-base font-semibold">Message received!</p>
              <p className="text-sm text-muted-foreground mt-1">
                We'll get back to you at{' '}
                <span className="text-neon-blue">{form.email}</span> within 24 hours.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 rounded-lg bg-accent text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/80 border border-border/30 transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Your Name" required>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                  />
                  <input
                    value={form.name}
                    onChange={(e) => set('name')(e.target.value)}
                    placeholder="Alex Johnson"
                    className={cn(inputClass, 'pl-8')}
                  />
                </div>
              </FormField>

              <FormField label="Email Address" required>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email')(e.target.value)}
                    placeholder="alex@university.edu"
                    className={cn(inputClass, 'pl-8')}
                  />
                </div>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Topic">
                <select
                  value={form.topic}
                  onChange={(e) => set('topic')(e.target.value)}
                  className={cn(inputClass, 'cursor-pointer')}
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Subject">
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                  />
                  <input
                    value={form.subject}
                    onChange={(e) => set('subject')(e.target.value)}
                    placeholder="Brief summary of your issue"
                    className={cn(inputClass, 'pl-8')}
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Message" required>
              <textarea
                value={form.message}
                onChange={(e) => set('message')(e.target.value)}
                placeholder="Tell us more about how we can help..."
                rows={5}
                className={cn(inputClass, 'resize-none')}
              />
            </FormField>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-blue/15 text-neon-blue font-medium text-sm border border-neon-blue/30 hover:bg-neon-blue/25 transition-all duration-200"
                style={{ boxShadow: '0 0 16px oklch(0.65 0.22 255 / 0.15)' }}
              >
                <Send size={14} />
                Send Message
              </button>
            </div>
          </form>
        )}
      </motion.section>

      {/* Direct Contact */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <SectionHeader
          icon={Mail}
          title="Email Us Directly"
          description="Prefer email? Reach us anytime at the address below"
        />

        <div className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border/40">
          <div className="w-9 h-9 rounded-lg bg-neon-blue/10 flex items-center justify-center shrink-0">
            <Mail size={16} className="text-neon-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">Support email</p>
            <p className="text-sm font-semibold text-neon-blue truncate">{SUPPORT_EMAIL}</p>
          </div>
          <button
            onClick={handleCopy}
            title="Copy email address"
            className={cn(
              'p-2 rounded-lg transition-all duration-200 border',
              copied
                ? 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/30'
                : 'bg-accent text-muted-foreground border-border/30 hover:text-foreground hover:bg-accent/80'
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Response time', value: '< 24 hours' },
            { label: 'Availability', value: 'Mon – Fri' },
            { label: 'Support hours', value: '9 AM – 6 PM GMT' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg bg-background border border-border/40 px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
