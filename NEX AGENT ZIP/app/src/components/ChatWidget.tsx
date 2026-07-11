import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Minus, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'bot' | 'user'
  timestamp: string
}

const DEMO_MESSAGES: Message[] = [
  { id: '1', text: 'Hi there! Welcome to NexAgent. How can I help you today?', sender: 'bot', timestamp: '2:30 PM' },
  { id: '2', text: 'What are your pricing plans?', sender: 'user', timestamp: '2:31 PM' },
  { id: '3', text: 'We offer three plans: **Free** ($0/month for 1 agent), **Pro** ($29/month for 5 agents with unlimited conversations), and **Enterprise** (custom pricing). Would you like me to explain any plan in detail?', sender: 'bot', timestamp: '2:31 PM' },
  { id: '4', text: 'How fast can I set this up?', sender: 'user', timestamp: '2:32 PM' },
  { id: '5', text: 'Most users have their first AI agent live in under 2 minutes! Just upload your documents, configure a few settings, and paste the embed code on your website. No coding experience required.', sender: 'bot', timestamp: '2:32 PM' },
]

const QUICK_REPLIES = ['Pricing', 'Features', 'Support hours', 'Contact sales']

interface ChatWidgetProps {
  inline?: boolean
  className?: string
}

export default function ChatWidget({ inline = false, className = '' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(inline)
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a great question! Our AI agents are trained specifically on your content, so every answer is accurate and relevant to your business. Would you like to see how it works?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, botReply])
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(inputValue)
  }

  if (inline) {
    return (
      <div className={`bg-navy-800 rounded-3xl border border-white/10 overflow-hidden shadow-card flex flex-col ${className}`} style={{ height: 520 }}>
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          handleSend={handleSend}
          messagesEndRef={messagesEndRef}
          onClose={() => {}}
          inline
        />
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
            className="mb-4 bg-navy-800 rounded-3xl border border-white/10 overflow-hidden shadow-dropdown"
            style={{ width: 380, height: 520 }}
          >
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSubmit={handleSubmit}
              handleSend={handleSend}
              messagesEndRef={messagesEndRef}
              onClose={() => setIsOpen(false)}
            />
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

interface ChatWindowProps {
  messages: Message[]
  isTyping: boolean
  inputValue: string
  setInputValue: (v: string) => void
  handleSubmit: (e: React.FormEvent) => void
  handleSend: (text: string) => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
  inline?: boolean
}

function ChatWindow({ messages, isTyping, inputValue, setInputValue, handleSubmit, handleSend, messagesEndRef, onClose, inline }: ChatWindowProps) {
  return (
    <>
      {/* Header */}
      <div className="h-[60px] gradient-primary flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">NexAgent Support</p>
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
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'bot' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i < 5 ? 0 : 0 }}
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
