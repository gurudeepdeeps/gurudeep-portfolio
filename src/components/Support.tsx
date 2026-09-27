import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Code2,
  Send,
  Home,
  ChevronRight,
} from "lucide-react";
import SEOHead from "./SEOHead";
import StarsCanvas from "./canvas/stars";

const FAQS = [
  {
    question: "What types of web development projects do you specialize in?",
    answer:
      "I specialize in custom modern web applications, 3D interactive portfolio and business sites, high-performance landing pages, and full-stack solutions built with React, Next.js, TypeScript, Tailwind CSS, and Appwrite backend architectures.",
  },
  {
    question: "How do we kick off a new client project or freelance engagement?",
    answer:
      "You can send an inquiry via the Contact Form on this site, or reach out directly on WhatsApp or Email. We will discuss your project goals, timelines, and technical requirements, followed by a formal scope document and milestone breakdown.",
  },
  {
    question: "Can you revamp an existing website or migrate an older stack?",
    answer:
      "Yes. I frequently optimize existing applications to improve page load speed, modern UI/UX aesthetics, mobile responsiveness, and SEO discoverability, as demonstrated in my work with clients like The Wed 24 and M S Properties.",
  },
  {
    question: "Do you offer video editing and digital marketing services as well?",
    answer:
      "Yes. In addition to full-stack web engineering, I provide video editing (Premiere Pro, After Effects, CapCut) for social campaigns and brand films, as well as digital marketing strategies.",
  },
  {
    question: "What is the typical timeline for an initial web development build?",
    answer:
      "Timelines depend on project complexity: standard high-converting landing pages or portfolio showcases typically take 1 to 2 weeks, while full-stack platforms with database integrations and admin portals take 3 to 6 weeks.",
  },
  {
    question: "How do I report a bug or request support for a delivered website?",
    answer:
      "All delivered client projects include post-launch support. You can reach out directly via my dedicated WhatsApp channel or email with details, and issues are addressed promptly.",
  },
];

export const Support = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative z-0 bg-[#050816] min-h-screen text-white selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <SEOHead
        title="Support & Client Help Center | Gurudeep V Portfolio"
        description="Get answers to frequently asked questions about project commissioning, web development services, timelines, and direct support channels."
        canonicalUrl="https://gurudeep-portfolio.vercel.app/support"
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.webp"
            alt="Gurudeep V Portfolio Logo"
            className="w-10 h-10 object-contain rounded-xl border border-white/10 group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
            Gurudeep V <span className="text-xs text-white/40 font-normal">| Developer</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all"
        >
          <ArrowLeft size={14} /> Back to Site
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8 flex-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-white/50">
            <li>
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home size={13} /> Home
              </Link>
            </li>
            <li>
              <ChevronRight size={12} className="text-white/30" />
            </li>
            <li className="text-indigo-400 font-medium" aria-current="page">
              Support & FAQ
            </li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle size={14} /> Client Help & FAQ
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            How Can I Help You?
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Find answers to common project questions or connect with me directly through verified contact channels.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <a
            href="https://wa.me/917353577717?text=Hi%20Gurudeep%2C%20I%20have%20a%20support%20or%20project%20inquiry!"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl bg-[#100d25]/80 border border-white/10 hover:border-[#25D366]/40 transition-all group flex flex-col items-center text-center backdrop-blur-xl"
          >
            <div className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare size={22} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">WhatsApp Chat</h3>
            <p className="text-xs text-white/50 mb-2">Fastest response for urgent project discussions</p>
            <span className="text-xs text-[#25D366] font-semibold flex items-center gap-1">
              +91 7353577717 <ExternalLink size={12} />
            </span>
          </a>

          <a
            href="mailto:gurudeepv55@gmail.com"
            className="p-5 rounded-2xl bg-[#100d25]/80 border border-white/10 hover:border-indigo-500/40 transition-all group flex flex-col items-center text-center backdrop-blur-xl"
          >
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
              <Mail size={22} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Direct Email</h3>
            <p className="text-xs text-white/50 mb-2">Send project briefs, RFPs, and documentation</p>
            <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              gurudeepv55@gmail.com <ExternalLink size={12} />
            </span>
          </a>

          <a
            href="tel:+917353577717"
            className="p-5 rounded-2xl bg-[#100d25]/80 border border-white/10 hover:border-purple-500/40 transition-all group flex flex-col items-center text-center backdrop-blur-xl"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl mb-3 group-hover:scale-110 transition-transform">
              <Phone size={22} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Direct Phone Call</h3>
            <p className="text-xs text-white/50 mb-2">Business hours voice consultations</p>
            <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
              +91 7353577717 <ExternalLink size={12} />
            </span>
          </a>
        </div>

        {/* FAQs */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#100d25]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-400" /> Frequently Asked Questions
          </h2>

          <div className="divide-y divide-white/10">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 py-2 hover:text-indigo-300 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-white/50 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-indigo-400" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-white/70 pt-2 pb-3 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/50">Need a custom feature or quote?</span>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Send size={14} /> Open Contact Form
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 text-center text-xs text-white/40 border-t border-white/5 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} Gurudeep V. All rights reserved.</span>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <span>•</span>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          <span>•</span>
          <Link to="/security" className="hover:text-white transition-colors">Security</Link>
        </div>
      </footer>
    </div>
  );
};

export default Support;
