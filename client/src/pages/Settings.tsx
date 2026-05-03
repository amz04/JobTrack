// ============================================================
// DESIGN: Neon Command Center — Clean settings layout
// Profile, Notifications, Appearance, Connected Accounts
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
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { profileData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof User;
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

function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

function ConnectedAccount({
  name,
  icon,
  iconColor,
  connected = false,
}: {
  name: string;
  icon: string;
  iconColor: string;
  connected?: boolean;
}) {
  const [isConnected, setIsConnected] = useState(connected);

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
            {isConnected ? 'Connected' : 'Not connected'}
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          setIsConnected(!isConnected);
          toast(isConnected ? `${name} disconnected` : `${name} connected`);
        }}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
          isConnected
            ? 'bg-neon-emerald/10 text-neon-emerald border-neon-emerald/30 hover:bg-neon-emerald/20'
            : 'bg-accent text-muted-foreground border-border/50 hover:text-foreground hover:bg-accent/80'
        )}
      >
        {isConnected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);

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
        />

        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-neon-blue/30 shrink-0">
            <img
              src={profileData.avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Full Name</label>
                <p className="text-sm font-medium mt-0.5">{profileData.fullName}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Email</label>
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5">
                  <MailIcon size={12} className="text-muted-foreground" />
                  {profileData.email}
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">University</label>
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5">
                  <GraduationCap size={12} className="text-muted-foreground" />
                  {profileData.university}
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Graduation Year</label>
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5">
                  <Calendar size={12} className="text-muted-foreground" />
                  {profileData.graduationYear}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground font-medium">Field of Study</label>
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5">
                  <BookOpen size={12} className="text-muted-foreground" />
                  {profileData.fieldOfStudy}
                </p>
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
            description="Get notified 24 hours before upcoming deadlines"
            defaultChecked={true}
          />
          <ToggleRow
            label="New Email Alerts"
            description="Receive push notifications for new application emails"
            defaultChecked={true}
          />
          <ToggleRow
            label="Weekly Summary"
            description="Get a weekly digest of your application activity"
            defaultChecked={false}
          />
          <ToggleRow
            label="Status Updates"
            description="Notifications when application status changes"
            defaultChecked={true}
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
            {darkMode ? (
              <Moon size={18} className="text-neon-purple" />
            ) : (
              <Sun size={18} className="text-neon-amber" />
            )}
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {darkMode ? 'Dark theme is active' : 'Light theme is active'}
              </p>
            </div>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={(val) => {
              setDarkMode(val);
              toast(val ? 'Dark mode enabled' : 'Light mode enabled');
            }}
          />
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
            connected={true}
          />
          <ConnectedAccount
            name="LinkedIn"
            icon="in"
            iconColor="#0A66C2"
            connected={false}
          />
          <ConnectedAccount
            name="Outlook"
            icon="O"
            iconColor="#0078D4"
            connected={false}
          />
        </div>
      </motion.section>
    </div>
  );
}
