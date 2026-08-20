import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span>
                Split<span className="gradient-text">Share</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The modern SaaS subscription cost-sharing platform. Split Netflix, Spotify, ChatGPT Plus, Canva & Adobe with verified members seamlessly using bKash, Nagad & Bank transfer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/browse" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Browse Subscriptions</Link></li>
              <li><Link to="/create-team" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Host a Team</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">User Dashboard</Link></li>
              <li><Link to="/payments" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Payment Audit</Link></li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Supported Services</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              <li>Netflix Premium 4K UHD</li>
              <li>ChatGPT Plus & OpenAI Teams</li>
              <li>Canva Pro & Adobe Creative Cloud</li>
              <li>Spotify Family & YouTube Premium</li>
            </ul>
          </div>

          {/* Payment Methods & Security */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Payment Methods</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/20">bKash</span>
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/20">Nagad</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">Bank Transfer</span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">SSLCommerz</span>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Credential Lock System</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SplitShare. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for smart subscription sharing.
          </p>
        </div>
      </div>
    </footer>
  );
};
