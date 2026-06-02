// ============================================================
// DESIGN: Neon Command Center — Mission control dashboard
// Stats row, recommended jobs, application cards, activity chart, CV card
// ALL data is now driven by the in-browser store (useAppData).
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  Trophy,
  TrendingUp,
  StickyNote,
  MapPin,
  DollarSign,
  X,
  Sparkles,
  ExternalLink,
  Zap,
  CheckCircle,
  Loader2,
  FileText,
  GraduationCap,
  Target,
  Upload,
  Linkedin,
  Globe,
  Search,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  weeklyActivity,
  statusColors,
  statusProgressColors,
  recommendedJobs,
  cvData,
  type Application,
  type RecommendedJob,
  type JobSource,
} from '@/lib/data';
import { useAppData } from '@/contexts/AppDataContext';
import { cn } from '@/lib/utils';

// ============================================================
// Source platform config — icons, colors, labels
// ============================================================
const sourceConfig: Record<JobSource, { label: string; color: string; bgColor: string }> = {
  LinkedIn: { label: 'LinkedIn', color: '#0A66C2', bgColor: '#0A66C215' },
  Indeed: { label: 'Indeed', color: '#2164F3', bgColor: '#2164F315' },
  'Company Website': { label: 'Company Site', color: '#8B5CF6', bgColor: '#8B5CF615' },
  Bayt: { label: 'Bayt', color: '#1DBF73', bgColor: '#1DBF7315' },
  Dubizzle: { label: 'Dubizzle', color: '#E53E3E', bgColor: '#E53E3E15' },
};

// ============================================================
// Animated counter hook — re-animates whenever `end` changes
// (so adding an application makes the stat tick up live)
// ============================================================
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const to = end;
    prev.current = end;
    if (from === to) {
      setCount(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setCount(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return count;
}

// ============================================================
// StatCard
// ============================================================
function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  glowClass,
  iconBg,
  delay,
}: {
  icon: typeof Briefcase;
  label: string;
  value: number;
  suffix?: string;
  glowClass: string;
  iconBg: string;
  delay: number;
}) {
  const animatedValue = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 card-glow',
        glowClass
      )}
    >
      <div className={cn('absolute top-0 left-0 right-0 h-[2px]', iconBg, 'opacity-60')} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1 tracking-tight font-mono">
            {animatedValue}
            {suffix && <span className="text-lg ml-0.5">{suffix}</span>}
          </p>
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBg, 'bg-opacity-20')}>
          <Icon size={20} className="text-white/90" />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// ProgressBar
// ============================================================
function ProgressBar({ progress, status }: { progress: number; status: string }) {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className={cn(
          'h-full rounded-full',
          statusProgressColors[status as keyof typeof statusProgressColors]
        )}
      />
    </div>
  );
}

