import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ShoppingCart, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { notificationsData } from '../../mock/ecommerceData';

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const popoverRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'info':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'agent':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="header-icon-btn relative"
      >
        <Bell className="w-4 h-4 text-slate-300" />
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-popover">
          <div className="notif-header">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${n.unread ? 'notif-item-unread' : ''}`}
              >
                <div className="notif-icon-wrap">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{n.title}</p>
                    <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="notif-footer">
            <span className="text-[11px] text-slate-400">All alerts in sync with ARGUS Core</span>
          </div>
        </div>
      )}
    </div>
  );
}
