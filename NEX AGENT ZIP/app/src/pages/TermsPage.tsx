import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/signup" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>By creating an account or using NexAgent ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Description of Service</h2>
            <p>NexAgent lets businesses upload documents to automatically generate an AI-powered customer support chatbot, which can be embedded on the business's website. Responses are generated using an AI language model based on the content the business provides.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Your Account</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information when signing up. You must be legally able to enter into this agreement to use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Acceptable Use</h2>
            <p>You agree not to upload content that is illegal, infringes on others' rights, or that you do not have permission to use. You agree not to use the Service to harass, deceive, or harm others, or to attempt to disrupt or gain unauthorized access to the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Your Content</h2>
            <p>You retain ownership of any documents you upload. By uploading content, you grant NexAgent a license to process, store, and use that content solely to provide the Service to you, including generating chatbot responses for your end users.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">6. AI-Generated Responses</h2>
            <p>Chatbot responses are generated automatically based on your uploaded documents. While we aim for accuracy, NexAgent does not guarantee that responses will always be correct, complete, or appropriate for every situation. You are responsible for reviewing and monitoring how the chatbot is used on your website.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Plans and Payment</h2>
            <p>NexAgent offers a Free plan with limited usage, and paid plans with expanded features. Fees for paid plans, where applicable, are billed as described at the time of purchase. We may change pricing with reasonable notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Termination</h2>
            <p>You may stop using the Service and delete your account at any time. We may suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">9. Disclaimer & Limitation of Liability</h2>
            <p>The Service is provided "as is" without warranties of any kind. To the fullest extent permitted by law, NexAgent is not liable for indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">10. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">11. Contact</h2>
            <p>Questions about these Terms can be directed to our support team.</p>
          </section>
        </div>
      </div>
    </div>
  )
}