import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { MessageSquare, Clock, Calendar } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'
import * as api from '@/lib/api'

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

function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

export default function AnalyticsTab() {
  const [page, setPage] = useState(1)
  const pageSize = 5

  const [stats, setStats] = useState<api.AnalyticsStats | null>(null)
  const [volume, setVolume] = useState<api.VolumePoint[]>([])
  const [topQuestions, setTopQuestions] = useState<api.TopQuestion[]>([])
  const [recent, setRecent] = useState<api.RecentConversationsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadOverview() {
      setIsLoading(true)
      setError(null)
      try {
        const [statsRes, volumeRes, topRes] = await Promise.all([
          api.getAnalyticsStats(),
          api.getChatVolume(14),
          api.getTopQuestions(5),
        ])
        if (cancelled) return
        setStats(statsRes)
        setVolume(volumeRes)
        setTopQuestions(topRes)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof api.ApiError ? err.message : 'Could not load analytics.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadOverview()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadRecent() {
      try {
        const res = await api.getRecentConversations(page, pageSize)
        if (!cancelled) setRecent(res)
      } catch {
        // Non-fatal - the rest of the page still works if this call fails.
      }
    }
    loadRecent()
    return () => { cancelled = true }
  }, [page])

  const chartData = volume.map((v) => ({ date: formatShortDate(v.date), chats: v.chats }))
  const hasAnyVolume = volume.some((v) => v.chats > 0)
  const totalRecent = recent?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalRecent / pageSize))
  const rangeStart = totalRecent === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, totalRecent)

  const statsCards = stats
    ? [
        { label: 'Chats this month', value: stats.chats_this_month.toLocaleString(), icon: MessageSquare },
        { label: 'Chats today', value: stats.chats_today.toLocaleString(), icon: Calendar },
        {
          label: 'Avg. response time',
          value: stats.avg_response_ms != null ? `${(stats.avg_response_ms / 1000).toFixed(1)}s` : '—',
          icon: Clock,
        },
      ]
    : []

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">Analytics</h2>
        <p className="text-sm text-slate-400 mt-1">Track your agent performance and customer interactions.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-[10px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {isLoading
          ? [0, 1, 2].map((i) => (
              <GlassCard key={i} padding="md">
                <div className="h-24 animate-pulse bg-white/5 rounded-lg" />
              </GlassCard>
            ))
          : statsCards.map((stat, i) => (
              <AnimatedItem key={stat.label} delay={i * 0.1}>
                <GlassCard padding="md">
                  <div className="flex items-start justify-between mb-3">
                    <stat.icon className="w-6 h-6 text-brand-blue" />
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
        <AnimatedSection className="min-w-0">
          <GlassCard>
            <h3 className="text-base font-semibold text-slate-50 mb-4">Daily Chat Volume</h3>
            {!isLoading && !hasAnyVolume ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-slate-500">
                No chats yet - once your widget starts getting used, this fills in.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#047857" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="date" tick={{ fill: '#8A7A6B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8A7A6B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="chats"
                    stroke="#047857"
                    strokeWidth={2}
                    fill="url(#chatGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        </AnimatedSection>

        {/* Top Questions */}
        <AnimatedSection delay={0.1} className="min-w-0">
          <GlassCard>
            <h3 className="text-base font-semibold text-slate-50 mb-4">Top Questions Asked</h3>
            {!isLoading && topQuestions.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-sm text-slate-500">
                No questions logged yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topQuestions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#8A7A6B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="question"
                    tick={{ fill: '#8A7A6B', fontSize: 11 }}
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
                    labelStyle={{ color: '#8A7A6B', fontSize: '11px' }}
                    itemStyle={{ color: '#241C14', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#047857" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        </AnimatedSection>
      </div>

      {/* Recent Conversations Table */}
      <AnimatedSection>
        <GlassCard>
          <h3 className="text-base font-semibold text-slate-50 mb-4">Recent Conversations</h3>
          {recent && recent.conversations.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No conversations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">User Message</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Agent Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(recent?.conversations ?? []).map((conv, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-400 whitespace-nowrap">{formatTime(conv.time)}</td>
                      <td className="py-3 px-4 text-sm text-slate-300 max-w-[200px] truncate">{conv.query}</td>
                      <td className="py-3 px-4 text-sm text-slate-400 max-w-[250px] truncate">{conv.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500">
              {totalRecent === 0 ? 'No conversations yet' : `Showing ${rangeStart}-${rangeEnd} of ${totalRecent}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs text-slate-400 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs text-slate-400 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
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