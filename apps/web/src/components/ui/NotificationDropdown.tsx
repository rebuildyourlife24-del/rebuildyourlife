'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

interface NotificationDropdownProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n: AppNotification) => {
    if (!n.isRead) {
      onMarkAsRead(n.id);
    }
    setIsOpen(false);
    if (n.actionUrl) {
      router.push(n.actionUrl);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface/50 text-textSecondary transition-colors hover:bg-surface hover:text-textPrimary border border-white/[0.05]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 lg:w-96 rounded-2xl border border-white/10 bg-navy/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/5 bg-surface/30 px-4 py-3">
              <h3 className="font-semibold text-textPrimary">Notificaties</h3>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-gold hover:text-gold-light transition-colors"
                >
                  Alles gelezen
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-textSecondary">
                  Je hebt nog geen notificaties.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left p-4 transition-colors hover:bg-surface/50 flex gap-4 ${
                        !n.isRead ? 'bg-gold/5' : ''
                      }`}
                    >
                      <div className="mt-1">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          !n.isRead ? 'bg-gold/20 text-gold' : 'bg-surface text-textSecondary'
                        }`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                            <path d="M12 12 2.1 7.1" />
                            <path d="m15.3 16.4 5.4-8.8" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm ${!n.isRead ? 'font-semibold text-textPrimary' : 'font-medium text-textSecondary'}`}>
                          {n.title}
                        </h4>
                        <p className={`mt-1 text-xs ${!n.isRead ? 'text-textSecondary' : 'text-textSecondary/60'}`}>
                          {n.message}
                        </p>
                        <p className="mt-2 text-[10px] text-textSecondary/40">
                          {new Date(n.createdAt).toLocaleString('nl-NL')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
