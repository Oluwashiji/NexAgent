import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { MessageSquare, Clock, CheckCircle } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

const CHAT_VOLUME_DATA = [
  { date: 'Jun 1', chats: 45 },
  { date: 'Jun 2', chats: 62 },
  { date: 'Jun 3', chats: 38 },
  { date: 'Jun 4', chats: 75 },
  { date: 'Jun 5', chats: 89 },
  { date: 'Jun 6', chats: 55 },
  { date: 'Jun 7', chats: 92 },
  { date: 'Jun 8', chats: 68 },
  { date: 'Jun 9', chats: 81 },
  { date: 'Jun 10', chats: 110 },
  { date: 'Jun 11', chats: 95 },
  { date: 'Jun 12', chats: 72 },
  { date: 'Jun 13', chats: 88 },
  { date: 'Jun 14', chats: 103 },
]

const TOP_QUESTIONS_DATA = [
  { question: 'What are your pricing plans?', count: 245 },
  { question: 'How do I reset my password?', count: 189 },
  { question: 'Do you offer refunds?', count: 156 },
  { question: 'What payment methods accepted?', count: 134 },
  { question: 'How to contact support team?', count: 112 },
]

const RECENT_CONVERSATIONS = [
  { time: '2:34 PM', user: 'What are your business hours?', agent: "We're available 24/7! Our team is always here to help.", status: 'resolved' as const },
  { time: '2:28 PM', user: 'Do you ship internationally?', agent: 'Yes, we ship to over 50 countries worldwide...', status: 'resolved' as const },
  { time: '2:15 PM', user: 'I need a custom integration', agent: "I'd be happy to connect you with our sales team...", status: 'escalated' as const },
  { time: '2:05 PM', user: 'How do I cancel my subscription?', agent: 'You can cancel anytime from your account settings...', status: 'resolved' as const },
  { time: '1:58 PM', user: 'Is there a free trial?', agent: 'Yes! You can use our Free plan forever...', status: 'resolved' as const },
]

const STATS = [
  { label: 'This month', value: '1,247', icon: MessageSquare, change: null },
  { label: 'Faster than last month', value: '1.8s', icon: Clock, change: '-0.3s', positive: true },
  { label: 'Questions answered', value: '94.2%', icon: CheckCircle, change: '+2.1%', positive: true },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-surface rounded-lg px-4 py-2 shadow-dropdown">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-50">{payload[0].value} chats</p>
      </div>
    )
  }
  return null
}

export default function AnalyticsTab() {
  const [page, setPage] = useState(1)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">Analytics</h2>
        <p className="text-sm text-slate-400 mt-1">Track your agent performance and customer interactions.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <AnimatedItem key={stat.label} delay={i * 0.1}>
            <GlassCard padding="md">
              <div className="flex items-start justify-between mb-3">
                <stat.icon className="w-6 h-6 text-brand-blue" />
                {stat.change && (
                  <span className={`text-xs font-medium ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-50">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </GlassCard>
          </AnimatedItem>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Chat Volume */}
        <AnimatedSection>
          <GlassCard>
            <h3 className="text-base font-semibold text-slate-50 mb-4">Daily Chat Volume</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={CHAT_VOLUME_DATA}>
                <defs>
                  <linearGradient id="chatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="chats"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#chatGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </AnimatedSection>

        {/* Top Questions */}
        <AnimatedSection delay={0.1}>
          <GlassCard>
            <h3 className="text-base font-semibold text-slate-50 mb-4">Top Questions Asked</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={TOP_QUESTIONS_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="question"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={180}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(20px)',
                  }}
                  labelStyle={{ color: '#94A3B8', fontSize: '11px' }}
                  itemStyle={{ color: '#F8FAFC', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </AnimatedSection>
      </div>

      {/* Recent Conversations Table */}
      <AnimatedSection>
        <GlassCard>
          <h3 className="text-base font-semibold text-slate-50 mb-4">Recent Conversations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">User Message</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Agent Response</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {RECENT_CONVERSATIONS.map((conv, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-400 whitespace-nowrap">{conv.time}</td>
                    <td className="py-3 px-4 text-sm text-slate-300 max-w-[200px] truncate">{conv.user}</td>
                    <td className="py-3 px-4 text-sm text-slate-400 max-w-[250px] truncate">{conv.agent}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${conv.status === 'resolved' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className={`text-xs font-medium ${conv.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {conv.status.charAt(0).toUpperCase() + conv.status.slice(1)}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500">Showing 1-5 of 124</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs text-slate-400 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 text-xs text-slate-400 border border-white/10 rounded-md hover:bg-white/5 cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
