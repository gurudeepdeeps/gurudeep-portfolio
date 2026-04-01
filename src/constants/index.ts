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
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  aftereffects,
  premierepro,
  mediaencoder,
  capcut,
  likhithvisuals,
  nexgen,
  pixelplanet,
  xpensivemedia,
  threejs,
  defaultAvatar,
  linkedin,
  github,
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
    id: "work",
    title: "Work",
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
    title: "Web Developer",
    company_name: "Likhith Visuals - Portfolio Website",
    icon: likhithvisuals,
    iconBg: "#383E56",
    date: "December 2025 - Present",
    points: [
      "Built responsive websites using HTML, CSS, and JavaScript",
      "Developed and maintained client websites and web applications",
      "Created user-friendly interfaces with modern design principles",
      "Optimized website performance and loading speeds",
      "Implemented SEO best practices for better search rankings",
      'Visit Likhith Visuals: <a href="https://likhiith-visuals.netlify.app" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">likhiith-visuals.netlify.app</a>',
    ],
  },
  {
    title: "React Developer",
    company_name: "Nexgen - SJBIT College",
    icon: nexgen,
    iconBg: "#E6DEDD",
    date: "January 2026 - February 2026",
    points: [
      "Developed dynamic web applications using React.js and modern JavaScript",
      "Built responsive user interfaces with component-based architecture",
      "Integrated RESTful APIs and managed state using React hooks",
      "Collaborated with the team to deliver high-quality college web solutions",
      'Visit Nexgen: <a href="https://nexgen-mca.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">nexgen-mca.vercel.app</a>',
    ],
  },
  {
    title: "Video Editing",
    company_name: "Pixel Planet - Agency",
    icon: pixelplanet,
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Edited promotional videos and social media content for various clients",
      "Applied color grading, transitions, and effects to enhance visual storytelling",
      "Collaborated with creative team to deliver engaging multimedia content",
      "Optimized video outputs for different platforms and formats",
    ],
  },
  {
    title: "React Developer",
    company_name: "Xpensive Media - Agency",
    icon: xpensivemedia,
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Developed and maintained dynamic web applications using React.js",
      "Built responsive user interfaces with component-based architecture",
      "Integrated RESTful APIs and managed state using React hooks",
      "Collaborated with the team to deliver high-quality web solutions",
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
    name: "Likhith",
    company: "Buy it",
    image: defaultAvatar,
  },
] as const;



export const SOCIALS = [
  {
    name: "Call",
    icon: call,
    link: "tel:+916363770057", // Replace with actual phone number
  },
  {
    name: "Linkedin",
    icon: linkedin,
    link: "https://www.linkedin.com/in/gurudeepv",
  },
  {
    name: "WhatsApp",
    icon: whatsapp,
    link: "https://wa.me/916363770057", // Replace with actual WhatsApp number
  },
  {
    name: "GitHub",
    icon: github,
    link: "https://github.com/gurudeepdeeps",
  },
] as const;
