import React from 'react';

import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const payments: any[] = [];

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Payments & Reports' }]} />

        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payments & User Reports Audit</h1>
          <p className="text-xs text-slate-500">Monitor all transactions, TxID verification logs & user reports</p>
        </div>

        {/* Reports Audit */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>User Complaints & Flagged Items</span>
          </h3>

          <div className="flex flex-col gap-3">
            {[].map(rep => (
              <div key={rep.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{rep.reason}</span>
                    <Badge variant="verified" size="sm">{rep.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{rep.details}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Reported by {rep.reporterName} for {rep.teamName}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Global Transactions Log */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Global Payment Audit Trail</h3>
          <div className="flex flex-col gap-3">
            {payments.map(p => (
              <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.transactionId}</span>
                  <span className="text-[10px] text-slate-500 block">{p.userName} → {p.teamName} (৳{p.amountBDT})</span>
                </div>
                <Badge variant={p.status === 'verified' ? 'verified' : 'pending'} size="sm">
                  {p.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};
