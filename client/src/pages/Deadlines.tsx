// ============================================================
// DESIGN: Neon Command Center — Timeline deadlines view
// Color-coded urgency, countdown timers, progress rings
// ============================================================
import { motion } from 'framer-motion';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar as CalendarIcon,
  Briefcase,
  FileText,
  MessageSquare,
  Send,
} from 'lucide-react';
import { deadlines, type Deadline } from '@/lib/data';
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

function DeadlineCard({ deadline, index }: { deadline: Deadline; index: number }) {
  const config = urgencyConfig[deadline.urgency];
  const TypeIcon = typeIcons[deadline.type];
  // Progress: inverse of days left (max 21 days)
  const urgencyProgress = Math.max(0, Math.min(100, ((21 - deadline.daysLeft) / 21) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
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
              {deadline.daysLeft}d
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
        </div>
      </div>
    </motion.div>
  );
}

export default function Deadlines() {
  const thisWeek = deadlines.filter((d) => d.daysLeft <= 7);
  const laterThisMonth = deadlines.filter((d) => d.daysLeft > 7);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1200px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Deadlines</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Stay on top of your upcoming deadlines and interviews
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 flex-wrap"
      >
        {[
          { label: 'Urgent', count: deadlines.filter((d) => d.urgency === 'red').length, color: 'text-neon-rose', bg: 'bg-neon-rose/10' },
          { label: 'This Week', count: deadlines.filter((d) => d.urgency === 'orange').length, color: 'text-neon-amber', bg: 'bg-neon-amber/10' },
          { label: 'On Track', count: deadlines.filter((d) => d.urgency === 'green').length, color: 'text-neon-emerald', bg: 'bg-neon-emerald/10' },
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
            {thisWeek.map((d, i) => (
              <DeadlineCard key={d.id} deadline={d} index={i} />
            ))}
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
            {laterThisMonth.map((d, i) => (
              <DeadlineCard key={d.id} deadline={d} index={thisWeek.length + i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
