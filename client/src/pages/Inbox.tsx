// ============================================================
// DESIGN: Neon Command Center — Email client layout
// List on left, preview on right, category tabs.
// Read state, reply, and archive all driven by the store.
// ============================================================
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Reply,
  Archive,
  Send,
  X,
} from 'lucide-react';
import { type Email } from '@/lib/data';
import { useAppData } from '@/contexts/AppDataContext';
import { cn } from '@/lib/utils';

const categories = ['All', 'Interviews', 'Assessments', 'Offers', 'Rejections', 'Follow-ups'] as const;

const quickReplies = [
  'Thank you for reaching out — I confirm my availability.',
  'Thank you for the update. I look forward to the next steps.',
  'Thank you for letting me know. I appreciate your time.',
];

export default function Inbox() {
  const { emails, markEmailRead, archiveEmail, replyEmail, unreadCount } = useAppData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedId, setSelectedId] = useState<string | null>(emails[0]?.id ?? null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const filteredEmails = useMemo(() => {
    if (selectedCategory === 'All') return emails;
    return emails.filter((e) => e.category === selectedCategory);
  }, [selectedCategory, emails]);

  // Keep a valid selection if the current email was archived / filtered out
  const selectedEmail: Email | null =
    emails.find((e) => e.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedEmail && filteredEmails.length > 0) {
      setSelectedId(filteredEmails[0].id);
    }
  }, [selectedEmail, filteredEmails]);

  const handleSelectEmail = (email: Email) => {
    setSelectedId(email.id);
    setReplyOpen(false);
    setReplyText('');
    if (!email.read) markEmailRead(email.id);
  };

  const handleSendReply = () => {
    if (!selectedEmail || !replyText.trim()) return;
    replyEmail(selectedEmail.id);
    setReplyText('');
    setReplyOpen(false);
  };

  const handleArchive = () => {
    if (!selectedEmail) return;
    const id = selectedEmail.id;
    setSelectedId(null);
    archiveEmail(id);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Smart Inbox
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-mono">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All your application-related emails in one place
            </p>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? emails.length
                : emails.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1.5',
                  selectedCategory === cat
                    ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
                )}
              >
                {cat}
                <span className="font-mono text-[10px] opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className="w-full md:w-[380px] lg:w-[420px] border-r border-border/50 overflow-y-auto shrink-0">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-20">
              <Mail size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No emails here.</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredEmails.map((email, i) => {
                const isSelected = selectedId === email.id;
                const isUnread = !email.read;

                return (
                  <motion.button
                    key={email.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: 0.02 * Math.min(i, 10) }}
                    onClick={() => handleSelectEmail(email)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-border/20 transition-all duration-200 group',
                      isSelected
                        ? 'bg-neon-blue/8 border-l-2 border-l-neon-blue'
                        : 'hover:bg-accent/30 border-l-2 border-l-transparent'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread Dot */}
                      <div className="pt-1.5 shrink-0">
                        {isUnread ? (
                          <div className="w-2 h-2 rounded-full bg-neon-blue neon-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-transparent" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              'text-sm truncate',
                              isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/70'
                            )}
                          >
                            {email.sender}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {email.time}
                          </span>
                        </div>

                        <p
                          className={cn(
                            'text-xs mt-0.5 truncate',
                            isUnread ? 'text-foreground/80' : 'text-muted-foreground'
                          )}
                        >
                          {email.subject}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{
                              backgroundColor: email.companyColor + '18',
                              color: email.companyColor,
                            }}
                          >
                            {email.company}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {email.preview.slice(0, 40)}...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Email Preview */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedEmail ? (
              <motion.div
                key={selectedEmail.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Email Header */}
                <div className="px-6 py-4 border-b border-border/50">
                  <h2 className="text-lg font-semibold">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: selectedEmail.companyColor + '22',
                        color: selectedEmail.companyColor,
                      }}
                    >
                      {selectedEmail.company[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedEmail.sender}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedEmail.senderEmail} · {selectedEmail.date} at{' '}
                        {selectedEmail.time}
                      </p>
                    </div>
                    <span
                      className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        backgroundColor: selectedEmail.companyColor + '18',
                        color: selectedEmail.companyColor,
                      }}
                    >
                      {selectedEmail.company}
                    </span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="whitespace-pre-line text-sm text-foreground/85 leading-relaxed max-w-2xl">
                    {selectedEmail.body}
                  </div>

                  {/* Reply composer */}
                  <AnimatePresence>
                    {replyOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 max-w-2xl"
                      >
                        <div className="rounded-xl border border-border/50 bg-surface-2/40 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground">
                              Reply to {selectedEmail.sender}
                            </p>
                            <button
                              onClick={() => setReplyOpen(false)}
                              className="p-1 rounded hover:bg-accent text-muted-foreground"
                            >
                              <X size={13} />
                            </button>
                          </div>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                            placeholder="Write your reply…"
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm outline-none focus:border-neon-blue/50 resize-none"
                          />
                          {/* Quick replies */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {quickReplies.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => setReplyText(q)}
                                className="px-2 py-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-border/30 transition-colors"
                              >
                                {q.slice(0, 28)}…
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={handleSendReply}
                              disabled={!replyText.trim()}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neon-blue/15 text-neon-blue text-sm font-medium hover:bg-neon-blue/25 transition-colors border border-neon-blue/20 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Send size={13} /> Send
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="px-6 py-3 border-t border-border/50 flex items-center gap-2">
                  <button
                    onClick={() => setReplyOpen((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/15 text-neon-blue text-sm font-medium hover:bg-neon-blue/25 transition-colors border border-neon-blue/20"
                  >
                    <Reply size={14} />
                    Reply
                  </button>
                  <button
                    onClick={handleArchive}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-muted-foreground text-sm font-medium hover:bg-accent/80 transition-colors border border-border/30"
                  >
                    <Archive size={14} />
                    Archive
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-center">
                  <Mail size={48} className="text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Select an email to read
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
