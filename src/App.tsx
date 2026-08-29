import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';


import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoRoleBar } from './components/ui/DemoRoleBar';
import { ToastContainer } from './components/ui/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';

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
        <>
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
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/my-teams" element={<ProtectedRoute><MyTeamsPage /></ProtectedRoute>} />
                  <Route path="/create-team" element={<ProtectedRoute><CreateTeamPage /></ProtectedRoute>} />
                  <Route path="/manage/:teamId" element={<ProtectedRoute><ManageTeamPage /></ProtectedRoute>} />
                  <Route path="/workspace/:teamId" element={<ProtectedRoute><TeamWorkspacePage /></ProtectedRoute>} />
                  <Route path="/payments" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                  {/* Admin Panel */}
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsersPage /></ProtectedRoute>} />
                  <Route path="/admin/teams" element={<ProtectedRoute requireAdmin><AdminTeamsPage /></ProtectedRoute>} />
                  <Route path="/admin/payments" element={<ProtectedRoute requireAdmin><AdminPaymentsPage /></ProtectedRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              <Footer />
              <ToastContainer />
            </div>
          </BrowserRouter>
        </>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
