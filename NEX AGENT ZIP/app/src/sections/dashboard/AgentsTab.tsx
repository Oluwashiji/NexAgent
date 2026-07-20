import { useState, useEffect } from 'react'
import { FileText, Code, Trash2, X, Copy, CheckCircle } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection, { AnimatedItem } from '@/components/AnimatedSection'
import { useAuth } from '@/contexts/AuthContext'
import * as api from '@/lib/api'

interface DocSummary {
  doc_id: string
  filename: string
  char_count: number
  chunk_count: number
  uploaded_at: string
}

export default function AgentsTab() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<DocSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [embedDoc, setEmbedDoc] = useState<DocSummary | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadDocs()
  }, [])

  function loadDocs() {
    setIsLoading(true)
    api
      .listDocuments()
      .then(setDocs)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }

  async function handleDelete(docId: string) {
    setDocs((prev) => prev.filter((d) => d.doc_id !== docId))
    try {
      await api.deleteDocument(docId)
    } catch {
      loadDocs()
    }
  }

  const embedCode = embedDoc && user
    ? `<script src="https://nexagent-hqjj.onrender.com/widget.js" data-business-id="${user.id}" data-doc-id="${embedDoc.doc_id}"></script>`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">My Documents</h2>
        <p className="text-sm text-slate-400 mt-1">
          Every document you upload becomes part of what your chatbot can answer questions about.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : docs.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-slate-400">
            You haven't uploaded any documents yet. Head to the Upload tab to add your first one.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {docs.map((doc, i) => (
            <AnimatedItem key={doc.doc_id} delay={i * 0.1}>
              <GlassCard className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                {/* Left: Icon + Name + Status */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-50 truncate">{doc.filename}</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-semibold rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Active
                    </span>
                  </div>
                </div>

                {/* Middle: Real Stats */}
                <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-50">{doc.chunk_count}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">chunks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-50">{doc.char_count.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">characters</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEmbedDoc(doc)}
                    className="p-2 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-all cursor-pointer"
                    title="Embed"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.doc_id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </AnimatedItem>
          ))}
        </div>
      )}

      {/* Embed Code Modal */}
      {embedDoc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEmbedDoc(null)} />
          <AnimatedSection className="relative w-full max-w-[600px]">
            <GlassCard className="!p-6">
              <button
                onClick={() => setEmbedDoc(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">Embed Code</h3>
              <p className="text-sm text-slate-400 mb-1">
                This is your real, unique business ID - it's what will connect a widget on your website to your documents.
              </p>
              <p className="text-xs text-amber-400 mb-4">
                Note: the embeddable widget script itself is still in development. This code won't work on an external site yet - coming soon.
              </p>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm text-slate-300 break-all">
                {embedCode}
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