import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import OverviewTab from '@/sections/dashboard/OverviewTab'
import UploadTab from '@/sections/dashboard/UploadTab'
import AgentsTab from '@/sections/dashboard/AgentsTab'
import AnalyticsTab from '@/sections/dashboard/AnalyticsTab'
import SettingsTab from '@/sections/dashboard/SettingsTab'

const TABS: Record<string, React.ComponentType> = {
  overview: OverviewTab,
  upload: UploadTab,
  agents: AgentsTab,
  analytics: AnalyticsTab,
  settings: SettingsTab,
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const ActiveComponent = TABS[activeTab] || OverviewTab

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-center h-16 border-b border-white/10 px-6">
          <span className="text-lg font-bold text-slate-50">NexAgent</span>
        </div>

        <div className="p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
