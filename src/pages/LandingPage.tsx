import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { SERVICE_PRESETS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  Users,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ChevronDown,
  Star,
  Zap,
  TrendingUp,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const teams: any[] = [];
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      quote: 'SplitShare saved me 75% on my monthly software bill. Sharing ChatGPT Plus and Adobe with 3 teammates is so seamless with bKash payments.',
      name: 'Tanvir Hossain',
      role: 'UI Designer & Freelancer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5
    },
    {
      quote: 'As a team host, managing Netflix 4K members used to be a nightmare of tracking who paid. SplitShare verifies TxIDs automatically and locks credentials safely!',
      name: 'Nusrat Jahan',
      role: 'Content Creator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: 5
    },
    {
      quote: 'Super clean SaaS interface. The dark mode is stunning, and having bKash and Nagad payment options makes it perfect for Bangladesh!',
      name: 'Arafat Rahman',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'How does subscription cost splitting work on SplitShare?',
      a: 'A team owner creates a group for a subscription (like Netflix 4K or Spotify Family). Members join the group and pay their equal split directly via bKash or Nagad. Once the owner verifies the payment proof, shared credentials are automatically revealed to the member!'
    },
    {
      q: 'Are my bKash / Nagad payments safe?',
      a: 'Yes! Every payment requires a Transaction ID (TxID) and optional screenshot upload. Team owners audit payments in real-time before credentials are unlocked.'
    },
    {
      q: 'What happens if a member doesn’t pay for the next cycle?',
      a: 'Team owners can remove unpaid members with a single click, and update subscription credentials securely.'
    },
    {
      q: 'Can I host custom software or private subscriptions?',
      a: 'Absolutely! You can choose any predefined service or select "Custom Service" to set your own price, maximum slots, rules, and payment details.'
    }
  ];

  return (
    <div className="flex flex-col gap-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4 text-center max-w-5xl mx-auto flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Save up to 80% on Premium Subscriptions</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.15]">
          Share Subscription Costs. <br className="hidden sm:inline" />
          <span className="gradient-text">Pay Less, Together.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Connect with trusted team hosts in Bangladesh. Share Netflix 4K, Spotify, Canva, ChatGPT Plus & Adobe with instant bKash/Nagad verification and secure credential vaults.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/browse')}
          >
            Explore Available Teams
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/create-team')}>
            Host Your Subscription
          </Button>
        </div>

        {/* Live Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">385+</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Active Teams</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">৳ 4,85,000+</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Saved by Users</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">1,420+</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verified Members</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">99.8%</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">On-Time Renewal</p>
          </div>
        </div>
      </section>

      {/* Supported Subscriptions Visual Grid */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Popular Supported Services</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick your favorite platform or host a custom software subscription.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SERVICE_PRESETS.slice(0, 10).map(srv => (
            <Card
              key={srv.id}
              hoverEffect
              className="p-4 flex flex-col items-center text-center cursor-pointer group"
              onClick={() => navigate(`/browse?category=${srv.category}`)}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                {srv.logo}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {srv.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                From ৳{Math.round(srv.defaultPriceBDT / srv.defaultMaxMembers)} / mo
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Features Breakdown */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <Badge variant="purple">Everything You Need</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
            Why Hundreds Use SplitShare Daily
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">bKash & Nagad TxID Audit</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Submit your transaction ID or payment proof screenshot. Team owners verify payments with one tap before cycle start.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Secure Credential Vault</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Shared passwords, PINs, and login info are strictly visible ONLY to active members whose payments have been verified.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Workspace & Member Roster</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time audit log of team events, member renewal dates, upcoming payment warnings, and owner approval requests.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Active Teams Preview */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Teams Ready to Join</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Open slots with verified Bangladeshi team hosts</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/browse')}>
            View All Teams →
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.slice(0, 3).map(team => (
            <Card
              key={team.id}
              hoverEffect
              className="p-5 flex flex-col justify-between cursor-pointer"
              onClick={() => navigate(`/team/${team.id}`)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{team.serviceLogo}</span>
                    <Badge variant="purple" size="sm">
                      {team.category}
                    </Badge>
                  </div>
                  <Badge variant={team.currentMembersCount < team.maxMembers ? 'active' : 'full'} size="sm">
                    {team.maxMembers - team.currentMembersCount} Slots Left
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{team.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {team.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Split Cost</span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    ৳{team.costPerMemberBDT}{' '}
                    <span className="text-xs font-normal text-slate-500">/ mo</span>
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  View Team
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-10">
          <Badge variant="info">User Reviews</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
            Loved by Designers, Coders & Viewers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-500">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Card key={idx} className="overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="gradient-bg rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden flex flex-col items-center gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Split Your First Subscription?</h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl">
            Join hundreds of members sharing costs today. It takes less than 2 minutes to create or request a team slot.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className="bg-white text-indigo-900 hover:bg-slate-100 shadow-xl border-none"
              onClick={() => navigate('/browse')}
            >
              Browse Open Teams
            </Button>
            <Button
              size="lg"
              className="bg-indigo-900/40 text-white hover:bg-indigo-900/60 border border-white/20"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
