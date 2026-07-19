import { useState } from 'react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection from '@/components/AnimatedSection'

interface ToggleProps {
  checked: boolean
  onChange: () => void
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-brand-blue' : 'bg-navy-700'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function SettingsTab() {
  const [name, setName] = useState('John Doe')
  const [greeting, setGreeting] = useState('Hello! How can I help you today?')
  const [fallback, setFallback] = useState("I'm not sure about that. Let me connect you with a human agent.")
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState({
    daily: true,
    unanswered: true,
    weekly: false,
  })

  return (
    <div className="max-w-[800px]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">Settings</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your account and agent preferences</p>
      </div>

      {/* Profile Section */}
      <AnimatedSection>
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-50 mb-6">Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
              JD
            </div>
            <button className="text-sm text-brand-blue hover:underline cursor-pointer">
              Change avatar
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-navy-700 border border-white/10 rounded-[10px] px-4 py-3 text-sm text-slate-50 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value="john.doe@company.com"
                disabled
                className="w-full bg-navy-700/50 border border-white/5 rounded-[10px] px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
          <button className="mt-6 px-5 py-2.5 text-sm font-semibold text-white rounded-[10px] gradient-primary shadow-[0_2px_12px_rgba(4,120,87,0.3)] hover:shadow-[0_4px_20px_rgba(4,120,87,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
            Save Changes
          </button>
        </GlassCard>
      </AnimatedSection>

      {/* Agent Defaults */}
      <AnimatedSection className="mt-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-50 mb-6">Agent Defaults</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Default greeting</label>
              <textarea
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full min-h-[80px] bg-navy-700 border border-white/10 rounded-[10px] px-4 py-3 text-sm text-slate-50 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all resize-vertical"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Fallback message</label>
              <textarea
                value={fallback}
                onChange={(e) => setFallback(e.target.value)}
                className="w-full min-h-[80px] bg-navy-700 border border-white/10 rounded-[10px] px-4 py-3 text-sm text-slate-50 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all resize-vertical"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Default language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-navy-700 border border-white/10 rounded-[10px] px-4 py-3 text-sm text-slate-50 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="hi">Hindi</option>
                <option value="zh">Chinese</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>
          <button className="mt-6 px-5 py-2.5 text-sm font-semibold text-white rounded-[10px] gradient-primary shadow-[0_2px_12px_rgba(4,120,87,0.3)] hover:shadow-[0_4px_20px_rgba(4,120,87,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer">
            Save Defaults
          </button>
        </GlassCard>
      </AnimatedSection>

      {/* Notifications */}
      <AnimatedSection className="mt-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-slate-50 mb-6">Notifications</h3>
          <div className="space-y-5">
            {[
              { key: 'daily' as const, label: 'Email summary daily', desc: 'Receive a daily summary of your agent activity' },
              { key: 'unanswered' as const, label: 'Alert on unanswered questions', desc: 'Get notified when questions go unanswered' },
              { key: 'weekly' as const, label: 'Weekly analytics report', desc: 'Receive a weekly performance report' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </AnimatedSection>

      {/* Danger Zone */}
      <AnimatedSection className="mt-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <button className="px-5 py-2.5 text-sm font-medium text-red-400 rounded-[10px] border border-red-500/30 hover:bg-red-500/10 transition-all cursor-pointer">
            Delete Account
          </button>
          <p className="text-xs text-slate-500 mt-2">This action cannot be undone.</p>
        </GlassCard>
      </AnimatedSection>
    </div>
  )
}
