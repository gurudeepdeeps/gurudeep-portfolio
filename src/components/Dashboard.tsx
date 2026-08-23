  // ...existing code...
// ...existing code...
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  logout, 
  getCurrentUser, 
  hasAppwriteSessionCookie,
  databases, 
  storage,
  APPWRITE_DATABASE_ID, 
  APPWRITE_COLLECTION_PROJECTS,
  APPWRITE_COLLECTION_ENQUIRIES,
  APPWRITE_COLLECTION_CATEGORIES,
  APPWRITE_BUCKET_ID
} from "../lib/appwrite";
import { ID, Query } from "appwrite";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Briefcase, 
  History, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Search, 
  Settings,
  Bell,
  Menu,
  X,
  Loader2,
  Trash2,
  ExternalLink,
  Mail,
  Calendar,
  User as UserIcon,
  Tag,
  Edit2,
  Save,
  FolderTree,
  Globe,
  RefreshCw,
  CheckCircle2,
  Phone,
  Upload,
  Camera,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

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

const sortProjectsByCustomOrder = (projectList: any[]) => {
  return [...projectList].sort((a, b) => {
    const aDb = getNumericOrder(a.display_order);
    const bDb = getNumericOrder(b.display_order);

    if (aDb !== null && bDb !== null && aDb !== bDb) {
      return aDb - bDb;
    }

    if (aDb !== null && bDb === null) return -1;
    if (aDb === null && bDb !== null) return 1;

    return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
  });
};

const Dashboard = () => {
  // Enquiry Edit Modal State and Handlers
  const [isEditEnquiryModalOpen, setIsEditEnquiryModalOpen] = useState(false);
  const [editEnquiryId, setEditEnquiryId] = useState<string | null>(null);
  const [editEnquiryForm, setEditEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const openEditEnquiryModal = (enquiry: any) => {
    console.info("[ADMIN_ENQUIRY_EDIT] Open modal", { enquiryId: enquiry.$id });
    setEditEnquiryId(enquiry.$id);
    setEditEnquiryForm({
      name: enquiry.name || "",
      email: enquiry.email || "",
      phone: enquiry.phone || "",
      message: enquiry.message || ""
    });
    setIsEditEnquiryModalOpen(true);
  };

  const handleEditEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.info("[ADMIN_ENQUIRY_EDIT] Update started", { enquiryId: editEnquiryId });
    try {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ENQUIRIES,
        editEnquiryId!,
        {
          name: editEnquiryForm.name,
          email: editEnquiryForm.email,
          phone: editEnquiryForm.phone,
          message: editEnquiryForm.message
        }
      );
      console.info("[ADMIN_ENQUIRY_EDIT] Update success", { enquiryId: editEnquiryId });
      toast.success("Enquiry updated successfully!");
      setIsEditEnquiryModalOpen(false);
      setEditEnquiryId(null);
      fetchData();
    } catch (error: any) {
      console.error("[ADMIN_ENQUIRY_EDIT] Update failed", error);
      if (error?.code === 401 || error?.status === 401 || error?.message?.includes("authorized")) {
        toast.error("Appwrite 401 Permission Error: Please go to Appwrite Console -> Databases -> enquiries_collection -> Settings -> Permissions and grant Update permission to 'any' or 'users'.");
      } else {
        toast.error(error.message || "Failed to update enquiry");
      }
    } finally {
      console.info("[ADMIN_ENQUIRY_EDIT] Update flow completed", { enquiryId: editEnquiryId });
      setIsSubmitting(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) {
      console.warn("[ADMIN_ENQUIRY_DELETE] Cancelled by user", { enquiryId: id });
      return;
    }

    console.info("[ADMIN_ENQUIRY_DELETE] Delete started", { enquiryId: id });
    try {
      await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ENQUIRIES, id);
      console.info("[ADMIN_ENQUIRY_DELETE] Delete success", { enquiryId: id });
      toast.success("Enquiry deleted");
      setEnquiries((prev: any[]) => prev.filter(e => e.$id !== id));
    } catch (error: any) {
      console.error("[ADMIN_ENQUIRY_DELETE] Delete failed", error);
      if (error?.code === 401 || error?.status === 401 || error?.message?.includes("authorized")) {
        toast.error("Appwrite 401 Permission Error: Go to Appwrite Console -> Databases -> enquiries_collection -> Settings -> Permissions and enable Delete permission for role 'any' or 'users'.");
      } else {
        toast.error(error?.message || "Failed to delete enquiry");
      }
    }
  };

  // Fetch projects and enquiries from Appwrite
