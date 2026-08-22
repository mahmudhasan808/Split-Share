import React, { useState } from 'react';

import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Trash2 } from 'lucide-react';

export const AdminTeamsPage: React.FC = () => {
  const { teams, deleteTeam } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter(
    t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
      <Sidebar />

      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Team Management' }]} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Management</h1>
            <p className="text-xs text-slate-500">Search and audit all platform teams or remove rule violations</p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Team & Service</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Host</th>
                  <th className="py-3.5 px-4">Cost / Member</th>
                  <th className="py-3.5 px-4">Members</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTeams.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{t.serviceLogo}</span>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                          <p className="text-[10px] text-slate-500">{t.serviceName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="purple" size="sm">
                        {t.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{t.ownerName}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600">৳{t.costPerMemberBDT}</td>
                    <td className="py-3.5 px-4">{t.currentMembersCount} / {t.maxMembers}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => deleteTeam(t.id)}>
                        Force Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};
