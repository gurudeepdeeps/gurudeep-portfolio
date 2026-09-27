import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles, Home, ChevronRight } from "lucide-react";
import SEOHead from "../SEOHead";
import StarsCanvas from "../canvas/stars";

interface LegalLayoutProps {
  title: string;
  badge: string;
  lastUpdated: string;
  description: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  badge,
  lastUpdated,
  description,
  children,
}) => {
  const location = useLocation();
  const canonicalUrl = `https://gurudeep-portfolio.vercel.app${location.pathname}`;

  return (
    <div className="relative z-0 bg-[#050816] min-h-screen text-white selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <SEOHead
        title={`${title} | Gurudeep V Portfolio`}
        description={description}
        canonicalUrl={canonicalUrl}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Top Header */}
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

      {/* Content Container */}
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
              {title}
            </li>
          </ol>
        </nav>

        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} /> {badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Effective Date & Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-[#100d25]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-8 text-sm sm:text-base leading-relaxed text-white/80">
          {children}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 text-center text-xs text-white/40 border-t border-white/5 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} Gurudeep V. All rights reserved.</span>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <span>•</span>
          <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          <span>•</span>
          <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          <span>•</span>
          <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          <span>•</span>
          <Link to="/security" className="hover:text-white transition-colors">Security</Link>
        </div>
      </footer>
    </div>
  );
};

export default LegalLayout;
