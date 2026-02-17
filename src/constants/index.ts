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
  user1,
  user2,
  user3,
  youtube,
  linkedin,
  twitter,
  github,
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
  {
    id: "source-code",
    title: "Source Code",
    link: "http://www.github.com/gurudeepdeeps/gurudeep-portfolio",
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
      'Visit Nexgen: <a href="https://nexgen-mca.netlify.app" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">nexgen-mca.netlify.app</a>',
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
      'Visit Xpensive Media: <a href="https://xpensive-media.netlify.app" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">xpensive-media.netlify.app</a>',
    ],
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: user1,
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: user2,
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: user3,
  },
] as const;

// Projects
export const PROJECTS = [
  {
    name: "Xpensive Media",
    description:
      "Developed and maintained dynamic web applications using React.js for Xpensive Media, an agency specializing in digital solutions.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "SupaBase",
        color: "green-text-gradient",
      },
    ],
    image: "/project-images/xpensivemedia.png",
    source_code_link: "https://github.com/xpensivemedia/xpensivemedia",
    live_site_link: "https://xpensive-media.netlify.app",
  },
  {
    name: "Likhiith Visuals",
    description:
      "Developed and maintained dynamic web applications using HTML, CSS, and JavaScript for Likhiith Visuals, an E-Commerce website specializing in digital products.",
    tags: [
      {
        name: "html",
        color: "blue-text-gradient",
      },
      {
        name: "SupaBase",
        color: "green-text-gradient",
      },
    ],
    image: "/project-images/likhithvisuals.png",
    source_code_link: "https://github.com/gurudeepdeeps/likhith-visuals",
    live_site_link: "https://likhiith-visuals.netlify.app",
  },
  {
    name: "Nexgen - SJBIT College",
    description:
      "Developed and maintained dynamic web applications using React.js for Nexgen - SJBIT College, a college website specializing in Events management and registration.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "SupaBase",
        color: "green-text-gradient",
      },
    ],
    image: "/project-images/nexgen.png",
    source_code_link: "https://github.com/gurudeepdeeps/nexgen",
    live_site_link: "https://nexgen-mca.netlify.app",
  },
] as const;

export const SOCIALS = [
  {
    name: "YouTube",
    icon: youtube,
    link: "https://www.youtube.com/@DeepsPlayzYT",
  },
  {
    name: "Linkedin",
    icon: linkedin,
    link: "https://www.linkedin.com/in/gurudeepv",
  },
  {
    name: "Twitter",
    icon: twitter,
    link: "https://x.com/gurudeep_v",
  },
  {
    name: "GitHub",
    icon: github,
    link: "https://github.com/gurudeepdeeps",
  },
] as const;
