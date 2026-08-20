import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SERVICE_PRESETS } from '../data/mockData';
import { ServicePreset, SubscriptionCategory } from '../types';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Layers, CreditCard, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export const CreateTeamPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { createTeam } = useData();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState<ServicePreset>(SERVICE_PRESETS[0]);
  const [teamName, setTeamName] = useState('Netflix 4K Shared Family');
  const [description, setDescription] = useState('Shared 4K Ultra HD profile slot. Auto-renews on the 1st of every month via bKash.');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [totalCostBDT, setTotalCostBDT] = useState<number>(1400);
  const [maxMembers, setMaxMembers] = useState<number>(4);
  const [rules, setRules] = useState<string>('Only log in on 1 designated screen\nDo not alter profile names or PINs\nPay before renewal date');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [paymentNumber, setPaymentNumber] = useState(currentUser?.phone || '01711998877');
  const [nextRenewalDate, setNextRenewalDate] = useState('2026-09-01');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const costPerMemberBDT = Math.round(totalCostBDT / (maxMembers || 1));

  const handleSelectPreset = (preset: ServicePreset) => {
    setSelectedService(preset);
    setTeamName(`${preset.name} Group`);
    setTotalCostBDT(preset.defaultPriceBDT);
    setMaxMembers(preset.defaultMaxMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const ruleArray = rules.split('\n').filter(r => r.trim().length > 0);

    const newTeam = createTeam({
      name: teamName,
      serviceName: selectedService.name,
      category: selectedService.category,
      serviceLogo: selectedService.logo,
      description,
      rules: ruleArray.length > 0 ? ruleArray : ['Follow host terms and renew on time'],
      totalCostBDT,
      costPerMemberBDT,
      billingCycle,
      maxMembers,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerPhone: paymentNumber,
      paymentMethod,
      paymentNumber,
      nextRenewalDate,
      visibility
    });

    navigate(`/manage/${newTeam.id}`);
  };

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Create Team' }]} />

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Host a Subscription Team</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in subscription details and start collecting bKash/Nagad payments from verified members.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Step 1: Service Selector Preset */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              1. Select Subscription Platform
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SERVICE_PRESETS.map(preset => {
                const isSelected = selectedService.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{preset.logo}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{preset.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{preset.category}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Step 2: Pricing & Split Calculator */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              2. Subscription Pricing & Member Split
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Total Subscription Cost (BDT)"
                type="number"
                value={totalCostBDT}
                onChange={e => setTotalCostBDT(Number(e.target.value))}
              />

              <Input
                label="Max Team Members"
                type="number"
                min={2}
                max={10}
                value={maxMembers}
                onChange={e => setMaxMembers(Number(e.target.value))}
              />

              <Select
                label="Billing Cycle"
                value={billingCycle}
                onChange={e => setBillingCycle(e.target.value as any)}
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ]}
              />
            </div>

            {/* Split Calculation Live Summary Box */}
            <div className="mt-4 p-4 rounded-xl gradient-bg text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-200 font-semibold block">Calculated Member Cost</span>
                <p className="text-xs text-indigo-100 mt-0.5">
                  ৳{totalCostBDT} ÷ {maxMembers} member slots
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold">৳{costPerMemberBDT}</span>
                <span className="text-xs font-normal text-indigo-200"> / {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
            </div>
          </Card>

          {/* Step 3: Team Details & Payment Method */}
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Team Info & bKash / Nagad Number
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Team Display Name"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
              />

              <Input
                label="Next Renewal Date"
                type="date"
                value={nextRenewalDate}
                onChange={e => setNextRenewalDate(e.target.value)}
              />
            </div>

            <Textarea
              label="Team Description"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <Textarea
              label="Team Guidelines / Rules (One per line)"
              rows={3}
              value={rules}
              onChange={e => setRules(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Select
                label="Accepted Payment Method"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                options={[
                  { value: 'bKash', label: 'bKash Personal' },
                  { value: 'Nagad', label: 'Nagad Personal' },
                  { value: 'Bank', label: 'Bank Account' }
                ]}
              />

              <Input
                label="Payment Number / Account Details"
                placeholder="017xxxxxxxx"
                value={paymentNumber}
                onChange={e => setPaymentNumber(e.target.value)}
              />

              <Select
                label="Visibility"
                value={visibility}
                onChange={e => setVisibility(e.target.value as any)}
                options={[
                  { value: 'public', label: 'Public (Listed on Browse)' },
                  { value: 'private', label: 'Private (Invite Link Only)' }
                ]}
              />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate('/my-teams')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Team & Launch
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
