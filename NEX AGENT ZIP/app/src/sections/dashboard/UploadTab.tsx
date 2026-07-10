import { useState, useCallback } from 'react'
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection from '@/components/AnimatedSection'

interface UploadedFile {
  id: string
  name: string
  size: string
  status: 'processing' | 'ready' | 'failed'
}

const TIPS = [
  'Use clear, well-structured documents',
  'Include FAQs and common questions',
  'Upload up to 50MB total per agent',
  'PDF and Word formats work best',
]

export default function UploadTab() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: '1', name: 'Company_FAQ.pdf', size: '2.4 MB', status: 'ready' },
    { id: '2', name: 'Product_Manual_v2.pdf', size: '5.1 MB', status: 'ready' },
    { id: '3', name: 'Pricing_Sheet.docx', size: '890 KB', status: 'processing' },
  ])
  const [textContent, setTextContent] = useState('')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    // Simulate file drop
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: 'New_Document.pdf',
      size: '1.2 MB',
      status: 'processing',
    }
    setFiles(prev => [...prev, newFile])
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'ready' as const } : f))
    }, 2000)
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">Upload Documents</h2>
        <p className="text-sm text-slate-400 mt-1">Add PDFs, Word documents, or paste text to train your AI agents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
        {/* Left: Upload Area */}
        <div>
          {/* Dropzone */}
          <AnimatedSection>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
                isDragOver
                  ? 'border-brand-blue bg-brand-blue/10 shadow-glow-blue'
                  : 'border-white/10 glass-surface hover:border-brand-blue/50 hover:bg-brand-blue/5'
              }`}
            >
              <UploadCloud className="w-12 h-12 text-brand-blue mb-4" />
              <h3 className="text-lg font-semibold text-slate-50">Drag and drop your files here</h3>
              <p className="text-brand-blue text-sm mt-1">or click to browse</p>
              <p className="text-xs text-slate-500 mt-3">Supports PDF, DOCX, TXT up to 10MB each</p>
            </div>
          </AnimatedSection>

          {/* File List */}
          {files.length > 0 && (
            <AnimatedSection className="mt-6">
              <GlassCard>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 py-2">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'ready' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {file.status === 'processing' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                        {file.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-400" />}
                        <span className={`text-xs ${
                          file.status === 'ready' ? 'text-emerald-400' :
                          file.status === 'processing' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {file.status === 'ready' ? 'Ready' : file.status === 'processing' ? 'Processing...' : 'Failed'}
                        </span>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>
          )}

          {/* Paste Text */}
          <AnimatedSection className="mt-6">
            <p className="text-sm font-medium text-slate-400 mb-3">Or paste text directly:</p>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste your content here..."
              className="w-full min-h-[140px] bg-navy-700 border border-white/10 rounded-[10px] px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all resize-vertical"
            />
            <button className="mt-3 px-5 py-2.5 text-sm font-medium text-slate-50 rounded-[10px] border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
              Add Text
            </button>
          </AnimatedSection>
        </div>

        {/* Right: Tips */}
        <div className="lg:pl-4">
          <AnimatedSection delay={0.2}>
            <GlassCard>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Tips for best results</h3>
              <ul className="space-y-3">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-400">{tip}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
