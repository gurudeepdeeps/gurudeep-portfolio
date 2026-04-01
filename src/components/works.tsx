import { useState, useEffect } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

// ...existing code...
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { cn } from "../utils/lib";
import { fadeIn, textVariant } from "../utils/motion";
import { databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_PROJECTS } from "../lib/appwrite";
import { Query } from "appwrite";

const FALLBACK_PROJECTS: ProjectData[] = [
  {
    name: "Likhith Visuals",
    description: "Portfolio website focused on cinematic visual presentation and responsive layouts.",
    tags: [
      { name: "React", color: "text-blue-400" },
      { name: "Tailwind", color: "text-cyan-400" },
    ],
    image: "/project-images/likhithvisuals.png",
    source_code_link: "",
    live_site_link: "https://likhiith-visuals.netlify.app",
  },
  {
    name: "Nexgen MCA",
    description: "College web platform with dynamic pages, clear information architecture, and modern UI.",
    tags: [
      { name: "React", color: "text-blue-400" },
      { name: "TypeScript", color: "text-sky-400" },
    ],
    image: "/project-images/nexgen.png",
    source_code_link: "",
    live_site_link: "https://nexgen-mca.vercel.app",
  },
  {
    name: "Xpensive Media",
    description: "Agency showcase website built for fast browsing and clear service storytelling.",
    tags: [
      { name: "React", color: "text-blue-400" },
      { name: "Vite", color: "text-purple-400" },
    ],
    image: "/project-images/xpensivemedia.png",
    source_code_link: "",
    live_site_link: "https://xpensivemedia.vercel.app",
  },
];

interface ProjectTag {
  name: string;
  color: string;
}

interface ProjectData {
  $id?: string;
  name: string;
  description: string;
  tags: ProjectTag[] | string; // Appwrite might return a JSON string
  image: string;
  source_code_link: string;
  live_site_link: string;
}

type ProjectCardProps = ProjectData & {
  index: number;
};

// Project Card
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  live_site_link,
}: ProjectCardProps) => {
  // Parsing tags if it comes as a JSON string from Appwrite, with error fallback
  let parsedTags: ProjectTag[] = [];
  if (typeof tags === 'string') {
    try {
      parsedTags = JSON.parse(tags);
    } catch (e) {
      // fallback: treat as comma-separated string
      parsedTags = tags.split(',').map((t) => ({ name: t.trim(), color: 'text-white' }));
    }
  } else {
    parsedTags = tags;
  }

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.1, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full cursor-pointer"
      >
        <div
          onClick={() => window.open(live_site_link, "_blank", "noreferrer")}
          className="w-full h-full"
        >
          <div className="relative w-full h-[230px]">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <div className="mt-5">
            <h3 className="text-white font-bold text-[24px]">{name}</h3>
            <p className="mt-2 text-secondary text-[14px] leading-relaxed">{description}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.isArray(parsedTags) && parsedTags.map((tag: any, tagIdx: number) => (
              <p key={`Tag-${tagIdx}`} className={cn(tag.color, "text-[12px] font-medium")}>
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

// Works
export const Works = () => {
  const [dynamicProjects, setDynamicProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      console.info("[PROJECTS_FETCH] Starting fetch from Appwrite", {
        endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
        projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: APPWRITE_COLLECTION_PROJECTS,
      });

      try {
        const response = await databases.listDocuments(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_PROJECTS,
          [Query.orderDesc("$createdAt")]
        );

        const projects = response.documents as unknown as ProjectData[];
        if (projects.length > 0) {
          console.info("[PROJECTS_FETCH] Appwrite fetch success", {
            count: projects.length,
          });
          setDynamicProjects(projects);
          setUsingFallback(false);
        } else {
          console.warn("[PROJECTS_FETCH] Appwrite returned no projects, using fallback");
          setDynamicProjects(FALLBACK_PROJECTS);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error("[PROJECTS_FETCH] Appwrite fetch failed, using fallback", error);
        setDynamicProjects(FALLBACK_PROJECTS);
        setUsingFallback(true);
      } finally {
        console.info("[PROJECTS_FETCH] Fetch flow completed");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <SectionWrapper idName="projects">
      <>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>My Work</p>
          <h2 className={styles.sectionHeadText}>Projects.</h2>
        </motion.div>

        <div className="w-full flex">
          <motion.p
            variants={fadeIn(undefined, undefined, 0.1, 1)}
            className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
          >
            Following projects showcases my skills and experience through
            real-world examples of my work. Each project is briefly described
            with links to live demos. It reflects my
            ability to solve complex problems, work with different technologies,
            and manage projects effectively.
          </motion.p>
        </div>

        {usingFallback && (
          <motion.p
            variants={fadeIn(undefined, undefined, 0.15, 1)}
            className="mt-4 inline-flex rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[13px] text-amber-200"
          >
            Live project feed is temporarily unavailable, so local project cards are being shown.
          </motion.p>
        )}

        <div className="mt-20 flex flex-wrap gap-7">
          {dynamicProjects.map((project, i) => (
            <ProjectCard key={project.$id || `project-${i}`} index={i} {...project} />
          ))}
          {loading && (
            <div className="w-full flex justify-center py-10">
               <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </>
    </SectionWrapper>
  );
};
