// ============================================================
// AppDataContext — single in-browser source of truth for the demo.
// No backend. All data lives here and persists to localStorage.
// Bump STORE_VERSION whenever seed data changes to discard old saves.
// ============================================================
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import {
  applications as seedApplications,
  deadlines as seedDeadlines,
  emails as seedEmails,
  profileData as seedProfile,
  type Application,
  type Deadline,
  type Email,
  type ApplicationStatus,
  type RecommendedJob,
} from '@/lib/data';

const STORE_KEY = 'jobtrack-demo';
const STORE_VERSION = 1;

// ------------------------------------------------------------
// Date helpers (keep deadlines always "upcoming" on any demo day)
// ------------------------------------------------------------
function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function urgencyFor(daysLeft: number): Deadline['urgency'] {
  if (daysLeft <= 2) return 'red';
  if (daysLeft <= 7) return 'orange';
  return 'green';
}

// ------------------------------------------------------------
// Settings shape
// ------------------------------------------------------------
type Platform = 'Gmail' | 'LinkedIn' | 'Outlook';

interface AppSettings {
  deadlineReminders: boolean;
  newEmailAlerts: boolean;
  weeklySummary: boolean;
  statusUpdates: boolean;
  connected: Record<Platform, boolean>;
}

interface Profile {
  name: string;
  fullName: string;
  university: string;
  graduationYear: string;
  fieldOfStudy: string;
  email: string;
  avatarUrl: string;
}

interface PersistedState {
  version: number;
  applications: Application[];
  deadlines: Deadline[];
  emails: Email[];
  appliedJobIds: string[];
  cvFileName: string | null;
  profile: Profile;
  settings: AppSettings;
}

// ------------------------------------------------------------
// Build the fresh seed state (relative dates regenerated to today)
// ------------------------------------------------------------
function buildSeed(): PersistedState {
  // Deadlines: convert each seed's daysLeft into a real upcoming date,
  // so the countdown is always correct no matter what day we demo.
  const deadlines: Deadline[] = seedDeadlines.map((d) => {
    const dueDate = new Date();
    dueDate.setHours(0, 0, 0, 0);
    dueDate.setDate(dueDate.getDate() + d.daysLeft);
    return {
      ...d,
      date: formatDate(dueDate),
      daysLeft: d.daysLeft,
      urgency: urgencyFor(d.daysLeft),
    };
  });

  return {
    version: STORE_VERSION,
    applications: JSON.parse(JSON.stringify(seedApplications)),
    deadlines,
    emails: JSON.parse(JSON.stringify(seedEmails)),
    appliedJobIds: [],
    cvFileName: null,
    profile: { ...seedProfile },
    settings: {
      deadlineReminders: true,
      newEmailAlerts: true,
      weeklySummary: false,
      statusUpdates: true,
      connected: { Gmail: true, LinkedIn: false, Outlook: false },
    },
  };
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return buildSeed();
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || parsed.version !== STORE_VERSION) return buildSeed();
    return parsed;
  } catch {
    return buildSeed();
  }
}

