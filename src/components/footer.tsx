import { Link } from "react-router-dom";
import { SOCIALS } from "../constants";
import { styles } from "../styles";
import { cn } from "../utils/lib";
import { ShieldCheck, HelpCircle } from "lucide-react";

// Footer
const Footer = () => {
  return (
    <footer
      className={cn(
        styles.paddingX,
        "w-full py-12 bg-primary border-t border-white/5 text-white/70"
      )}
    >
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/5">
          {/* Brand summary */}
          <div className="space-y-2 max-w-md">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.webp" alt="Gurudeep V Portfolio Logo" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-white text-base">Gurudeep V</span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed">
              Full Stack Web Developer & Content Creator crafting high-performance digital experiences with React, TypeScript, and modern 3D design.
            </p>
          </div>

          {/* Social links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Connect</h4>
            <ul className="list-none flex flex-row gap-4">
              {SOCIALS.map((social) => (
                <li
                  key={social.name}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.name}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-colors"
                  >
                    <img src={social.icon} alt={social.name} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nav & Legal Links */}
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-xs text-white/50">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
            <Link to="/support" className="hover:text-white transition-colors flex items-center gap-1">
              <HelpCircle size={13} /> Support & FAQ
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <span>•</span>
            <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            <span>•</span>
            <Link to="/security" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck size={13} /> Security
            </Link>
          </div>

          <div className="flex items-center">
            <span>&copy; Gurudeep V {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
