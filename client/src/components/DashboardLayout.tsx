// ============================================================
// DESIGN: Neon Command Center — Fixed sidebar with icon nav
// Deep navy sidebar with glowing active indicator.
// Adds: store-driven unread badge, deadline reminder banner, demo reset.
// ============================================================
import { ReactNode, useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  Calendar,
  Mail,
  Settings,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData, daysUntil } from '@/contexts/AppDataContext';
import { cn } from '@/lib/utils';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029430919/DXq4Kckp3tEZgiQpA6EUKp/sidebar-logo-gRiJrYXbnV4pCpsYUM9iZH.webp';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/deadlines', label: 'Deadlines', icon: Calendar },
  { path: '/inbox', label: 'Inbox', icon: Mail },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/contact', label: 'Contact Us', icon: MessageCircle },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { unreadCount, deadlines, settings, resetDemo } = useAppData();

  // Soonest deadline within 2 days (for the reminder banner)
  const soonest = useMemo(() => {
    const upcoming = deadlines
      .map((d) => ({ d, left: daysUntil(d.date) }))
      .filter((x) => x.left >= 0 && x.left <= 2)
      .sort((a, b) => a.left - b.left);
    return upcoming[0] ?? null;
  }, [deadlines]);

  const showBanner =
    settings.deadlineReminders && soonest && !bannerDismissed;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col border-r border-sidebar-border bg-sidebar h-screen shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
            <img src={LOGO_URL} alt="JobTrack" className="w-9 h-9 object-contain" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-lg tracking-tight text-foreground whitespace-nowrap"
              >
                JobTrack
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            const showBadge = item.path === '/inbox' && unreadCount > 0;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-neon-blue"
                      style={{ boxShadow: '0 0 12px oklch(0.65 0.22 255 / 0.6)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="relative shrink-0">
                    <Icon
                      size={20}
                      className={cn(
                        'transition-colors',
                        isActive ? 'text-neon-blue' : ''
                      )}
                    />
                    {showBadge && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neon-rose text-[10px] font-bold flex items-center justify-center text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          'text-sm font-medium whitespace-nowrap',
                          isActive ? 'text-neon-blue' : ''
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer: Reset Demo + Collapse */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Reset the demo to its starting state? This clears any changes you made.'
                )
              ) {
                setBannerDismissed(false);
                resetDemo();
              }
            }}
            title="Reset demo data"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/40 hover:text-neon-rose hover:bg-neon-rose/10 transition-all duration-200"
          >
            <RotateCcw size={16} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium"
                >
                  Reset Demo
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Deadline reminder banner */}
        <AnimatePresence>
          {showBanner && soonest && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-neon-amber/20 bg-neon-amber/8"
            >
              <div className="flex items-center gap-3 px-6 py-2.5">
                <AlertTriangle size={16} className="text-neon-amber shrink-0" />
                <p className="text-sm text-foreground/90 flex-1">
                  <span className="font-semibold">{soonest.d.company}</span>{' '}
                  {soonest.d.type.toLowerCase()} is due{' '}
                  <span className="font-semibold text-neon-amber">
                    {soonest.left === 0
                      ? 'today'
                      : soonest.left === 1
                      ? 'tomorrow'
                      : `in ${soonest.left} days`}
                  </span>
                  .
                </p>
                <Link href="/deadlines">
                  <span className="text-xs font-medium text-neon-amber hover:underline cursor-pointer">
                    View
                  </span>
                </Link>
                <button
                  onClick={() => setBannerDismissed(true)}
                  className="p-1 rounded hover:bg-neon-amber/15 text-muted-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
