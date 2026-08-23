// Contains constant data for using in website
// ! Don't remove anything from here if not sure

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  nodejs,
  mongodb,
  git,
  figma,
  aftereffects,
  premierepro,
  mediaencoder,
  capcut,
  thewed24,
  nexgen,
  pixelplanet,
  xpensivemedia,
  defaultAvatar,
  linkedin,
  call,
  whatsapp,
} from "../assets";

// Navbar Links
export const NAV_LINKS = [
  {
    id: "about",
    title: "About",
    link: null,
  },
  {
    id: "projects",
    title: "Projects",
    link: null,
  },
  {
    id: "contact",
    title: "Contact",
    link: null,
  },
] as const;

// Services
export const SERVICES = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "Editor",
    icon: mobile,
  },
  {
    title: "Digital Marketer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
] as const;

// Technologies
export const TECHNOLOGIES = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "After Effects",
    icon: aftereffects,
  },
  {
    name: "Premiere Pro",
    icon: premierepro,
  },
  {
    name: "Media Encoder",
    icon: mediaencoder,
  },
  {
    name: "CapCut",
    icon: capcut,
  },
] as const;

// Experiences
export const EXPERIENCES = [
  {
    title: "The Wed 24 - Photographer",
    icon: thewed24,
    iconBg: "#383E56",
    points: [
      "Developed a Full Stact Website for a Photographer showcasing their Album & Films.",
      'Visit The Wed 24: <a href="https://thewed24.com" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">thewed24.com</a>',
    ],
  },
  {
    title: "Nexgen - SJBIT College",
    icon: nexgen,
    iconBg: "#E6DEDD",
    points: [
      "Developed dynamic web applications using React.js and modern JavaScript",
      'Visit Nexgen: <a href="https://nexgen-mca.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">nexgen-mca.vercel.app</a>',
    ],
  },
  {
    title: "Pixel Planet - Agency",
    icon: pixelplanet,
    iconBg: "#383E56",
    points: [
      "Edited promotional videos and social media content for various clients",
      "Optimized video outputs for different platforms and formats",
    ],
  },
  {
    title: "Xpensive Media - Agency",
    icon: xpensivemedia,
    iconBg: "#383E56",
    points: [
      "Developed and maintained dynamic web applications using React.js",
      'Visit Xpensive Media: <a href="https://xpensivemedia.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">xpensivemedia.vercel.app</a>',
    ],
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    testimonial:
      "Gurudeep delivered our website exactly as we imagined. The design is clean, fast, and works perfectly on mobile devices.",
    name: "Likhith D A",
    company: "Personal Portfolio",
    image: defaultAvatar,
  },
  {
    testimonial:
      "Working with Gurudeep was a great experience. He developed a clean and professional website for M S Properties that helped us present our real-estate listings more effectively to customers.",
    name: "Yogesh T Gowda",
    company: "M S Properties",
    image: defaultAvatar,
  },
  {
    testimonial:
      "Gurudeep helped us improve our e-commerce website with a clean design and smooth user experience. The website now loads faster and works perfectly across mobile and desktop devices.",
    name: "Kiran A N",
    company: "The Wed 24",
    image: defaultAvatar,
  },
] as const;

export const SOCIALS = [
  {
    name: "Call",
    icon: call,
    link: "tel:+917353577717",
  },
  {
    name: "Linkedin",
    icon: linkedin,
    link: "https://www.linkedin.com/in/gurudeepv",
  },
  {
    name: "WhatsApp",
    icon: whatsapp,
    link: "https://wa.me/917353577717?text=Hi%20Gurudeep%2C%20I%20visited%20your%20portfolio%20website%20and%20would%20like%20to%20discuss%20a%20project%20with%20you!",
  },
] as const;
