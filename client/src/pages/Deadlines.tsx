// ============================================================
// DESIGN: Neon Command Center — Timeline deadlines view
// Color-coded urgency, LIVE countdown timers, complete + add actions.
// Data driven by the in-browser store (useAppData).
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar as CalendarIcon,
  Briefcase,
  FileText,
  MessageSquare,
  Send,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { type Deadline } from '@/lib/data';
import { useAppData, daysUntil, urgencyFor } from '@/contexts/AppDataContext';
import { cn } from '@/lib/utils';

const urgencyConfig = {
  red: {
    bg: 'bg-neon-rose/10',
    border: 'border-neon-rose/30',
    text: 'text-neon-rose',
    glow: 'glow-rose',
    ringColor: 'oklch(0.65 0.22 15)',
    label: 'Urgent',
    icon: AlertTriangle,
  },
  orange: {
    bg: 'bg-neon-amber/10',
    border: 'border-neon-amber/30',
    text: 'text-neon-amber',
    glow: 'glow-amber',
    ringColor: 'oklch(0.80 0.16 80)',
    label: 'Soon',
    icon: Clock,
  },
  green: {
    bg: 'bg-neon-emerald/10',
    border: 'border-neon-emerald/30',
    text: 'text-neon-emerald',
    glow: 'glow-emerald',
    ringColor: 'oklch(0.72 0.19 160)',
    label: 'On Track',
    icon: CheckCircle,
  },
};

const typeIcons = {
  'Application Deadline': Send,
  Interview: Briefcase,
  Assessment: FileText,
  'Follow-up': MessageSquare,
};

const deadlineTypes: Deadline['type'][] = [
  'Application Deadline',
  'Interview',
  'Assessment',
  'Follow-up',
];

function ProgressRing({
  progress,
  color,
  size = 48,
  strokeWidth = 3,
}: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="oklch(0.24 0.015 260)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}

function DeadlineCard({
  deadline,
  index,
  onComplete,
}: {
  deadline: Deadline;
  index: number;
  onComplete: (id: string) => void;
}) {
  // LIVE: recompute days left + urgency from the actual date every render
  const daysLeft = daysUntil(deadline.date);
  const urgency = urgencyFor(daysLeft);
  const config = urgencyConfig[urgency];
  const TypeIcon = typeIcons[deadline.type];
  const urgencyProgress = Math.max(0, Math.min(100, ((21 - daysLeft) / 21) * 100));
  const daysLabel = daysLeft < 0 ? 'past' : `${daysLeft}d`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{ delay: 0.05 * Math.min(index, 8), duration: 0.3 }}
      className={cn(
        'relative rounded-xl border bg-card p-4 card-glow group',
        config.border
      )}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-40"
        style={{ backgroundColor: config.ringColor }}
      />

      <div className="flex items-start gap-4">
        {/* Progress Ring */}
        <div className="relative shrink-0 flex items-center justify-center">
          <ProgressRing progress={urgencyProgress} color={config.ringColor} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-xs font-bold font-mono', config.text)}>
              {daysLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm text-foreground">{deadline.company}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{deadline.role}</p>
            </div>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0',
                config.bg,
                config.border,
                config.text
              )}
            >
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TypeIcon size={12} className={config.text} />
              <span>{deadline.type}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarIcon size={12} />
              <span className="font-mono">{deadline.date}</span>
            </div>
          </div>

          {/* Countdown bar */}
          <div className="mt-3 w-full h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${urgencyProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="h-full rounded-full"
              style={{ backgroundColor: config.ringColor }}
            />
          </div>

          {/* Complete action */}
          <button
            onClick={() => onComplete(deadline.id)}
            className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-neon-emerald bg-accent/40 hover:bg-neon-emerald/10 border border-border/30 hover:border-neon-emerald/30 transition-all duration-200"
          >
            <Check size={12} /> Mark complete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// Add Deadline modal
