import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Minus, Send, Bot, User, Search } from 'lucide-react'
import * as api from '@/lib/api'

interface Message {
  id: string
  text: string
  sender: 'bot' | 'user'
  timestamp: string
}

const QUICK_REPLIES = ['What do you offer?', 'How does this work?', 'Pricing?']

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

interface ChatWidgetProps {
  inline?: boolean
  className?: string
  businessId?: string
  greeting?: string
}

export default function ChatWidget({ inline = false, className = '', businessId, greeting }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(inline)

  // If a businessId prop is passed in (e.g. the dashboard's "test your
  // own docs" widget), we're already scoped - no picker needed. If not
  // (the public landing-page widget), the visitor has to tell us which
  // business they mean first.
  const [pickedBusinessId, setPickedBusinessId] = useState<string | null>(null)
  const [pickedBusinessName, setPickedBusinessName] = useState<string | null>(null)
  const needsPicker = !businessId && !pickedBusinessId
  const effectiveBusinessId = businessId || pickedBusinessId || undefined

  const [pickerInput, setPickerInput] = useState('')
  const [pickerStatus, setPickerStatus] = useState<'idle' | 'loading' | 'not_found'>('idle')

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      text: greeting || "Hi there! Ask me anything about this business.",
      sender: 'bot',
      timestamp: now(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Two easy ways to close the widget, on top of the X button: Escape key,
  // and clicking anywhere outside it. Only applies to the floating widget,
  // not the inline preview (which has no concept of "closed").
  useEffect(() => {
    if (inline || !isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    function handleClickOutside(e: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, inline])

  const handlePickerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickerInput.trim()) return

    setPickerStatus('loading')
    try {
      const business = await api.lookupBusiness(pickerInput.trim())
      setPickedBusinessId(business.id)
      setPickedBusinessName(business.business_name)
      setPickerStatus('idle')
      setMessages([
        {
          id: 'greeting',
          text: `Hi there! Ask me anything about ${business.business_name}.`,
          sender: 'bot',
          timestamp: now(),
        },
      ])
    } catch {
      // Covers both a genuine 404 (name doesn't match any approved
      // business) and an unapproved account with a matching name -
      // the backend deliberately returns the same 404 for both, so we
      // don't leak which unapproved accounts exist.
      setPickerStatus('not_found')
    }
  }

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    if (!effectiveBusinessId) {
      // No live business context (e.g. viewed outside a real account) -
      // be honest rather than fake a response.
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "This preview isn't connected to a live business account yet.",
          sender: 'bot',
          timestamp: now(),
        },
      ])
      return
    }

    setIsTyping(true)
    try {
      const result = await api.chatQuery(effectiveBusinessId, text)
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: result.answer, sender: 'bot', timestamp: now() },
      ])
    } catch (err) {
      const message = err instanceof api.ApiError ? err.message : "Something went wrong reaching the chatbot."
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: message, sender: 'bot', timestamp: now() },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(inputValue)
  }

  if (inline) {
    return (
      <div className={`bg-navy-800 rounded-3xl border border-white/10 overflow-hidden shadow-card flex flex-col ${className}`} style={{ height: 520 }}>
        {needsPicker ? (
          <BusinessPicker
            pickerInput={pickerInput}
            setPickerInput={setPickerInput}
            pickerStatus={pickerStatus}
            handlePickerSubmit={handlePickerSubmit}
            onClose={() => {}}
            inline
          />
        ) : (
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            handleSend={handleSend}
            messagesEndRef={messagesEndRef}
            onClose={() => {}}
            headerLabel={pickedBusinessName || undefined}
            inline
          />
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[300]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 w-[calc(100vw-3rem)] max-w-[380px] h-[70vh] max-h-[520px] sm:w-[380px] sm:h-[520px] bg-navy-800 rounded-3xl border border-white/10 overflow-hidden shadow-dropdown flex flex-col"
            ref={widgetRef}
          >
            {needsPicker ? (
              <BusinessPicker
                pickerInput={pickerInput}
                setPickerInput={setPickerInput}
                pickerStatus={pickerStatus}
                handlePickerSubmit={handlePickerSubmit}
                onClose={() => setIsOpen(false)}
              />
            ) : (
              <ChatWindow
                messages={messages}
                isTyping={isTyping}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSubmit={handleSubmit}
                handleSend={handleSend}
                messagesEndRef={messagesEndRef}
                onClose={() => setIsOpen(false)}
                headerLabel={pickedBusinessName || undefined}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center cursor-pointer transition-shadow hover:shadow-glow-blue"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

interface BusinessPickerProps {
  pickerInput: string
  setPickerInput: (v: string) => void
  pickerStatus: 'idle' | 'loading' | 'not_found'
  handlePickerSubmit: (e: React.FormEvent) => void
  onClose: () => void
  inline?: boolean
}

function BusinessPicker({ pickerInput, setPickerInput, pickerStatus, handlePickerSubmit, onClose, inline }: BusinessPickerProps) {
  return (
    <>
      {/* Header */}
      <div className="h-[60px] gradient-primary flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">NexAgent</p>
            <span className="text-xs text-white/80">Find a business to chat with</span>
          </div>
        </div>
        {!inline && (
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <Minus className="w-[18px] h-[18px]" />
            </button>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>

      {/* Picker Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white text-center">
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-slate-900 mb-1">Which business would you like to chat with?</p>
        <p className="text-xs text-slate-500 mb-5">Type their exact company name as they registered it on NexAgent.</p>

        <form onSubmit={handlePickerSubmit} className="w-full max-w-[280px]">
          <input
            type="text"
            value={pickerInput}
            onChange={(e) => setPickerInput(e.target.value)}
            placeholder="e.g. Ibom Test Co"
            className="w-full border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
          />
          <button
            type="submit"
            disabled={!pickerInput.trim() || pickerStatus === 'loading'}
            className="w-full mt-3 py-2.5 text-sm font-semibold text-white rounded-full gradient-primary hover:shadow-[0_4px_20px_rgba(4,120,87,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pickerStatus === 'loading' ? 'Searching...' : 'Start chat'}
          </button>
        </form>

        {pickerStatus === 'not_found' && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-xs text-red-500 max-w-[260px]"
          >
            That business isn't registered on NexAgent (or hasn't been approved yet). Double-check the spelling, or ask them to sign up.
          </motion.p>
        )}
      </div>
    </>
  )
}

interface ChatWindowProps {
  messages: Message[]
  isTyping: boolean
  inputValue: string
  setInputValue: (v: string) => void
  handleSubmit: (e: React.FormEvent) => void
  handleSend: (text: string) => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
  headerLabel?: string
  inline?: boolean
}

function ChatWindow({ messages, isTyping, inputValue, setInputValue, handleSubmit, handleSend, messagesEndRef, onClose, headerLabel, inline }: ChatWindowProps) {
  return (
    <>
      {/* Header */}
      <div className="h-[60px] gradient-primary flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{headerLabel || 'NexAgent Support'}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/80">Online</span>
            </div>
          </div>
        </div>
        {!inline && (
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <Minus className="w-[18px] h-[18px]" />
            </button>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'bot' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'bot'
                    ? 'glass-surface rounded-2xl rounded-tl-sm text-slate-50'
                    : 'bg-brand-blue rounded-2xl rounded-tr-sm text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${msg.sender === 'bot' ? 'text-slate-400' : 'text-white/70'}`}>
                  {msg.timestamp}
                </span>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-surface rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-5 pb-3 pt-2 bg-navy-800 flex gap-2 overflow-x-auto">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            className="px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-slate-400 whitespace-nowrap hover:bg-brand-blue/10 hover:border-brand-blue/30 hover:text-brand-blue transition-all flex-shrink-0 cursor-pointer"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="h-16 bg-navy-800 border-t border-white/10 px-4 flex items-center gap-3 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-navy-700 border border-white/10 rounded-full px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-[18px] h-[18px] text-white" />
        </button>
      </form>
    </>
  )
}