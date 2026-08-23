import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { menu, close } from "../assets";
import { NAV_LINKS } from "../constants";
import { styles } from "../styles";
import { cn } from "../utils/lib";

type NavbarProps = {
  hide?: boolean;
};

// Navbar
export const Navbar = ({ hide = true }: NavbarProps) => {
  // state variables
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        styles.paddingX,
        "w-full flex items-center py-5 fixed top-0 z-20 bg-primary",
        isAtBottom || hide ? "mt-0" : "mt-20"
      )}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src="/logo.webp" alt="Gurudeep V Portfolio Logo" className="w-9 h-9 object-contain rounded-lg" />
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            Gurudeep V&nbsp;<span className="sm:block hidden">| Developer</span>
          </p>
        </Link>

        {/* Nav Links (Desktop) */}
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {NAV_LINKS.map((link) => (
            <li
              key={link.id}
              className={cn(
                active === link.title ? "text-white" : "text-secondary",
                "hover:text-white text-[18px] font-medium cursor-pointer"
              )}
              onClick={() => !link.link && setActive(link.title)}
            >
              {link.link ? (
                <a href={link.link} target="_blank" rel="noreferrer noopener">
                  {link.title}
                </a>
              ) : (
                <a href={`#${link.id}`}>{link.title}</a>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger Menu (Mobile) */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            onClick={() => setToggle(!toggle)}
            aria-label={toggle ? "Close menu" : "Open menu"}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <img
              src={toggle ? close : menu}
              alt={toggle ? "Close navigation menu" : "Open navigation menu"}
              className="w-[24px] h-[24px] object-contain cursor-pointer"
            />
          </button>

          <AnimatePresence>
            {toggle && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-20 right-4 w-[calc(100vw-2rem)] max-w-sm p-6 bg-[#100d25]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl z-30 flex flex-col gap-5"
              >
                {/* Header title in dropdown */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Navigation Menu</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Nav Links (Mobile) */}
                <ul className="list-none flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <li
                      key={link.id}
                      onClick={() => {
                        !link.link && setToggle(false);
                        !link.link && setActive(link.title);
                      }}
                    >
                      <a
                        href={link.link ? link.link : `#${link.id}`}
                        target={link.link ? "_blank" : undefined}
                        rel={link.link ? "noreferrer noopener" : undefined}
                        className={cn(
                          "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-base font-semibold",
                          active === link.title
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span>{link.title}</span>
                        <span className="text-xs text-white/40">→</span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Bottom Action Button */}
                <a
                  href="#contact"
                  onClick={() => setToggle(false)}
                  className="mt-1 w-full text-center py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity"
                >
                  Get In Touch
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
