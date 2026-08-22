import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import { useTheme } from '../context/ThemeContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Sun, Moon, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [bKashReminders, setBKashReminders] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, bio, phone });
    alert('Your profile details have been saved.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setCurrentPassword('');
    setNewPassword('');
    alert('Your password was changed successfully.');
  };

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
          <p className="text-xs text-slate-500">Manage your profile, security, theme and preferences</p>
        </div>

        {/* Profile Info */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Edit Profile Information</h3>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-lg">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="bKash / Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
            <Textarea label="Bio & Description" rows={3} value={bio} onChange={e => setBio(e.target.value)} />
            <Button type="submit" variant="primary" className="w-fit">
              Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Security / Password */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Password & Security</h3>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 max-w-lg">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <Button type="submit" variant="outline" className="w-fit">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Appearance & Theme */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Appearance Theme</h3>
          <div className="flex items-center justify-between max-w-lg">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Interface Theme</p>
              <p className="text-xs text-slate-500">Current mode: {theme.toUpperCase()}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              leftIcon={theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            >
              Toggle Mode
            </Button>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
          <div className="flex flex-col gap-3 max-w-lg">
            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Email Renewal Reminders</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>bKash Payment Verification Alerts</span>
              <input
                type="checkbox"
                checked={bKashReminders}
                onChange={e => setBKashReminders(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </Card>

        {/* Delete Account */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-rose-600">Delete Account</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Permanently remove your account and data from SplitShare.</p>
          <Button variant="danger" size="sm" onClick={() => alert('Demo user account protection enabled.')}>
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete SplitShare Account
          </Button>
        </Card>
      </main>
    </div>
  );
};