// ============================================================
// ApplicationRow
// ============================================================
function ApplicationRow({ app, index }: { app: Application; index: number }) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 * Math.min(index, 8), duration: 0.3 }}
        className="group grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3.5 rounded-xl hover:bg-surface-2/50 transition-all duration-200 border border-transparent hover:border-border/30"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: app.logoColor + '22', color: app.logoColor }}
        >
          {app.logo}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{app.role}</p>
          <p className="text-xs text-muted-foreground truncate">{app.company}</p>
        </div>
        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap hidden md:block">
          {app.dateApplied}
        </span>
        <span
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap',
            statusColors[app.status]
          )}
        >
          {app.status}
        </span>
        <div className="w-24 hidden lg:block">
          <ProgressBar progress={app.progress} status={app.status} />
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
            {app.progress}%
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="Notes"
          >
            <StickyNote size={14} />
          </button>
        </div>
      </motion.div>

      {showNotes && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-4 mb-2 px-4 py-3 rounded-lg bg-surface-2/50 border border-border/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {app.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={12} /> {app.salary}
                </span>
              </div>
              <p className="text-foreground/80">{app.notes}</p>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="p-1 rounded hover:bg-accent text-muted-foreground shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

// ============================================================
// Apply Modal — calls onApplied() the moment it succeeds
// ============================================================
function ApplyModal({
  job,
  onClose,
  onApplied,
}: {
  job: RecommendedJob;
  onClose: () => void;
  onApplied: () => void;
}) {
  const [stage, setStage] = useState<'applying' | 'success'>('applying');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('success');
      onApplied();
    }, 1800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-card border border-border/50 rounded-2xl p-6 w-[380px] max-w-[90vw] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {stage === 'applying' ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-neon-blue/15 flex items-center justify-center mx-auto mb-4">
              <Loader2 size={28} className="text-neon-blue animate-spin" />
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {job.easyApply ? 'Applying with your CV\u2026' : 'Opening application form\u2026'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {job.easyApply
                ? `Submitting to ${job.company} via ${job.source}`
                : `Redirecting to ${job.company}'s career portal`}
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-14 h-14 rounded-full bg-neon-emerald/15 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle size={28} className="text-neon-emerald" />
            </motion.div>
            <h3 className="font-semibold text-lg mb-1">
              {job.easyApply ? 'Application Submitted!' : 'Form Opened!'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {job.easyApply
                ? `Your CV has been sent to ${job.company} for the ${job.title} role. It's now in your tracker.`
                : `The ${job.company} application form is now open and added to your tracker.`}
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-neon-blue/15 text-neon-blue text-sm font-medium hover:bg-neon-blue/25 transition-colors border border-neon-blue/20"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// RecommendedJobCard
// ============================================================
function RecommendedJobCard({ job, index }: { job: RecommendedJob; index: number }) {
  const [showModal, setShowModal] = useState(false);
  const { addApplication, appliedJobIds } = useAppData();
  const isApplied = appliedJobIds.includes(job.id);
  const src = sourceConfig[job.source];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 * index, duration: 0.35 }}
        className="group relative rounded-xl border border-border/50 bg-card p-4 card-glow flex flex-col justify-between"
      >
        {/* Match score badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-neon-emerald/15 text-neon-emerald border border-neon-emerald/20">
            {job.matchScore}% match
          </span>
        </div>

        {/* Top: company + role */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ backgroundColor: job.logoColor + '22', color: job.logoColor }}
            >
              {job.logo}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate pr-16">{job.title}</p>
              <p className="text-xs text-muted-foreground truncate">{job.company}</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin size={10} /> {job.location}
            </span>
            <span className="text-border">·</span>
            <span className="text-[11px] text-muted-foreground font-mono">{job.postedAgo}</span>
          </div>

          {/* Source badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium mb-3"
            style={{ backgroundColor: src.bgColor, color: src.color }}
          >
            {job.source === 'LinkedIn' && <Linkedin size={11} />}
            {job.source === 'Indeed' && <Search size={11} />}
            {job.source === 'Company Website' && <Globe size={11} />}
            {job.source === 'Bayt' && <Briefcase size={11} />}
            {job.source === 'Dubizzle' && <ExternalLink size={11} />}
            {src.label}
          </div>
        </div>

        {/* Apply button / Applied state */}
        {isApplied ? (
          <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold border bg-neon-emerald/12 text-neon-emerald border-neon-emerald/25">
            <Check size={13} /> Applied
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border',
              job.easyApply
                ? 'bg-neon-blue/12 text-neon-blue border-neon-blue/25 hover:bg-neon-blue/22 hover:border-neon-blue/40'
                : 'bg-neon-purple/12 text-neon-purple border-neon-purple/25 hover:bg-neon-purple/22 hover:border-neon-purple/40'
            )}
          >
            {job.easyApply ? <Zap size={13} /> : <ExternalLink size={13} />}
            {job.easyApply ? 'Easy Apply' : 'Apply Now'}
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <ApplyModal
            job={job}
            onClose={() => setShowModal(false)}
            onApplied={() => addApplication(job)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================
// CV Card — real file picker, stores the chosen filename
// ============================================================
function CVCard() {
  const { cvFileName, setCvFileName } = useAppData();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setCvFileName(file.name);
    }, 1200);
    e.target.value = ''; // allow re-picking the same file later
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-xl border border-border/50 bg-card p-5 mt-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-md bg-neon-cyan/15 flex items-center justify-center">
          <FileText size={14} className="text-neon-cyan" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Your CV</h3>
          <p className="text-[10px] text-muted-foreground">Parsed summary</p>
        </div>
      </div>

      {/* Name & Degree */}
      <div className="mb-3">
        <p className="text-sm font-medium">{cvData.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <GraduationCap size={11} /> {cvData.degree}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Top Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {cvData.skills.map((skill) => (
            <span
              key={skill.name}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{
                backgroundColor: skill.color + '15',
                color: skill.color,
                borderColor: skill.color + '30',
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Experience</p>
        <ul className="space-y-1">
          {cvData.experience.map((exp, i) => (
            <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-neon-blue mt-1.5 shrink-0" />
              {exp}
            </li>
          ))}
        </ul>
      </div>

      {/* Match Score */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-emerald/8 border border-neon-emerald/20 mb-3">
        <Target size={14} className="text-neon-emerald shrink-0" />
        <p className="text-xs text-neon-emerald font-medium">
          CV matched to <span className="font-bold font-mono">{cvData.matchedJobs}</span> recommended jobs
        </p>
      </div>

      {/* Current file (after upload) */}
      {cvFileName && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-blue/8 border border-neon-blue/20 mb-3">
          <FileText size={13} className="text-neon-blue shrink-0" />
          <p className="text-xs text-foreground/80 truncate">
            Current file: <span className="font-medium">{cvFileName}</span>
          </p>
        </div>
      )}

      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFile}
      />

      {/* Re-upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent transition-all duration-200 border border-border/30 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload size={12} />
            Re-upload CV
          </>
        )}
      </button>
    </motion.div>
  );
}

// ============================================================
// Custom Tooltip for chart
// ============================================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-2 border border-border/50 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-neon-blue">
          {payload[0].value} applications
        </p>
      </div>
    );
  }
  return null;
};

// ============================================================
// Dashboard Page
// ============================================================
export default function Dashboard() {
  const { applications, stats, profile } = useAppData();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {profile.name} <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your job applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-neon-blue/30">
            <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Total Applications"
          value={stats.totalApplications}
          glowClass="glow-blue"
          iconBg="bg-neon-blue"
          delay={0.1}
        />
        <StatCard
          icon={Users}
          label="Interviews Scheduled"
          value={stats.interviewsScheduled}
          glowClass="glow-purple"
          iconBg="bg-neon-purple"
          delay={0.2}
        />
        <StatCard
          icon={Trophy}
          label="Offers Received"
          value={stats.offersReceived}
          glowClass="glow-emerald"
          iconBg="bg-neon-emerald"
          delay={0.3}
        />
        <StatCard
          icon={TrendingUp}
          label="Response Rate"
          value={stats.responseRate}
          suffix="%"
          glowClass="glow-amber"
          iconBg="bg-neon-amber"
          delay={0.4}
        />
      </div>

      {/* ============================================================ */}
      {/* Recommended Jobs Section                                     */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-neon-amber/15 flex items-center justify-center">
              <Sparkles size={14} className="text-neon-amber" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Recommended for You</h2>
              <p className="text-xs text-muted-foreground">
                Based on your CV and application history
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {recommendedJobs.length} jobs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedJobs.map((job, i) => (
            <RecommendedJobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 rounded-xl border border-border/50 bg-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base">Application Tracker</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track your progress across all applications
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
              {applications.length} total
            </span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/30">
            <span className="w-10" />
            <span>Position</span>
            <span className="hidden md:block">Date</span>
            <span>Status</span>
            <span className="hidden lg:block w-24">Progress</span>
            <span className="w-8" />
          </div>

          {/* Application Rows */}
          <div className="divide-y divide-border/20 max-h-[480px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {applications.map((app, i) => (
                <ApplicationRow key={app.id} app={app} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column: Activity Chart + CV Card */}
        <div>
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <div className="mb-4">
              <h2 className="font-semibold text-base">Application Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Applications sent per week
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity} barSize={24}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.30 0.02 260)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 260)' }}
                    axisLine={{ stroke: 'oklch(0.30 0.02 260)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'oklch(0.65 0.02 260)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.22 0.02 260 / 0.5)' }} />
                  <Bar
                    dataKey="applications"
                    fill="oklch(0.65 0.22 255)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Legend */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-2">Status Breakdown</p>
              <div className="grid grid-cols-2 gap-2">
                {(['Applied', 'Interview', 'Assessment', 'Offer', 'Rejected'] as const).map(
                  (status) => {
                    const count = applications.filter((a) => a.status === status).length;
                    return (
                      <div key={status} className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            statusProgressColors[status]
                          )}
                        />
                        <span className="text-xs text-muted-foreground">
                          {status}{' '}
                          <span className="font-mono font-semibold text-foreground/70">
                            {count}
                          </span>
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </motion.div>

          {/* CV Card */}
          <CVCard />
        </div>
      </div>
    </div>
  );
}
