import { useState, useEffect } from 'react'
import { FileText, Database, MessageSquare, Clock, Upload, BarChart3 } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'
import { useAuth } from '@/contexts/AuthContext'
import * as api from '@/lib/api'

interface DocSummary {
  doc_id: string
  filename: string
  chunk_count: number
  uploaded_at: string
}

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function OverviewTab() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<DocSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .listDocuments()
      .then(setDocs)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const totalChunks = docs.reduce((sum, d) => sum + d.chunk_count, 0)
  const recentDocs = docs.slice(0, 5)

  const stats = [
    { label: 'Documents uploaded', value: isLoading ? '—' : String(docs.length), icon: FileText, tracked: true },
    { label: 'Knowledge chunks', value: isLoading ? '—' : totalChunks.toLocaleString(), icon: Database, tracked: true },
    { label: 'Conversations', value: '—', icon: MessageSquare, tracked: false },
    { label: 'Avg. response time', value: '—', icon: Clock, tracked: false },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">Overview</h2>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back{user?.business_name ? `, ${user.business_name}` : ''}! Here's what's happening.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <AnimatedItem key={stat.label} delay={i * 0.1}>
            <GlassCard padding="md">
              <div className="flex items-start justify-between mb-3">
                <stat.icon className="w-6 h-6 text-brand-blue" />
                {!stat.tracked && (
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Coming soon</span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-50">{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </GlassCard>
          </AnimatedItem>
        ))}
      </div>

      {/* Quick Actions */}
      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="cursor-pointer" hover>
            <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5 text-brand-blue" />
            </div>
            <h4 className="text-sm font-semibold text-slate-50">Upload Documents</h4>
            <p className="text-xs text-slate-400 mt-1 mb-3">Add material for your chatbot to answer from</p>
            <span className="text-xs font-medium text-brand-blue hover:underline">Go to Upload →</span>
          </GlassCard>
          <GlassCard className="cursor-pointer" hover>
            <div className="w-10 h-10 rounded-lg bg-brand-violet/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-brand-violet" />
            </div>
            <h4 className="text-sm font-semibold text-slate-50">Test Your Chatbot</h4>
            <p className="text-xs text-slate-400 mt-1 mb-3">Try the chat widget in the bottom-right corner</p>
            <span className="text-xs font-medium text-brand-violet hover:underline">Start chatting →</span>
          </GlassCard>
          <GlassCard className="cursor-pointer" hover>
            <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-brand-cyan" />
            </div>
            <h4 className="text-sm font-semibold text-slate-50">View Documents</h4>
            <p className="text-xs text-slate-400 mt-1 mb-3">See everything your chatbot currently knows</p>
            <span className="text-xs font-medium text-brand-cyan hover:underline">View all →</span>
          </GlassCard>
        </div>
      </AnimatedSection>

      {/* Recent Activity */}
      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Recent Uploads</h3>
        <GlassCard>
          {isLoading ? (
            <p className="text-sm text-slate-500 py-4">Loading...</p>
          ) : recentDocs.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">No documents uploaded yet. Head to the Upload tab to get started.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {recentDocs.map((doc) => (
                <div key={doc.doc_id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                  <FileText className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">
                      Uploaded '{doc.filename}' - {doc.chunk_count} chunks indexed
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{timeAgo(doc.uploaded_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}