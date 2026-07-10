import { Link } from 'react-router-dom'
import { Twitter, Github, Linkedin } from 'lucide-react'

const PRODUCT_LINKS = ['Features', 'Pricing', 'API', 'Integrations']
const COMPANY_LINKS = ['About', 'Blog', 'Careers', 'Contact']
const LEGAL_LINKS = ['Privacy', 'Terms', 'Security']

export default function Footer() {
  return (
    <footer className="bg-[#0A0F1E] border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full gradient-primary" />
              <span className="text-xl font-bold text-slate-50">NexAgent</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              AI-powered customer support for modern businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-50 mb-4">Product</h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link}>
                  <span className="text-sm text-slate-400 hover:text-slate-50 transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-50 mb-4">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link}>
                  <span className="text-sm text-slate-400 hover:text-slate-50 transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-50 mb-4">Legal</h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link}>
                  <span className="text-sm text-slate-400 hover:text-slate-50 transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2025 NexAgent. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <Twitter className="w-[18px] h-[18px]" />
            </span>
            <span className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <Github className="w-[18px] h-[18px]" />
            </span>
            <span className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <Linkedin className="w-[18px] h-[18px]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
