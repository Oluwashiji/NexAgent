import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/signup" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
            <p>When you create an account, we collect your email address, business name, and a securely hashed version of your password (we never store your actual password). When you upload documents, we store the file, its extracted text, and content derived from it (such as embeddings) to power your chatbot.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. How We Use Information</h2>
            <p>We use your information to operate your account, process and search your uploaded documents, generate chatbot responses to your end users' questions, and maintain the security of the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. AI Processing</h2>
            <p>To generate chatbot answers, relevant portions of your uploaded documents are sent to a third-party AI language model provider (Groq) at the time a question is asked, solely to generate a response. We do not use your documents to train any AI models.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Your End Users</h2>
            <p>Visitors who chat with your embedded widget are not required to create an account. We do not knowingly collect personal information from your end users beyond the text of the messages they send, which is used only to generate a response and is associated with your business account, not with any individual identity.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Data Storage</h2>
            <p>Account data is stored in a managed PostgreSQL database. Uploaded documents and their derived content are stored on our hosting infrastructure. We take reasonable technical measures to protect this data, including password hashing and encrypted connections.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Data Retention</h2>
            <p>We retain your account and document data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Your Rights</h2>
            <p>You may access, update, or request deletion of your personal data at any time. You may delete individual uploaded documents from your dashboard, or your entire account by contacting support.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Third-Party Services</h2>
            <p>We use third-party infrastructure providers to host the Service and process AI requests. These providers only receive the minimum data necessary to perform their function and are not permitted to use it for their own purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will note the date of the most recent update at the top of this page.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">10. Contact</h2>
            <p>Questions about this Privacy Policy or your data can be directed to our support team.</p>
          </section>
        </div>
      </div>
    </div>
  )
}