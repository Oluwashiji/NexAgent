import { useState } from 'react'
import { Bot, Pencil, Code, BarChart3, Trash2, X, Copy, CheckCircle, Plus } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

interface Agent {
  id: string
  name: string
  status: 'active' | 'draft' | 'paused'
  chats: number
  responseTime: string
  satisfaction: string
}

const AGENTS: Agent[] = [
  { id: '1', name: 'Support Bot', status: 'active', chats: 1203, responseTime: '2s', satisfaction: '99.2%' },
  { id: '2', name: 'Sales Assistant', status: 'active', chats: 847, responseTime: '1.5s', satisfaction: '97.8%' },
  { id: '3', name: 'FAQ Helper', status: 'draft', chats: 0, responseTime: '—', satisfaction: '—' },
]

const STATUS_STYLES = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  paused: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

const EMBED_CODE = `<script src="https://cdn.nexagent.ai/widget.js" data-agent-id="agt_123"></script>`

export default function AgentsTab() {
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(EMBED_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">My Agents</h2>
          <p className="text-sm text-slate-400 mt-1">Manage your AI support agents</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-[10px] gradient-primary shadow-[0_2px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      {/* Agent Cards */}
      <div className="space-y-4">
        {AGENTS.map((agent, i) => (
          <AnimatedItem key={agent.id} delay={i * 0.1}>
            <GlassCard className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              {/* Left: Avatar + Name + Status */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-50 truncate">{agent.name}</h3>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${STATUS_STYLES[agent.status]}`}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Middle: Stats */}
              <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-50">{agent.chats.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">chats</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-50">{agent.responseTime}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">avg response</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-50">{agent.satisfaction}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">satisfaction</p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-all cursor-pointer" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowEmbedModal(true)}
                  className="p-2 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-all cursor-pointer"
                  title="Embed"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-all cursor-pointer" title="Analytics">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </AnimatedItem>
        ))}
      </div>

      {/* Embed Code Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEmbedModal(false)} />
          <AnimatedSection className="relative w-full max-w-[600px]">
            <GlassCard className="!p-6">
              <button
                onClick={() => setShowEmbedModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Embed Code</h3>
              <p className="text-sm text-slate-400 mb-4">
                Copy this code and paste it before the closing <code className="text-brand-blue">&lt;/body&gt;</code> tag on your website.
              </p>
              <div className="bg-[#0A0F1E] rounded-lg p-4 font-mono text-sm text-slate-300 break-all">
                {EMBED_CODE}
              </div>
              <button
                onClick={handleCopy}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-50 rounded-[10px] border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </GlassCard>
          </AnimatedSection>
        </div>
      )}
    </div>
  )
}
