import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Download, Search } from 'lucide-react';

const GET_MY_PAYMENTS = gql`
  query GetMyPaymentsHistory {
    myTeams {
      id
      name
      subscriptionName
      payments {
        id
        amount
        method
        transactionId
        status
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;

export const PaymentHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { data, loading, error } = useQuery(GET_MY_PAYMENTS, { fetchPolicy: 'cache-first' });

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchTxId, setSearchTxId] = useState('');

  const payments = useMemo(() => {
    const dataAny: any = data;
    if (!dataAny?.myTeams) return [];
    const allPayments: any[] = [];
    dataAny.myTeams.forEach((team: any) => {
      (team.payments || []).forEach((p: any) => {
        allPayments.push({
          id: p.id,
          userId: p.user.id,
          userName: p.user.name,
          teamName: team.name,
          serviceName: team.subscriptionName,
          amountBDT: p.amount,
          paymentMethod: p.method,
          transactionId: p.transactionId,
          status: p.status.toLowerCase(),
          submittedAt: new Date(Number(p.createdAt)).toLocaleString()
        });
      });
    });
    // Sort by most recent
    return allPayments.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [data]);

  // Filter payments relevant to user or all if admin
  const userPayments = payments.filter(p => {
    const isRelated = p.userId === currentUser?.id || currentUser?.role === 'ADMIN' || currentUser?.role === 'OWNER';
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesTx = p.transactionId.toLowerCase().includes(searchTxId.toLowerCase()) || p.teamName.toLowerCase().includes(searchTxId.toLowerCase());
    return isRelated && matchesStatus && matchesTx;
  });

  const handleExportCSV = () => {
    if (userPayments.length === 0) {
      alert('No payment records to export.');
      return;
    }

    const headers = ['Transaction ID', 'Team Name', 'Service', 'User', 'Amount (BDT)', 'Method', 'Status', 'Submitted Date'];
    const rows = userPayments.map(p => [
      p.transactionId,
      `"${p.teamName}"`,
      p.serviceName,
      p.userName,
      p.amountBDT,
      p.paymentMethod,
      p.status,
      p.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SplitShare_Payment_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-10 text-center">Loading payments...</div>;
  if (error) return <div className="p-10 text-center text-rose-500">Error: {error.message}</div>;

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Payment History' }]} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Audit History</h1>
            <p className="text-xs text-slate-500">Track all submitted bKash, Nagad and SSLCommerz transactions</p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportCSV}>
            Export CSV Log
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search TxID or team..."
              value={searchTxId}
              onChange={e => setSearchTxId(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'verified', label: 'Verified Only' },
                { value: 'pending', label: 'Pending Only' },
                { value: 'rejected', label: 'Rejected Only' }
              ]}
            />
          </div>
        </div>

        {/* Log Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Team & Service</th>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No transaction records match your query.
                    </td>
                  </tr>
                ) : (
                  userPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {p.transactionId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{p.teamName}</span>
                        <span className="text-[10px] text-slate-500">{p.serviceName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {p.userName}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                        ৳{p.amountBDT}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-[10px]">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={p.status === 'verified' ? 'verified' : p.status === 'rejected' ? 'rejected' : 'pending'} size="sm">
                          {p.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{p.submittedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};
