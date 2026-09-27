import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaComments } from 'react-icons/fa';
import ContactForm from '@/components/contact/ContactForm';

const FLOW = ['Contact Form', 'Backend API /api/contact', 'Validation', 'Database Messages'];

export default function Contact() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <FaComments className="text-primary" aria-hidden="true" />
          Contact / Feedback
        </h1>
        <p className="text-muted-foreground">
          Have a question, suggestion, correction, or feedback about Win vs Linux Academy? Send it below —
          every message is stored and reviewed. We appreciate your feedback and suggestions.
        </p>
      </div>

      <div className="glass p-6 rounded-2xl max-w-2xl">
        <ContactForm />
        <div className="flex gap-6 mt-6 text-2xl">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-primary transition"
          >
            <FaGithub aria-hidden="true" />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-primary transition"
          >
            <FaLinkedin aria-hidden="true" />
          </a>
          <a href="mailto:hello@example.com" aria-label="Email" className="hover:text-primary transition">
            <FaEnvelope aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Educational architecture visual (static — no implementation secrets) */}
      <div className="glass p-5 rounded-2xl max-w-2xl" aria-label="How your message travels">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
          How your message travels
        </h2>
        <ol className="flex flex-col">
          {FLOW.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="flex flex-col items-center" aria-hidden="true">
                <span className="w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {i < FLOW.length - 1 && <span className="text-primary/50 text-xs leading-5">↓</span>}
              </span>
              <span className={`py-0.5 ${i === 0 ? 'font-semibold' : 'text-muted-foreground'}`}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
