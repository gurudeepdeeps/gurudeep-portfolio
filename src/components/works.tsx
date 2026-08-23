import { useState, useEffect, useMemo } from "react";

// ...existing code...
import { styles } from "../styles";
import { cn } from "../utils/lib";
import { databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_PROJECTS } from "../lib/appwrite";
import { Query } from "appwrite";

const FALLBACK_PROJECTS: ProjectData[] = [
  {
    name: "The Wed 24",
    description: "Full stack website for a photographer showcasing albums & films.",
    category: "Wedding",
    tags: [
      { name: "React", color: "text-blue-400" },
      { name: "Tailwind", color: "text-sky-400" },
    ],
    image: "/project-images/wed24.webp",
    source_code_link: "",
    live_site_link: "https://thewed24.com",
  },
  {
    name: "Xpensive Films",
    description: "Developed and maintained dynamic web applications using React js for Xpensive Media, an agency specializing in digital solutions.",
    category: "Portfolio",
    tags: [
      { name: "React", color: "text-blue-400" },
      { name: "NodeJS", color: "text-green-400" },
    ],
    image: "/project-images/xpensivefilms.webp",
    source_code_link: "",
    live_site_link: "https://xpensivefilms.vercel.app",
  },
  {
    name: "Likhith Portfolio",
    description: "Developed a dynamic 3D web applications using React js for Likhith D A, an creative video editor.",
    category: "Portfolio",
    tags: [
      { name: "React", color: "text-blue-400" },
      { name: "TypeScript", color: "text-sky-400" },
    ],
    image: "/project-images/likhith-portfolio.webp",
    source_code_link: "",
    live_site_link: "https://portfolio-likhith.vercel.app",
  },
];

interface ProjectTag {
  name: string;
  color: string;
}

interface ProjectData {
  $id?: string;
  $createdAt?: string;
  name: string;
  description: string;
  category?: string;
  tags: ProjectTag[] | string; // Appwrite might return a JSON string
  image: string;
  source_code_link: string;
  live_site_link: string;
  display_order?: number | string;
}

const getNumericOrder = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const sortProjectsByCustomOrder = (projects: ProjectData[]) => {
  return [...projects].sort((a, b) => {
    const aDb = getNumericOrder(a.display_order);
    const bDb = getNumericOrder(b.display_order);

    if (aDb !== null && bDb !== null && aDb !== bDb) {
      return aDb - bDb;
    }

    if (aDb !== null && bDb === null) return -1;
    if (aDb === null && bDb !== null) return 1;

    const aCreated = a.$createdAt ? new Date(a.$createdAt).getTime() : 0;
    const bCreated = b.$createdAt ? new Date(b.$createdAt).getTime() : 0;
    return bCreated - aCreated;
  });
};

type ProjectCardProps = ProjectData & {
  index: number;
};

// Project Card
const ProjectCard = ({
  index,
  name,
  description,
  category,
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
    <div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full border border-white/10 flex flex-col justify-between">
      <div>
        <div className="relative w-full h-[230px] rounded-2xl overflow-hidden bg-black/30">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {category && (
            <span className="absolute top-3 right-3 px-3 py-1 text-[11px] font-bold tracking-wide rounded-full bg-indigo-600/90 text-white backdrop-blur-md border border-white/20 shadow-lg">
              {category}
            </span>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name || `Project ${index + 1}`}</h3>
          <p className="mt-2 text-secondary text-[14px] leading-relaxed">{description || "Project details coming soon."}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Array.isArray(parsedTags) && parsedTags.map((tag: any, tagIdx: number) => (
            <p key={`Tag-${tagIdx}`} className={cn(tag.color || "text-white", "text-[12px] font-medium")}>
              #{tag.name}
            </p>
          ))}
        </div>
      </div>

      {live_site_link && (
        <div className="mt-5 flex justify-end">
          <a
            href={live_site_link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Live Site
          </a>
        </div>
      )}
    </div>
  );
};

const CATEGORIES = ["All", "Wedding", "Portfolio", "Real Estate", "Social Contribution"];

// Works
export const Works = () => {
  const [dynamicProjects, setDynamicProjects] = useState<ProjectData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const categoriesList = useMemo(() => {
    const set = new Set<string>(["All"]);

    // Extract categories dynamically from cloud projects
    dynamicProjects.forEach((p) => {
      if (p.category && typeof p.category === "string" && p.category.trim() !== "") {
        set.add(p.category.trim());
      }
    });

    // If cloud has no custom categories yet, provide default categories
    if (set.size === 1) {
      ["Wedding", "Portfolio", "Real Estate", "Social Contribution"].forEach((c) => set.add(c));
    }

    return Array.from(set);
  }, [dynamicProjects]);

  useEffect(() => {
    const fetchProjects = async () => {
      console.info("[PROJECTS_FETCH] Starting fetch from Appwrite", {
        endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
        projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: APPWRITE_COLLECTION_PROJECTS,
      });

      try {
        const projectsRequest = databases.listDocuments(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_PROJECTS,
          [Query.orderDesc("$createdAt")]
        );

        const timeoutRequest = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("PROJECTS_FETCH_TIMEOUT")), 12000);
        });

        const response = await Promise.race([projectsRequest, timeoutRequest]);

        const projects = response.documents as unknown as ProjectData[];
        if (projects.length > 0) {
          console.info("[PROJECTS_FETCH] Appwrite fetch success", {
            count: projects.length,
          });
          setDynamicProjects(sortProjectsByCustomOrder(projects));
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

  const filteredProjects = dynamicProjects.filter((project) => {
    if (selectedCategory === "All") return true;
    const cat = project.category || "Portfolio";
    return cat.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section className={cn(styles.padding, "max-w-7xl mx-auto relative z-0")}>
      <span className="hash-span" id="projects">
        &nbsp;
      </span>

      <div>
        <p className={styles.sectionSubText}>My Work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </div>

      <div className="w-full flex flex-col gap-6">
        <p className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]">
          Following projects showcases my skills and experience through
          real-world examples of my work. Filter by category to explore specific domains
          like Wedding, Portfolio, Real Estate, or Social Contribution.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/25 scale-105"
                  : "bg-tertiary/60 text-white/70 border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {usingFallback && (
        <p className="mt-4 inline-flex rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[13px] text-amber-200">
          Live project feed is temporarily unavailable, so local project cards are being shown.
        </p>
      )}

      <div className="mt-12 flex flex-wrap gap-7">
        {filteredProjects.map((project, i) => (
          <ProjectCard key={project.$id || `project-${i}`} index={i} {...project} />
        ))}

        {!loading && filteredProjects.length === 0 && (
          <div className="w-full py-12 text-center text-white/50 bg-tertiary/20 rounded-2xl border border-white/5">
            No projects found under "{selectedCategory}".
          </div>
        )}

        {loading && (
          <div className="w-full flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
};
