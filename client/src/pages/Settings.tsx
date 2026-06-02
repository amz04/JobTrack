// ============================================================
// DESIGN: Neon Command Center — Clean settings layout
// Profile (editable), Notifications, Appearance, Connected Accounts.
// All state is driven by the store + ThemeContext.
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Link2,
  GraduationCap,
  Calendar,
  BookOpen,
  Mail as MailIcon,
  Sun,
  Moon,
  Pencil,
  Check,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAppData } from '@/contexts/AppDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof User;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-neon-blue/10 flex items-center justify-center">
          <Icon size={18} className="text-neon-blue" />
        </div>
        <div>
          <h2 className="font-semibold text-base">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ConnectedAccount({
  name,
  icon,
  iconColor,
  connected,
  onToggle,
}: {
  name: string;
  icon: string;
  iconColor: string;
  connected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: iconColor + '18', color: iconColor }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {connected ? 'Connected' : 'Not connected'}
          </p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
          connected
            ? 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/30 hover:bg-neon-emerald/20'
            : 'bg-accent text-muted-foreground border-border/50 hover:text-foreground hover:bg-accent/80'
        )}
      >
        {connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  editing,
  onChange,
}: {
  label: string;
  icon?: typeof User;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full px-3 py-1.5 rounded-lg bg-background border border-border/50 text-sm outline-none focus:border-neon-blue/50"
        />
      ) : (
        <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5 min-h-[30px]">
          {Icon && <Icon size={12} className="text-muted-foreground" />}
          {value}
        </p>
      )}
    </div>
  );
}

export default function Settings() {
  const {
    profile,
    settings,
    updateProfile,
    toggleSetting,
    toggleConnection,
  } = useAppData();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };
  const saveEdit = () => {
    updateProfile(draft);
    setEditing(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[800px] space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences and integrations
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <SectionHeader
          icon={User}
          title="Profile"
          description="Your personal information"
          action={
            editing ? (
              <button
                onClick={saveEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-emerald/12 text-neon-emerald text-xs font-medium hover:bg-neon-emerald/20 transition-colors border border-neon-emerald/25"
              >
                <Check size={13} /> Save
              </button>
            ) : (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-muted-foreground text-xs font-medium hover:text-foreground hover:bg-accent/80 transition-colors border border-border/30"
              >
                <Pencil size={12} /> Edit
              </button>
            )
          }
        />

        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-neon-blue/30 shrink-0">
            <img
              src={profile.avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Full Name"
                value={editing ? draft.fullName : profile.fullName}
                editing={editing}
                onChange={(v) => setDraft({ ...draft, fullName: v })}
              />
              <Field
                label="Email"
                icon={MailIcon}
                value={editing ? draft.email : profile.email}
                editing={editing}
                onChange={(v) => setDraft({ ...draft, email: v })}
              />
              <Field
                label="University"
                icon={GraduationCap}
                value={editing ? draft.university : profile.university}
                editing={editing}
                onChange={(v) => setDraft({ ...draft, university: v })}
              />
              <Field
                label="Graduation Year"
                icon={Calendar}
                value={editing ? draft.graduationYear : profile.graduationYear}
                editing={editing}
                onChange={(v) => setDraft({ ...draft, graduationYear: v })}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Field of Study"
                  icon={BookOpen}
                  value={editing ? draft.fieldOfStudy : profile.fieldOfStudy}
                  editing={editing}
                  onChange={(v) => setDraft({ ...draft, fieldOfStudy: v })}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Notifications Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Configure how you receive alerts"
        />

        <div className="divide-y divide-border/30">
          <ToggleRow
            label="Deadline Reminders"
            description="Show a reminder banner for upcoming deadlines"
            checked={settings.deadlineReminders}
            onChange={() => toggleSetting('deadlineReminders')}
          />
          <ToggleRow
            label="New Email Alerts"
            description="Receive notifications for new application emails"
            checked={settings.newEmailAlerts}
            onChange={() => toggleSetting('newEmailAlerts')}
          />
          <ToggleRow
            label="Weekly Summary"
            description="Get a weekly digest of your application activity"
            checked={settings.weeklySummary}
            onChange={() => toggleSetting('weeklySummary')}
          />
          <ToggleRow
            label="Status Updates"
            description="Notifications when application status changes"
            checked={settings.statusUpdates}
            onChange={() => toggleSetting('statusUpdates')}
          />
        </div>
      </motion.section>

      {/* Appearance Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <SectionHeader
          icon={Palette}
          title="Appearance"
          description="Customize the look and feel"
        />

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon size={18} className="text-neon-purple" />
            ) : (
              <Sun size={18} className="text-neon-amber" />
            )}
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isDark ? 'Dark theme is active' : 'Light theme is active'}
              </p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={() => toggleTheme?.()} />
        </div>
      </motion.section>

      {/* Connected Accounts Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border/50 bg-card p-6"
      >
        <SectionHeader
          icon={Link2}
          title="Connected Accounts"
          description="Link your accounts for a seamless experience"
        />

        <div className="divide-y divide-border/30">
          <ConnectedAccount
            name="Gmail"
            icon="G"
            iconColor="#EA4335"
            connected={settings.connected.Gmail}
            onToggle={() => toggleConnection('Gmail')}
          />
          <ConnectedAccount
            name="LinkedIn"
            icon="in"
            iconColor="#0A66C2"
            connected={settings.connected.LinkedIn}
            onToggle={() => toggleConnection('LinkedIn')}
          />
          <ConnectedAccount
            name="Outlook"
            icon="O"
            iconColor="#0078D4"
            connected={settings.connected.Outlook}
            onToggle={() => toggleConnection('Outlook')}
          />
        </div>
      </motion.section>
    </div>
  );
}
