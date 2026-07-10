import { Bot, MessageSquare, AlertCircle, Clock, Upload, Plus, BarChart3, CheckCircle } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'

const STATS = [
  { label: 'AI agents', value: '3', icon: Bot, change: null },
  { label: 'Conversations', value: '1,247', icon: MessageSquare, change: '+12%', positive: true },
  { label: 'Need attention', value: '23', icon: AlertCircle, change: '-5%', positive: true },
  { label: 'Response time', value: '2s', icon: Clock, change: null },
]

const QUICK_ACTIONS = [
  {
    icon: Upload,
    title: 'Upload Documents',
    description: 'Add new training material to your agents',
    action: 'Upload now',
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
  },
  {
    icon: Plus,
    title: 'Create Agent',
    description: 'Build a new AI support agent',
    action: 'Create agent',
    color: 'text-brand-violet',
    bg: 'bg-brand-violet/10',
  },
  {
    icon: BarChart3,
    title: 'View Analytics',
    description: 'See how your agents are performing',
    action: 'View reports',
    color: 'text-brand-cyan',
    bg: 'bg-brand-cyan/10',
  },
]

const ACTIVITIES = [
  { icon: CheckCircle, iconColor: 'text-emerald-400', text: "Agent 'Support Bot' answered 50 questions today", time: '2 hours ago' },
  { icon: Upload, iconColor: 'text-brand-blue', text: "You uploaded 'Product_Manual_v2.pdf'", time: 'Yesterday' },
  { icon: Bot, iconColor: 'text-brand-violet', text: "New agent 'Sales Assistant' created", time: '2 days ago' },
  { icon: AlertCircle, iconColor: 'text-amber-400', text: '23 questions flagged for review', time: '3 days ago' },
]

export default function OverviewTab() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">Overview</h2>
        <p className="text-sm text-slate-400 mt-1">Welcome back! Here's what's happening with your agents.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </GlassCard>
          </AnimatedItem>
        ))}
      </div>

      {/* Quick Actions */}
      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <GlassCard key={action.title} className="cursor-pointer" hover>
              <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-4`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <h4 className="text-sm font-semibold text-slate-50">{action.title}</h4>
              <p className="text-xs text-slate-400 mt-1 mb-3">{action.description}</p>
              <span className={`text-xs font-medium ${action.color} hover:underline`}>{action.action} →</span>
            </GlassCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Recent Activity */}
      <AnimatedSection className="mt-8">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Recent Activity</h3>
        <GlassCard>
          <div className="divide-y divide-white/5">
            {ACTIVITIES.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                <activity.icon className={`w-5 h-5 ${activity.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
