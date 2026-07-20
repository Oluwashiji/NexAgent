import { useState, useCallback, useEffect, useRef } from 'react'
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedSection from '@/components/AnimatedSection'
import * as api from '@/lib/api'

interface DocFile {
  id: string
  name: string
  size: string
  status: 'uploading' | 'ready' | 'failed'
  errorMessage?: string
}

const TIPS = [
  'Use clear, well-structured documents',
  'Include FAQs and common questions',
  'Keep individual files under 20MB',
  'PDF and Word formats work best',
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadTab() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<DocFile[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  async function loadDocuments() {
    try {
      const docs = await api.listDocuments()
      setFiles(
        docs.map((d: { doc_id: string; filename: string; char_count: number }) => ({
          id: d.doc_id,
          name: d.filename,
          size: `${d.char_count.toLocaleString()} chars`,
          status: 'ready' as const,
        }))
      )
    } catch {
      // If this fails, the list just stays empty - not worth blocking the page over
    } finally {
      setIsLoadingList(false)
    }
  }

  async function uploadOneFile(file: File) {
    const tempId = `uploading-${Date.now()}-${file.name}`
    setFiles((prev) => [
      ...prev,
      { id: tempId, name: file.name, size: formatBytes(file.size), status: 'uploading' },
    ])

    try {
      const result = await api.uploadDocument(file)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === tempId
            ? { id: result.doc_id, name: result.filename, size: `${result.char_count.toLocaleString()} chars`, status: 'ready' as const }
            : f
        )
      )
    } catch (err) {
      const message = err instanceof api.ApiError ? err.message : 'Upload failed'
      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, status: 'failed' as const, errorMessage: message } : f))
      )
    }
  }

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return
    Array.from(fileList).forEach((file) => uploadOneFile(file))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const removeFile = async (id: string) => {
    const isRealDoc = !id.startsWith('uploading-')
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (isRealDoc) {
      try {
        await api.deleteDocument(id)
      } catch {
        // If deletion fails server-side, reload the real list so the UI reflects reality
        loadDocuments()
      }
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-50">Upload Documents</h2>
        <p className="text-sm text-slate-400 mt-1">Add PDFs, Word documents, or text files to power your chatbot.</p>
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
              onClick={() => fileInputRef.current?.click()}
              className={`min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
                isDragOver
                  ? 'border-brand-blue bg-brand-blue/10 shadow-glow-blue'
                  : 'border-white/10 glass-surface hover:border-brand-blue/50 hover:bg-brand-blue/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <UploadCloud className="w-12 h-12 text-brand-blue mb-4" />
              <h3 className="text-lg font-semibold text-slate-50">Drag and drop your files here</h3>
              <p className="text-brand-blue text-sm mt-1">or click to browse</p>
              <p className="text-xs text-slate-500 mt-3">Supports PDF, DOCX, TXT up to 20MB each</p>
            </div>
          </AnimatedSection>

          {/* File List */}
          {isLoadingList ? (
            <p className="mt-6 text-sm text-slate-500">Loading your documents...</p>
          ) : files.length > 0 ? (
            <AnimatedSection className="mt-6">
              <GlassCard>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 py-2">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-300 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {file.status === 'failed' && file.errorMessage ? file.errorMessage : file.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'ready' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {file.status === 'uploading' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                        {file.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-400" />}
                        <span
                          className={`text-xs ${
                            file.status === 'ready'
                              ? 'text-emerald-400'
                              : file.status === 'uploading'
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}
                        >
                          {file.status === 'ready' ? 'Ready' : file.status === 'uploading' ? 'Uploading...' : 'Failed'}
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
          ) : (
            <p className="mt-6 text-sm text-slate-500">No documents uploaded yet - drop one above to get started.</p>
          )}
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