// Removed duplicate fetchData declaration
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("gurudeep_admin_profile");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      name: "Gurudeep V",
      email: "gurudeepv55@gmail.com",
      phone: "+91 6363770057",
      logo: "/logo.webp"
    };
  });

  const [profileForm, setProfileForm] = useState({
    name: userData?.name || "Gurudeep V",
    email: userData?.email || "gurudeepv55@gmail.com",
    phone: userData?.phone || "+91 6363770057",
    logo: userData?.logo || "/logo.webp",
    logoFile: null as File | null
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (userData) {
      setProfileForm((prev) => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
        logo: userData.logo || prev.logo
      }));
    }
  }, [userData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    console.info("[ADMIN_PROFILE_UPDATE] Save started", { name: profileForm.name });

    try {
      let logoUrl = profileForm.logo;

      // Upload file if selected
      if (profileForm.logoFile) {
        try {
          const uploadRes = await storage.createFile(
            APPWRITE_BUCKET_ID,
            ID.unique(),
            profileForm.logoFile
          );
          logoUrl = storage.getFileView(APPWRITE_BUCKET_ID, uploadRes.$id).toString();
        } catch (uploadErr) {
          console.warn("[ADMIN_PROFILE_UPDATE] Storage upload fallback to local data URL", uploadErr);
          const reader = new FileReader();
          logoUrl = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(profileForm.logoFile!);
          });
        }
      }

      const updatedUser = {
        ...userData,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        logo: logoUrl
      };

      setUserData(updatedUser);
      localStorage.setItem("gurudeep_admin_profile", JSON.stringify(updatedUser));
      toast.success("Admin Profile updated successfully!");
    } catch (error: any) {
      console.error("[ADMIN_PROFILE_UPDATE] Save failed", error);
      toast.error(error?.message || "Failed to update admin profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const [projects, setProjects] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "Portfolio",
    tags: "",
    live_site_link: "",
    imageFile: null as File | null,
    image: ""
  });
    const openEditModal = (project: any) => {
      console.info("[ADMIN_PROJECT_EDIT] Open modal", { projectId: project.$id });
      setEditProjectId(project.$id);
      setEditForm({
        name: project.name || "",
        description: project.description || "",
        category: project.category || "Portfolio",
        tags: project.tags || "",
        live_site_link: project.live_site_link || "",
        imageFile: null,
        image: project.image || ""
      });
      setIsEditModalOpen(true);
    };

    const handleEditProject = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      console.info("[ADMIN_PROJECT_EDIT] Update started", { projectId: editProjectId });
      try {
        let imageUrl = editForm.image;
        if (editForm.imageFile) {
          console.info("[ADMIN_PROJECT_EDIT] Uploading new image", { projectId: editProjectId });
          const uploadRes = await storage.createFile(
            APPWRITE_BUCKET_ID,
            ID.unique(),
            editForm.imageFile
          );
          imageUrl = storage.getFileView(APPWRITE_BUCKET_ID, uploadRes.$id).toString();
          console.info("[ADMIN_PROJECT_EDIT] Image upload success", { fileId: uploadRes.$id, projectId: editProjectId });
        }
        await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_PROJECTS,
          editProjectId!,
          {
            name: editForm.name,
            description: editForm.description,
            category: editForm.category,
            tags: editForm.tags,
            image: imageUrl,
            live_site_link: editForm.live_site_link
          }
        );
        console.info("[ADMIN_PROJECT_EDIT] Update success", { projectId: editProjectId });
        toast.success("Project updated successfully in cloud!");
        setIsEditModalOpen(false);
        setEditProjectId(null);
        fetchData();
      } catch (error: any) {
        console.error("[ADMIN_PROJECT_EDIT] Update failed", error);
        if (error?.code === 401 || error?.status === 401 || error?.message?.includes("authorized")) {
          toast.error("Appwrite 401 Permission Error: Please go to Appwrite Console -> Database -> projects_collection -> Settings -> Permissions and enable Update permission for 'any' or 'users'.");
        } else {
          toast.error(error.message || "Failed to update project");
        }
      } finally {
        console.info("[ADMIN_PROJECT_EDIT] Update flow completed", { projectId: editProjectId });
        setIsSubmitting(false);
      }
    };
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Categories State
  const DEFAULT_CATEGORIES = ["Wedding", "Portfolio", "Real Estate", "Social Contribution"];

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("gurudeep_portfolio_categories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_CATEGORIES;
  });

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("gurudeep_portfolio_categories", JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Category already exists!");
      return;
    }

    try {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_CATEGORIES,
        ID.unique(),
        { name: trimmed }
      );
    } catch (err: any) {
      console.info("Categories collection document sync info:", err?.message);
    }

    setCategories((prev) => Array.from(new Set([...prev, trimmed])));
    setNewCategoryName("");
    toast.success(`Category "${trimmed}" saved to cloud!`);
  };

  const handleStartEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditingCategoryName(cat);
  };

  const handleSaveEditCategory = async (oldCat: string) => {
    const trimmed = editingCategoryName.trim();
    if (!trimmed || trimmed === oldCat) {
      setEditingCategory(null);
      return;
    }

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== oldCat.toLowerCase())) {
      toast.error("A category with this name already exists!");
      return;
    }

    setCategories((prev) => prev.map((c) => (c === oldCat ? trimmed : c)));

    // Update matching projects in Appwrite Cloud DB
    const affectedProjects = projects.filter((p) => (p.category || "").toLowerCase() === oldCat.toLowerCase());
    if (affectedProjects.length > 0) {
      try {
        for (const proj of affectedProjects) {
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_PROJECTS,
            proj.$id,
            { category: trimmed }
          );
        }
        fetchData();
      } catch (err) {
        console.error("Failed to update projects for renamed category", err);
      }
    }

    setEditingCategory(null);
    toast.success(`Category updated to "${trimmed}" in cloud!`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${catToDelete}"?`)) {
      return;
    }

    setCategories((prev) => prev.filter((c) => c !== catToDelete));
    toast.success(`Category "${catToDelete}" deleted!`);
  };

  // Admin search & filter states
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [adminCategoryFilter, setAdminCategoryFilter] = useState("All");

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    category: "Portfolio",
    tags: "",
    live_site_link: "",
    imageFile: null as File | null
  });

  useEffect(() => {
    document.title = "Admin | Gurudeep Portfolio";
    const checkAuth = async () => {
      console.log("[DASHBOARD_AUTH]: Checking session...");

      if (!hasAppwriteSessionCookie()) {
        console.warn("[DASHBOARD_AUTH]: No session state, redirecting to login");
        navigate("/login");
        return;
      }

      const user = await getCurrentUser();
      if (!user) {
        console.warn("[DASHBOARD_AUTH]: No active session, redirecting to login");
        navigate("/login");
      } else {
        console.log("[DASHBOARD_AUTH]: User authenticated", user.email);
        setUserData(user);
        fetchData();
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    console.info("[ADMIN_DATA] Fetch started", {
      databaseId: APPWRITE_DATABASE_ID,
      projectsCollectionId: APPWRITE_COLLECTION_PROJECTS,
      enquiriesCollectionId: APPWRITE_COLLECTION_ENQUIRIES,
    });
    setLoading(true);
    try {
      const [projRes, enqRes] = await Promise.all([
        databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_PROJECTS, [Query.orderDesc("$createdAt")]),
        databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ENQUIRIES, [Query.orderDesc("$createdAt")])
      ]);

      let customCategories: string[] = [];
      try {
        const catRes = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_CATEGORIES);
        customCategories = catRes.documents.map((d: any) => d.name).filter(Boolean);
      } catch (e) {}

      console.info("[ADMIN_DATA] Fetch success", {
        projectsCount: projRes.documents.length,
        enquiriesCount: enqRes.documents.length,
        customCategoriesCount: customCategories.length
      });
      const sortedProjects = sortProjectsByCustomOrder(projRes.documents);
      setProjects(sortedProjects);

      // Extract categories directly from cloud documents + categories collection
      const cloudCategories = Array.from(
        new Set([
          ...customCategories,
          ...projRes.documents
            .map((doc: any) => doc.category)
            .filter((cat: any) => typeof cat === "string" && cat.trim() !== "")
        ])
      ) as string[];

      if (cloudCategories.length > 0) {
        setCategories((prev) => {
          const merged = new Set([...cloudCategories, ...prev]);
          return Array.from(merged);
        });
      }

      setEnquiries(enqRes.documents);
      setOrderDirty(false);
    } catch (error) {
      console.error("[ADMIN_DATA] Fetch failed", error);
    } finally {
      console.info("[ADMIN_DATA] Fetch flow completed");
      setLoading(false);
    }
  };

  const setProjectOrderByNumber = (projectId: string, nextPosition: number) => {
    setProjects((prev) => {
      const currentIndex = prev.findIndex((p) => p.$id === projectId);
      if (currentIndex === -1) {
        return prev;
      }

      const boundedTarget = Math.max(1, Math.min(nextPosition, prev.length));
      const targetIndex = boundedTarget - 1;

      if (targetIndex === currentIndex) {
        return prev;
      }

      const reordered = [...prev];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      return reordered;
    });

    setOrderDirty(true);
  };

  const saveProjectOrder = async () => {
    setIsSavingOrder(true);
    console.info("[ADMIN_PROJECT_ORDER] Save started", { count: projects.length });

    try {
      for (let index = 0; index < projects.length; index += 1) {
        const project = projects[index];
        await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_PROJECTS,
          project.$id,
          { display_order: index + 1 }
        );
      }

      setOrderDirty(false);
      toast.success("Project order saved in cloud");
      console.info("[ADMIN_PROJECT_ORDER] Save success");
    } catch (error: any) {
      console.error("[ADMIN_PROJECT_ORDER] Save failed", error);
      toast.error("Could not save order in cloud. Make sure 'display_order' exists and update permission is enabled.");
    } finally {
      console.info("[ADMIN_PROJECT_ORDER] Save flow completed");
      setIsSavingOrder(false);
    }
  };

  const handleLogout = async () => {
    console.info("[ADMIN_AUTH] Logout started");
    try {
      await logout();
      console.info("[ADMIN_AUTH] Logout success");
      toast.info("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("[ADMIN_AUTH] Logout failed", error);
      toast.error("Logout failed");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.info("[ADMIN_PROJECT_CREATE] Create started", {
      name: projectForm.name,
      hasImage: Boolean(projectForm.imageFile),
    });

    try {
      let imageUrl = "";
      const nextDisplayOrder = projects.length + 1;
      
      // Upload Image if selected
      if (projectForm.imageFile) {
        console.info("[ADMIN_PROJECT_CREATE] Uploading image");
        const uploadRes = await storage.createFile(
          APPWRITE_BUCKET_ID,
          ID.unique(),
          projectForm.imageFile
        );
        imageUrl = storage.getFileView(APPWRITE_BUCKET_ID, uploadRes.$id).toString();
        console.info("[ADMIN_PROJECT_CREATE] Image upload success", { fileId: uploadRes.$id });
      }

      const createdProject = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_PROJECTS,
        ID.unique(),
        {
          name: projectForm.name,
          description: projectForm.description,
          category: projectForm.category || "Portfolio",
          tags: projectForm.tags,
          image: imageUrl,
          live_site_link: projectForm.live_site_link,
          display_order: nextDisplayOrder
        }
      );

      console.info("[ADMIN_PROJECT_CREATE] Create success", { projectId: createdProject.$id });

      toast.success("Project created successfully in cloud!");
      setIsModalOpen(false);
      setProjectForm({ name: "", description: "", category: "Portfolio", tags: "", live_site_link: "", imageFile: null });
      fetchData();
    } catch (error: any) {
      console.error("[ADMIN_PROJECT_CREATE] Create failed", error);
      if (error?.code === 401 || error?.status === 401 || error?.message?.includes("authorized")) {
        toast.error("Appwrite 401 Permission Error: Please go to Appwrite Console -> Database -> projects_collection -> Settings -> Permissions and enable Create permission for 'any' or 'users'.");
      } else {
        toast.error(error.message || "Failed to create project");
      }
    } finally {
      console.info("[ADMIN_PROJECT_CREATE] Create flow completed");
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      console.warn("[ADMIN_PROJECT_DELETE] Cancelled by user", { projectId: id });
      return;
    }

    console.info("[ADMIN_PROJECT_DELETE] Delete started", { projectId: id });
    try {
      await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_PROJECTS, id);
      console.info("[ADMIN_PROJECT_DELETE] Delete success", { projectId: id });

      const remainingProjects = projects.filter((p) => p.$id !== id);
      setProjects(remainingProjects);

      try {
        for (let index = 0; index < remainingProjects.length; index += 1) {
          const project = remainingProjects[index];
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_PROJECTS,
            project.$id,
            { display_order: index + 1 }
          );
        }
        console.info("[ADMIN_PROJECT_DELETE] Reindex success", { count: remainingProjects.length });
      } catch (error: any) {
        console.error("[ADMIN_PROJECT_DELETE] Reindex failed", error);
      }

      setOrderDirty(false);
      toast.success("Project deleted and order reindexed");
    } catch (error: any) {
      console.error("[ADMIN_PROJECT_DELETE] Delete failed", error);
      if (error?.code === 401 || error?.status === 401 || error?.message?.includes("authorized")) {
        toast.error("Appwrite 401 Permission Error: Please go to Appwrite Console -> Database -> projects_collection -> Settings -> Permissions and enable Delete permission for 'any' or 'users'.");
      } else {
        toast.error(error?.message || "Deletion failed");
      }
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "profile", label: "Admin Profile", icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-[#050816] text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-20 flex flex-col bg-[#151030]/80 backdrop-blur-xl border-r border-white/5 h-full transition-all duration-300"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <img
              src={userData?.logo || "/logo.webp"}
              alt="Gurudeep V Portfolio Logo"
              className="w-9 h-9 object-cover rounded-lg border border-white/10 shadow-lg shadow-indigo-500/20"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight truncate max-w-[140px]">{userData?.name || "Gurudeep V"}</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Admin Portal</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors" title="Toggle Sidebar">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-500/5 font-semibold' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5 font-medium'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mx-4">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all font-semibold">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[#0a0a0a]/50 overflow-hidden">
        <header className="px-8 py-5 bg-[#050816]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold capitalize text-white">{activeTab === "profile" ? "Admin Profile" : activeTab}</h2>
            <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/50 hidden sm:inline-block font-mono">v1.1.4</span>
          </div>

          <div className="flex items-center gap-4">
             {/* View Live Site Link */}
             <a
               href="/"
               target="_blank"
               rel="noreferrer noopener"
               className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
             >
               <Globe size={15} className="text-indigo-400" />
               <span className="hidden sm:inline">View Live Site</span>
             </a>

             <button
               onClick={fetchData}
               className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
               title="Refresh Data"
             >
               <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
             </button>

             <button
               onClick={() => setActiveTab("profile")}
               className="flex items-center gap-3 pl-2 border-l border-white/10 hover:opacity-90 transition-opacity text-left cursor-pointer"
               title="Edit Admin Profile"
             >
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-semibold">{userData?.name || "Gurudeep V"}</p>
                   <p className="text-[10px] text-white/40">{userData?.email}</p>
                </div>
                <div className="relative">
                  <img
                    src={userData?.logo || "/logo.webp"}
                    alt={userData?.name || "Admin"}
                    className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-lg"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050816]" title="Appwrite Session Active" />
                </div>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-indigo-500" size={44} />
              <p className="text-xs text-white/40 font-mono">Syncing Cloud Database...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-7xl mx-auto">
                  {/* Overview Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-3xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Active Projects</p>
                        <span className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
                          <Briefcase size={20} />
                        </span>
                      </div>
                      <h4 className="text-4xl font-extrabold mt-3 text-white">{projects.length}</h4>
                      <p className="text-[11px] text-indigo-300/60 mt-2 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-400" /> Synced with Cloud DB
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-3xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Categories</p>
                        <span className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
                          <Tag size={20} />
                        </span>
                      </div>
                      <h4 className="text-4xl font-extrabold mt-3 text-white">{categories.length}</h4>
                      <p className="text-[11px] text-purple-300/60 mt-2 flex items-center gap-1">
                        Dynamic front-end filters
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-3xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Enquiries</p>
                        <span className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                          <MessageSquare size={20} />
                        </span>
                      </div>
                      <h4 className="text-4xl font-extrabold mt-3 text-white">{enquiries.length}</h4>
                      <p className="text-[11px] text-emerald-300/60 mt-2 flex items-center gap-1">
                        Client contact submissions
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Cloud Engine</p>
                        <span className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
                          <Globe size={20} />
                        </span>
                      </div>
                      <h4 className="text-xl font-extrabold mt-3 text-white">Appwrite</h4>
                      <p className="text-[11px] text-amber-300/60 mt-2 flex items-center gap-1">
                        Live Database & Bucket API
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="p-6 bg-[#151030]/40 border border-white/5 rounded-3xl">
                    <h3 className="text-md font-bold mb-4 text-white/90">Quick Admin Shortcuts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => { setActiveTab("projects"); setIsModalOpen(true); }}
                        className="p-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-2xl flex items-center gap-3 text-indigo-300 hover:text-indigo-200 transition-all text-sm font-semibold"
                      >
                        <Plus size={18} /> Add New Project
                      </button>
                      <button
                        onClick={() => setActiveTab("categories")}
                        className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-2xl flex items-center gap-3 text-purple-300 hover:text-purple-200 transition-all text-sm font-semibold"
                      >
                        <Tag size={18} /> Manage Categories
                      </button>
                      <button
                        onClick={() => setActiveTab("enquiries")}
                        className="p-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 hover:text-emerald-200 transition-all text-sm font-semibold"
                      >
                        <MessageSquare size={18} /> View Contact Messages
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "projects" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-[#151030]/50 p-6 rounded-3xl border border-white/5">
                    <div>
                      <h3 className="text-lg font-bold">Manage Work ({projects.length})</h3>
                      <p className="text-xs text-white/50 mt-1">Set custom display order, assign categories, and edit live links.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {orderDirty && (
                        <button
                          onClick={saveProjectOrder}
                          disabled={isSavingOrder}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-60 text-sm font-semibold"
                        >
                          {isSavingOrder ? <Loader2 size={18} className="animate-spin" /> : null}
                          Save Order
                        </button>
                      )}
                      <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm font-semibold">
                        <Plus size={18} /> Add Project
                      </button>
                    </div>
                  </div>

                  {/* Search Bar & Category Filter in Admin */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-3.5 text-white/40" size={18} />
                      <input
                        type="text"
                        placeholder="Search projects by title or description..."
                        value={projectSearchQuery}
                        onChange={(e) => setProjectSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#151030]/40 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 text-white text-sm"
                      />
                    </div>

                    <select
                      value={adminCategoryFilter}
                      onChange={(e) => setAdminCategoryFilter(e.target.value)}
                      className="px-4 py-3 bg-[#151030]/40 border border-white/10 rounded-2xl outline-none text-white text-sm"
                    >
                      <option value="All" className="bg-[#151030]">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#151030]">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {projects
                        .filter((p) => {
                          const matchesQuery = p.name?.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                            p.description?.toLowerCase().includes(projectSearchQuery.toLowerCase());
                          const matchesCategory = adminCategoryFilter === "All" || (p.category || "Portfolio").toLowerCase() === adminCategoryFilter.toLowerCase();
                          return matchesQuery && matchesCategory;
                        })
                        .map((p, index) => (
                        <div key={p.$id} className="bg-[#151030]/30 border border-white/5 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                          <div>
                            <div className="h-48 overflow-hidden relative bg-black/40">
                              <img src={p.image || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity backdrop-blur-xs">
                                <button onClick={() => handleDeleteProject(p.$id)} className="p-2.5 bg-red-500/80 hover:bg-red-500 rounded-xl text-white transition-colors" title="Delete Project" aria-label="Delete Project"><Trash2 size={18} /></button>
                                {p.live_site_link && (
                                  <a href={p.live_site_link} target="_blank" rel="noreferrer" className="p-2.5 bg-indigo-500/80 hover:bg-indigo-500 rounded-xl text-white transition-colors" title="Open Live Site" aria-label="Open Live Site"><ExternalLink size={18} /></a>
                                )}
                                <button onClick={() => openEditModal(p)} className="p-2.5 bg-yellow-500/80 hover:bg-yellow-500 rounded-xl text-black transition-colors" title="Edit Project" aria-label="Edit Project"><Settings size={18} /></button>
                              </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Order</span>
                                  <select
                                    value={index + 1}
                                    onChange={(e) => setProjectOrderByNumber(p.$id, Number(e.target.value))}
                                    className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-white outline-none"
                                    aria-label={`Set order for ${p.name}`}
                                  >
                                    {Array.from({ length: projects.length }, (_, i) => i + 1).map((position) => (
                                      <option key={`${p.$id}-position-${position}`} value={position}>
                                        #{position}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-indigo-500/30">
                                  {p.category || "Portfolio"}
                                </span>
                              </div>

                              <h4 className="font-bold text-lg mb-2 text-white">{p.name}</h4>
                              <p className="text-sm text-white/50 line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-2">
                                {p.tags?.split(',').map((tag: any, i: any) => (
                                 <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md uppercase font-bold tracking-wider text-white/60">#{tag.trim()}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="px-6 pb-6 pt-2 border-t border-white/5 flex justify-between items-center text-xs text-white/40">
                             <span>ID: {p.$id?.substring(0, 8)}...</span>
                             <button onClick={() => openEditModal(p)} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                               Edit <Edit2 size={12} />
                             </button>
                          </div>
                        </div>
                       ))}
                   </div>
                </motion.div>
              )}

              {/* Edit Project Modal */}
              {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#151030] border border-white/10 p-8 rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-indigo-500" />
                   <h3 className="text-2xl font-bold mb-8">Edit Project</h3>
                           <form onSubmit={handleEditProject} className="space-y-4">
                             <input type="text" placeholder="Project Name" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                             <textarea placeholder="Description" rows={3} required value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                             
                             <div>
                               <label className="block text-xs text-white/50 mb-1 ml-1 font-medium">Category</label>
                               <select
                                 value={editForm.category}
                                 onChange={e => setEditForm({...editForm, category: e.target.value})}
                                 className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50 text-white"
                               >
                                 {categories.map((cat) => (
                                   <option key={cat} value={cat} className="bg-[#151030] text-white">
                                     {cat}
                                   </option>
                                 ))}
                               </select>
                             </div>

                             <input type="text" placeholder="Tags (comma separated: React, Tailwind)" value={editForm.tags} onChange={e => setEditForm({...editForm, tags: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                             <input type="url" placeholder="Live Site Link" value={editForm.live_site_link} onChange={e => setEditForm({...editForm, live_site_link: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                             <div className="flex items-center gap-4 p-4 border-2 border-dashed border-white/5 rounded-2xl">
                               <div className="flex-1 text-sm text-white/40">{editForm.imageFile ? editForm.imageFile.name : (editForm.image ? "Current image set" : "Select cover image")}</div>
                               <input type="file" onChange={e => setEditForm({...editForm, imageFile: e.target.files?.[0] || null})} className="hidden" id="edit-file-upload" />
                               <label htmlFor="edit-file-upload" className="px-4 py-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">Browse</label>
                             </div>
                             <div className="flex gap-4 mt-8">
                               <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-white/40 font-bold">Cancel</button>
                               <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-yellow-500 rounded-2xl font-bold shadow-lg shadow-yellow-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                 {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                               </button>
                             </div>
                           </form>
                         </motion.div>
                        </div>
                      )}

              {activeTab === "categories" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex justify-between items-center bg-[#151030]/50 p-6 rounded-3xl border border-white/5">
                    <div>
                      <h3 className="text-lg font-bold">Manage Categories</h3>
                      <p className="text-xs text-white/50 mt-1">Add, edit, or remove project categories. Projects assigned to renamed categories will update automatically.</p>
                    </div>
                  </div>

                  {/* Add Category Form */}
                  <div className="bg-[#151030]/30 border border-white/5 p-6 rounded-3xl max-w-xl">
                    <h4 className="font-bold text-md mb-4 flex items-center gap-2 text-white">
                      <Plus size={18} className="text-indigo-400" /> Add New Category
                    </h4>
                    <form onSubmit={handleAddCategory} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g. E-Commerce, Mobile Apps, Branding"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 p-3.5 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/50 text-white text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-sm whitespace-nowrap"
                      >
                        Add Category
                      </button>
                    </form>
                  </div>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                      const projectCount = projects.filter(
                        (p) => (p.category || "Portfolio").toLowerCase() === cat.toLowerCase()
                      ).length;

                      return (
                        <div
                          key={cat}
                          className="p-6 bg-[#151030]/30 border border-white/5 rounded-3xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all"
                        >
                          {editingCategory === cat ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-sm font-semibold outline-none focus:border-yellow-500 text-white"
                                autoFocus
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setEditingCategory(null)}
                                  className="px-3 py-1.5 text-xs text-white/50 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditCategory(cat)}
                                  className="px-4 py-1.5 bg-yellow-500 text-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-all"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                    <Tag size={18} />
                                  </span>
                                  <span className="text-[11px] bg-white/5 px-2.5 py-1 rounded-full text-white/50 font-medium">
                                    {projectCount} {projectCount === 1 ? "Project" : "Projects"}
                                  </span>
                                </div>
                                <h4 className="font-bold text-lg text-white mt-1">{cat}</h4>
                              </div>

                              <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-white/5">
                                <button
                                  onClick={() => handleStartEditCategory(cat)}
                                  className="p-2 bg-yellow-500/80 hover:bg-yellow-500 rounded-lg text-black transition-all"
                                  title="Edit Category Name"
                                  aria-label="Edit Category Name"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-all"
                                  title="Delete Category"
                                  aria-label="Delete Category"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "enquiries" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {enquiries.length === 0 ? (
                    <div className="text-center text-white/40 py-12">No enquiries found.</div>
                  ) : (
                    <>
                      {enquiries.map((e: any) => (
                        <div key={e.$id} className="p-6 bg-[#151030]/30 border border-white/5 rounded-3xl flex flex-col md:flex-row gap-6 md:items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <UserIcon size={16} className="text-indigo-400" />
                              <span className="font-bold">{e.name}</span>
                              <span className="text-xs text-white/20 ml-2">•</span>
                              <span className="text-xs text-white/40">{e.email}</span>
                              {e.phone && (
                                <>
                                  <span className="text-xs text-white/20 ml-2">•</span>
                                  <span className="text-xs text-white/40">{e.phone}</span>
                                </>
                              )}
                            </div>
                            <p className="text-white/80 text-sm bg-black/20 p-4 rounded-xl italic border border-white/5">"{e.message}"</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-white/20 whitespace-nowrap">
                            <Calendar size={14} /> {new Date(e.$createdAt).toLocaleDateString()}
                            <button onClick={() => openEditEnquiryModal(e)} className="p-2 bg-yellow-500/80 rounded-lg ml-2" title="Edit Enquiry" aria-label="Edit Enquiry"><Settings size={16} /></button>
                            <button onClick={() => handleDeleteEnquiry(e.$id)} className="p-2 bg-red-500/80 rounded-lg ml-2" title="Delete Enquiry" aria-label="Delete Enquiry"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                      {/* Edit Enquiry Modal */}
                      {isEditEnquiryModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsEditEnquiryModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#151030] border border-white/10 p-8 rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-indigo-500" />
                            <h3 className="text-2xl font-bold mb-8">Edit Enquiry</h3>
                            <form onSubmit={handleEditEnquiry} className="space-y-4">
                              <input type="text" placeholder="Name" required value={editEnquiryForm.name} onChange={e => setEditEnquiryForm({...editEnquiryForm, name: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                              <input type="email" placeholder="Email" required value={editEnquiryForm.email} onChange={e => setEditEnquiryForm({...editEnquiryForm, email: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                              <input type="text" placeholder="Phone" value={editEnquiryForm.phone} onChange={e => setEditEnquiryForm({...editEnquiryForm, phone: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                              <textarea placeholder="Message" rows={3} required value={editEnquiryForm.message} onChange={e => setEditEnquiryForm({...editEnquiryForm, message: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-yellow-500/50" />
                              <div className="flex gap-4 mt-8">
                                <button type="button" onClick={() => setIsEditEnquiryModalOpen(false)} className="flex-1 py-4 text-white/40 font-bold">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-yellow-500 rounded-2xl font-bold shadow-lg shadow-yellow-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto">
                  <div className="flex justify-between items-center bg-[#151030]/50 p-6 rounded-3xl border border-white/5">
                    <div>
                      <h3 className="text-lg font-bold text-white">Admin Profile Settings</h3>
                      <p className="text-xs text-white/50 mt-1">Manage your admin display name, contact email, phone number, and logo avatar.</p>
                    </div>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Admin Access Granted
                    </span>
                  </div>

                  <div className="bg-[#151030]/30 border border-white/5 p-8 rounded-3xl backdrop-blur-xl">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      {/* Logo Preview & Upload */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
                        <div className="relative group">
                          <img
                            src={profileForm.logoFile ? URL.createObjectURL(profileForm.logoFile) : (profileForm.logo || "/logo.webp")}
                            alt="Admin Logo"
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/10"
                          />
                          <label htmlFor="admin-logo-upload" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-semibold gap-1">
                            <Camera size={20} />
                            Change Logo
                          </label>
                          <input
                            type="file"
                            id="admin-logo-upload"
                            accept="image/*"
                            onChange={(e) => setProfileForm({ ...profileForm, logoFile: e.target.files?.[0] || null })}
                            className="hidden"
                          />
                        </div>

                        <div className="flex-1 space-y-1 text-center sm:text-left">
                          <h4 className="font-bold text-lg text-white">Admin Logo & Avatar</h4>
                          <p className="text-xs text-white/50">Upload a custom logo image file or provide a logo image URL below.</p>
                          {profileForm.logoFile && (
                            <p className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Selected file: {profileForm.logoFile.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs text-white/60 mb-2 font-semibold">Admin Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-3.5 text-white/30" size={18} />
                            <input
                              type="text"
                              required
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              placeholder="e.g. Gurudeep V"
                              className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 text-white text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 mb-2 font-semibold font-sans">Admin Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-white/30" size={18} />
                            <input
                              type="email"
                              required
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              placeholder="e.g. gurudeepv55@gmail.com"
                              className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 text-white text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 mb-2 font-semibold">Contact Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3.5 text-white/30" size={18} />
                            <input
                              type="text"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                              placeholder="e.g. +91 6363770057"
                              className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 text-white text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-white/60 mb-2 font-semibold">Logo Image URL</label>
                          <div className="relative">
                            <Globe className="absolute left-4 top-3.5 text-white/30" size={18} />
                            <input
                              type="text"
                              value={profileForm.logo}
                              onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                              placeholder="e.g. /logo.webp or https://..."
                              className="w-full pl-11 pr-4 py-3 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 text-white text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 text-sm cursor-pointer"
                        >
                          {isSavingProfile ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                          Save Profile Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#151030] border border-white/10 p-8 rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
             <h3 className="text-2xl font-bold mb-8">New Project</h3>
             <form onSubmit={handleCreateProject} className="space-y-4">
                <input type="text" placeholder="Project Name" required value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/50" />
                <textarea placeholder="Description" rows={3} required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/50" />
                
                <div>
                  <label className="block text-xs text-white/50 mb-1 ml-1 font-medium">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={e => setProjectForm({...projectForm, category: e.target.value})}
                    className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/50 text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#151030] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <input type="text" placeholder="Tags (comma separated: React, Tailwind)" value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/50" />
                <input type="url" placeholder="Live Site Link" value={projectForm.live_site_link} onChange={e => setProjectForm({...projectForm, live_site_link: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/50" />
                
                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-white/5 rounded-2xl">
                   <div className="flex-1 text-sm text-white/40">{projectForm.imageFile ? projectForm.imageFile.name : "Select cover image"}</div>
                   <input type="file" onChange={e => setProjectForm({...projectForm, imageFile: e.target.files?.[0] || null})} className="hidden" id="file-upload" />
                   <label htmlFor="file-upload" className="px-4 py-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">Browse</label>
                </div>

                <div className="flex gap-4 mt-8">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-white/40 font-bold">Cancel</button>
                   <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-indigo-600 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Project"}
                   </button>
                </div>
             </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
