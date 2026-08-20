import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Trash2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationAsRead, clearNotifications } = useData();
  const navigate = useNavigate();

  const userNotifs = notifications.filter(n => n.userId === currentUser?.id);

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]} />

        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications Hub</h1>
            <p className="text-xs text-slate-500">Alerts for join requests, payment verifications & credential changes</p>
          </div>
          {userNotifs.length > 0 && (
            <Button variant="outline" size="sm" leftIcon={<Trash2 className="w-4 h-4" />} onClick={clearNotifications}>
              Clear All Notifications
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {userNotifs.length === 0 ? (
            <Card className="p-12 text-center text-slate-500 text-xs">No notifications to display.</Card>
          ) : (
            userNotifs.map(n => (
              <Card
                key={n.id}
                hoverEffect
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.link) navigate(n.link);
                }}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                  !n.read ? 'border-l-4 border-l-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
                  </div>
                </div>

                {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
