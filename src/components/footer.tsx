import { SOCIALS } from "../constants";
import { styles } from "../styles";
import { cn } from "../utils/lib";

// Footer
const Footer = () => {
  return (
    <nav
      className={cn(
        styles.paddingX,
        "w-full flex items-center py-8 bg-primary border-t border-t-secondary/5"
      )}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <p className="text-white text-xs sm:text-sm font-bold flex">
          &copy; Gurudeep V {new Date().getFullYear()}. All rights reserved.
        </p>

        {/* Social Links */}
        <ul className="list-none flex flex-row gap-4 sm:gap-8">
          {SOCIALS.map((social) => (
            <li
              key={social.name}
              className="text-secondary font-poppins font-medium cursor-pointer text-[16px] opacity-80 hover:opacity-100 transition"
            >
              <a href={social.link} target="_blank" rel="noreferrer noopener" aria-label={social.name}>
                <img src={social.icon} alt={social.name} className="h-7 w-7 sm:h-6 sm:w-6" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Footer;
