import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoRoleBar } from './components/ui/DemoRoleBar';
import { ToastContainer } from './components/ui/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { BrowseTeamsPage } from './pages/BrowseTeamsPage';
import { TeamDetailsPage } from './pages/TeamDetailsPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyTeamsPage } from './pages/MyTeamsPage';
import { CreateTeamPage } from './pages/CreateTeamPage';
import { ManageTeamPage } from './pages/ManageTeamPage';
import { TeamWorkspacePage } from './pages/TeamWorkspacePage';
import { PaymentHistoryPage } from './pages/PaymentHistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminTeamsPage } from './pages/AdminTeamsPage';
import { AdminPaymentsPage } from './pages/AdminPaymentsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
              <DemoRoleBar />
              <Navbar />

              <div className="flex-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/browse" element={<BrowseTeamsPage />} />
                  <Route path="/team/:teamId" element={<TeamDetailsPage />} />
                  <Route path="/login" element={<AuthPage initialMode="login" />} />
                  <Route path="/register" element={<AuthPage initialMode="register" />} />

                  {/* Authenticated Workspace */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/my-teams" element={<MyTeamsPage />} />
                  <Route path="/create-team" element={<CreateTeamPage />} />
                  <Route path="/manage/:teamId" element={<ManageTeamPage />} />
                  <Route path="/workspace/:teamId" element={<TeamWorkspacePage />} />
                  <Route path="/payments" element={<PaymentHistoryPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Admin Panel */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/teams" element={<AdminTeamsPage />} />
                  <Route path="/admin/payments" element={<AdminPaymentsPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              <Footer />
              <ToastContainer />
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
