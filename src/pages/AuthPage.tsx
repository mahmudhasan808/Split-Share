import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Layers, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const { login, register, switchRole } = useAuth();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email) {
          setError('Please enter your email address');
          setLoading(false);
          return;
        }
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'register') {
        if (!name || !email) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }
        await register(name, email, password);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        if (!email) {
          setError('Please enter your email address');
          setLoading(false);
          return;
        }
        setSuccessMsg(`Password reset instructions sent to ${email}`);
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-2xl">
        {/* Brand logo */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {mode === 'login' && 'Welcome back to SplitShare'}
            {mode === 'register' && 'Create your SplitShare account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' && 'Sign in to access your shared subscription teams'}
            {mode === 'register' && 'Start sharing Netflix, Spotify & ChatGPT costs in 1 minute'}
            {mode === 'forgot' && 'Enter your account email to receive a password reset link'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 mb-4">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <Input
              label="Full Name"
              placeholder="e.g. Tanvir Hossain"
              value={name}
              onChange={e => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          {mode !== 'forgot' && (
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button type="submit" variant="primary" isLoading={loading} className="w-full mt-2">
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Send Reset Link'}
          </Button>
        </form>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-3">
            Instant Demo Account Access
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                switchRole('member');
                navigate('/dashboard');
              }}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              John (Member)
            </button>
            <button
              onClick={() => {
                switchRole('owner');
                navigate('/dashboard');
              }}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-500/10 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Alex (Owner)
            </button>
            <button
              onClick={() => {
                switchRole('admin');
                navigate('/dashboard');
              }}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-500/10 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Sarah (Admin)
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
