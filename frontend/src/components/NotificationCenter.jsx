import React, { useState, useEffect } from 'react';
import { api, tokenService } from '../services/api';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          const token = tokenService.getToken();
          const res = await api.getNotifications(token);
          if (res.status && res.notifications) {
            setNotifications(res.notifications);
          }
        } catch (err) {
          console.error('Failed to fetch notifications:', err);
        }
      };
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 bg-surface-container-high/80 backdrop-blur-[64px] border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col transform transition-transform duration-500 ease-out translate-x-0">
      {/* Overlay Header */}
      <header className="flex items-center justify-between p-lg pb-md border-b border-white/5 shrink-0">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2">
            Notifications
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-label-sm text-label-sm border border-primary/20 ml-2">
              {notifications.filter(n => !n.read).length} New
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="font-label-lg text-label-lg text-on-surface-variant hover:text-tertiary transition-colors focus:outline-none">
            Clear All
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-variant/50 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-lg py-sm flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
        <button className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm transition-colors whitespace-nowrap">All</button>
        <button className="px-4 py-1.5 rounded-full bg-surface text-on-surface-variant font-label-sm text-label-sm border border-white/5 hover:bg-white/5 transition-colors whitespace-nowrap">Unread</button>
      </div>

      {/* Notification List */}
      <div className="flex-grow overflow-y-auto px-sm py-2 pb-24 space-y-1">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-on-surface-variant">No notifications.</div>
        ) : (
          notifications.map(notif => (
            <div key={notif._id} className={`relative group p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 flex gap-4 items-start cursor-pointer border border-transparent hover:border-white/5 ${notif.read ? 'opacity-70' : ''}`}>
              {!notif.read && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(161,212,148,0.6)]"></div>
              )}
              <div className="w-12 h-12 rounded-full bg-primary-container/30 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-label-lg text-label-lg text-on-surface mb-1 truncate">{notif.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 leading-snug">
                  {notif.message}
                </p>
                <span className="font-label-sm text-label-sm text-on-surface-variant/60 mt-2 block">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-surface-container-high to-transparent pointer-events-none"></div>
    </aside>
  );
}
