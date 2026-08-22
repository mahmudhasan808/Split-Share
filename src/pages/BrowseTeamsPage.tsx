import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { Input, Select } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, SlidersHorizontal, Calendar } from 'lucide-react';
import { SERVICE_PRESETS } from '../data/mockData';

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
      name
      subscriptionName
      description
      billingCycle
      totalCost
      maxMembers
      createdAt
      renewalDate
      ownerId
      members {
        user {
          id
        }
      }
    }
  }
`;

export const BrowseTeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const { data: rawData, loading, error } = useQuery(GET_TEAMS, { fetchPolicy: 'network-only' });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'slots'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = ['All', 'Entertainment', 'Music', 'Design', 'AI & Tech', 'Productivity', 'Custom'];

  // Map backend teams to frontend UI structure
  const data: any = rawData;
  const teams = useMemo(() => {
    if (!data?.teams) return [];
    return data.teams.map((t: any) => {
      // Find preset to get logo and category (fallback if not found)
      const preset = SERVICE_PRESETS.find(p => p.name === t.subscriptionName);
      
      return {
        ...t,
        category: preset?.category || 'Custom',
        serviceLogo: preset?.logo || '✨',
        serviceName: t.subscriptionName,
        currentMembersCount: t.members?.length || 1,
        costPerMemberBDT: Math.round(t.totalCost / (t.maxMembers || 1)),
        nextRenewalDate: t.renewalDate
      };
    });
  }, [data]);

  // Filter & Sort Logic
  const filteredTeams = useMemo(() => {
    return teams.filter((team: any) => {
      // Filter out teams the user already owns or is a member of
      if (currentUser) {
        const isOwner = team.ownerId === currentUser.id;
        const isMember = team.members?.some((m: any) => m.user.id === currentUser.id);
        if (isOwner || isMember) return false;
      }

      const matchesSearch =
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || team.category === selectedCategory;
      const matchesPrice = team.costPerMemberBDT <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a: any, b: any) => {
      if (sortBy === 'price_low') return a.costPerMemberBDT - b.costPerMemberBDT;
      if (sortBy === 'price_high') return b.costPerMemberBDT - a.costPerMemberBDT;
      if (sortBy === 'slots') return (b.maxMembers - b.currentMembersCount) - (a.maxMembers - a.currentMembersCount);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [teams, searchQuery, selectedCategory, sortBy, maxPrice]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const paginatedTeams = filteredTeams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-10 text-center">Loading teams...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading teams.</div>;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      <Breadcrumbs items={[{ label: 'Browse Teams' }]} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Browse Shared Subscriptions</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover active teams with available member slots. Request to join with verified local billing.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => navigate('/create-team')}>
          + Host a New Team
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search Netflix, Spotify, ChatGPT, Canva..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Sort selector */}
        <div className="w-full lg:w-48">
          <Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            options={[
              { value: 'newest', label: 'Sort: Newest First' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'slots', label: 'Most Available Slots' }
            ]}
          />
        </div>

        {/* Price Limit Slider */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 font-medium shrink-0">Max: ৳{maxPrice}</span>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Team Cards Grid */}
      {paginatedTeams.length === 0 ? (
        <EmptyState
          title="No Matching Teams Found"
          description="Try adjusting your search terms, max price limit, or category filter to discover available subscription slots."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setMaxPrice(3000);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTeams.map((team: any) => {
            const availableSlots = team.maxMembers - team.currentMembersCount;
            const isFull = availableSlots <= 0;

            return (
              <Card
                key={team.id}
                hoverEffect
                className="p-5 flex flex-col justify-between cursor-pointer group"
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
                    <Badge variant={isFull ? 'full' : 'active'} size="sm">
                      {isFull ? 'Team Full' : `${availableSlots} Open Slot${availableSlots > 1 ? 's' : ''}`}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{team.serviceName}</p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {team.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Monthly Split</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ৳{team.costPerMemberBDT}{' '}
                      <span className="text-xs font-normal text-slate-500">/ mo</span>
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Renews {
                        (() => {
                          const dateObj = new Date(team.nextRenewalDate);
                          if (isNaN(dateObj.getTime())) {
                            const numDate = new Date(Number(team.nextRenewalDate));
                            return isNaN(numDate.getTime()) ? 'Unknown' : numDate.getDate() + 'th';
                          }
                          return dateObj.getDate() + 'th';
                        })()
                      }</span>
                    </span>
                    <Button size="sm" variant={isFull ? 'outline' : 'primary'}>
                      {isFull ? 'View Info' : 'Join Team'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