// ============================================================
function AddDeadlineModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (input: { company: string; role: string; type: Deadline['type']; date: string }) => void;
}) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState<Deadline['type']>('Interview');
  const [date, setDate] = useState('');

  const valid = company.trim() && role.trim() && date;

  const submit = () => {
    if (!valid) return;
    onAdd({ company: company.trim(), role: role.trim(), type, date });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-card border border-border/50 rounded-2xl p-6 w-[420px] max-w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Add Deadline</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Spotify"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none focus:border-neon-blue/50"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Backend Intern"
              className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none focus:border-neon-blue/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Deadline['type'])}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none focus:border-neon-blue/50"
              >
                {deadlineTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none focus:border-neon-blue/50"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={submit}
            disabled={!valid}
            className="flex-1 py-2 rounded-lg bg-neon-blue/15 text-neon-blue text-sm font-medium hover:bg-neon-blue/25 transition-colors border border-neon-blue/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Deadline
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-accent text-muted-foreground text-sm font-medium hover:bg-accent/80 transition-colors border border-border/30"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Deadlines() {
  const { deadlines, completeDeadline, addDeadline } = useAppData();
  const [showAdd, setShowAdd] = useState(false);

  // Sort by live days-left so countdowns stay ordered
  const sorted = [...deadlines].sort(
    (a, b) => daysUntil(a.date) - daysUntil(b.date)
  );
  const thisWeek = sorted.filter((d) => daysUntil(d.date) <= 7);
  const laterThisMonth = sorted.filter((d) => daysUntil(d.date) > 7);

  const counts = {
    red: deadlines.filter((d) => urgencyFor(daysUntil(d.date)) === 'red').length,
    orange: deadlines.filter((d) => urgencyFor(daysUntil(d.date)) === 'orange').length,
    green: deadlines.filter((d) => urgencyFor(daysUntil(d.date)) === 'green').length,
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1200px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deadlines</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay on top of your upcoming deadlines and interviews
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neon-blue/15 text-neon-blue text-sm font-medium hover:bg-neon-blue/25 transition-colors border border-neon-blue/20"
        >
          <Plus size={15} /> Add Deadline
        </button>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 flex-wrap"
      >
        {[
          { label: 'Urgent', count: counts.red, color: 'text-neon-rose', bg: 'bg-neon-rose/10' },
          { label: 'This Week', count: counts.orange, color: 'text-neon-amber', bg: 'bg-neon-amber/10' },
          { label: 'On Track', count: counts.green, color: 'text-neon-emerald', bg: 'bg-neon-emerald/10' },
        ].map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30',
              item.bg
            )}
          >
            <span className={cn('text-lg font-bold font-mono', item.color)}>
              {item.count}
            </span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Empty state */}
      {deadlines.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle size={48} className="text-neon-emerald/40 mb-3" />
          <p className="text-sm text-muted-foreground">
            All caught up — no pending deadlines. 🎉
          </p>
        </div>
      )}

      {/* Upcoming This Week */}
      {thisWeek.length > 0 && (
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-neon-rose neon-pulse" />
            <h2 className="text-lg font-semibold">Upcoming This Week</h2>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {thisWeek.length}
            </span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {thisWeek.map((d, i) => (
                <DeadlineCard
                  key={d.id}
                  deadline={d}
                  index={i}
                  onComplete={completeDeadline}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Later This Month */}
      {laterThisMonth.length > 0 && (
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-neon-emerald" />
            <h2 className="text-lg font-semibold">Later This Month</h2>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {laterThisMonth.length}
            </span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {laterThisMonth.map((d, i) => (
                <DeadlineCard
                  key={d.id}
                  deadline={d}
                  index={thisWeek.length + i}
                  onComplete={completeDeadline}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      <AnimatePresence>
        {showAdd && (
          <AddDeadlineModal onClose={() => setShowAdd(false)} onAdd={addDeadline} />
        )}
      </AnimatePresence>
    </div>
  );
}