// ------------------------------------------------------------
// Context value
// ------------------------------------------------------------
interface AppDataContextType {
  applications: Application[];
  deadlines: Deadline[];
  emails: Email[];
  appliedJobIds: string[];
  cvFileName: string | null;
  profile: Profile;
  settings: AppSettings;
  stats: {
    totalApplications: number;
    interviewsScheduled: number;
    offersReceived: number;
    responseRate: number;
  };
  unreadCount: number;
  // actions
  addApplication: (job: RecommendedJob) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  completeDeadline: (id: string) => void;
  addDeadline: (input: {
    company: string;
    role: string;
    type: Deadline['type'];
    date: string;
  }) => void;
  markEmailRead: (id: string) => void;
  archiveEmail: (id: string) => void;
  replyEmail: (id: string) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  toggleSetting: (key: keyof Omit<AppSettings, 'connected'>) => void;
  toggleConnection: (platform: Platform) => void;
  setCvFileName: (name: string) => void;
  resetDemo: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const progressForStatus: Record<ApplicationStatus, number> = {
  Applied: 15,
  Assessment: 40,
  Interview: 60,
  Offer: 100,
  Rejected: 100,
};

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState());

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — demo still works in-memory */
    }
  }, [state]);

  // Derived stats (always in sync with the applications list)
  const stats = useMemo(() => {
    const apps = state.applications;
    const total = apps.length;
    const responded = apps.filter((a) => a.status !== 'Applied').length;
    return {
      totalApplications: total,
      interviewsScheduled: apps.filter((a) => a.status === 'Interview').length,
      offersReceived: apps.filter((a) => a.status === 'Offer').length,
      responseRate: total ? Math.round((responded / total) * 100) : 0,
    };
  }, [state.applications]);

  const unreadCount = useMemo(
    () => state.emails.filter((e) => !e.read).length,
    [state.emails]
  );

  // -------------------- actions --------------------
  const addApplication = (job: RecommendedJob) => {
    setState((s) => {
      if (s.appliedJobIds.includes(job.id)) return s;
      const newApp: Application = {
        id: nanoid(6),
        company: job.company,
        role: job.title,
        dateApplied: formatDate(new Date()),
        status: 'Applied',
        progress: 15,
        logo: job.logo,
        logoColor: job.logoColor,
        location: job.location,
        salary: '—',
        notes: `Applied via ${job.source}.`,
      };
      return {
        ...s,
        applications: [newApp, ...s.applications],
        appliedJobIds: [...s.appliedJobIds, job.id],
      };
    });
    toast.success(`Applied to ${job.title} at ${job.company}`);
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.id === id ? { ...a, status, progress: progressForStatus[status] } : a
      ),
    }));
    toast(`Status updated to ${status}`);
  };

  const completeDeadline = (id: string) => {
    const d = state.deadlines.find((x) => x.id === id);
    setState((s) => ({
      ...s,
      deadlines: s.deadlines.filter((x) => x.id !== id),
    }));
    toast.success(d ? `${d.company} — marked complete` : 'Marked complete');
  };

  const addDeadline = (input: {
    company: string;
    role: string;
    type: Deadline['type'];
    date: string;
  }) => {
    const daysLeft = daysUntil(input.date);
    const newDeadline: Deadline = {
      id: nanoid(6),
      company: input.company,
      role: input.role,
      type: input.type,
      date: formatDate(new Date(input.date)),
      daysLeft,
      urgency: urgencyFor(daysLeft),
    };
    setState((s) => ({ ...s, deadlines: [...s.deadlines, newDeadline] }));
    toast.success(`Deadline added for ${input.company}`);
  };

  const markEmailRead = (id: string) => {
    setState((s) => ({
      ...s,
      emails: s.emails.map((e) => (e.id === id ? { ...e, read: true } : e)),
    }));
  };

  const archiveEmail = (id: string) => {
    const e = state.emails.find((x) => x.id === id);
    setState((s) => ({ ...s, emails: s.emails.filter((x) => x.id !== id) }));
    toast(e ? `Archived email from ${e.company}` : 'Email archived');
  };

  const replyEmail = (id: string) => {
    setState((s) => ({
      ...s,
      emails: s.emails.map((e) => (e.id === id ? { ...e, read: true } : e)),
    }));
    const e = state.emails.find((x) => x.id === id);
    toast.success(e ? `Reply sent to ${e.sender}` : 'Reply sent');
  };

  const updateProfile = (partial: Partial<Profile>) => {
    setState((s) => {
      const next = { ...s.profile, ...partial };
      // keep first-name greeting in sync with full name
      if (partial.fullName) {
        next.name = partial.fullName.trim().split(' ')[0] || next.name;
      }
      return { ...s, profile: next };
    });
    toast.success('Profile updated');
  };

  const toggleSetting = (key: keyof Omit<AppSettings, 'connected'>) => {
    setState((s) => ({
      ...s,
      settings: { ...s.settings, [key]: !s.settings[key] },
    }));
  };

  const toggleConnection = (platform: Platform) => {
    setState((s) => {
      const now = !s.settings.connected[platform];
      toast(now ? `${platform} connected` : `${platform} disconnected`);
      return {
        ...s,
        settings: {
          ...s.settings,
          connected: { ...s.settings.connected, [platform]: now },
        },
      };
    });
  };

  const setCvFileName = (name: string) => {
    setState((s) => ({ ...s, cvFileName: name }));
    toast.success('CV updated');
  };

  const resetDemo = () => {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    setState(buildSeed());
    toast.success('Demo reset to starting state');
  };

  const value: AppDataContextType = {
    applications: state.applications,
    deadlines: state.deadlines,
    emails: state.emails,
    appliedJobIds: state.appliedJobIds,
    cvFileName: state.cvFileName,
    profile: state.profile,
    settings: state.settings,
    stats,
    unreadCount,
    addApplication,
    updateApplicationStatus,
    completeDeadline,
    addDeadline,
    markEmailRead,
    archiveEmail,
    replyEmail,
    updateProfile,
    toggleSetting,
    toggleConnection,
    setCvFileName,
    resetDemo,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
