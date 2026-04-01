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
  ArrowUp,
  ArrowDown,
  Mail,
  Calendar,
  User as UserIcon
} from "lucide-react";
import { toast } from "sonner";

const PROJECT_ORDER_STORAGE_KEY = "portfolio_project_order";
const PROJECT_ORDER_CLOUD_SYNC_KEY = "portfolio_project_order_cloud_sync";

const parseLocalOrderMap = () => {
  if (typeof window === "undefined") {
    return {} as Record<string, number>;
  }

  try {
    const raw = window.localStorage.getItem(PROJECT_ORDER_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
};

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

const getInitialCloudSyncCapability = () => {
  if (typeof window === "undefined") {
    return null as boolean | null;
  }

  const value = window.localStorage.getItem(PROJECT_ORDER_CLOUD_SYNC_KEY);
  if (value === "enabled") return true;
  if (value === "disabled") return false;
  return null;
};

const sortProjectsByCustomOrder = (projectList: any[]) => {
  const localOrderMap = parseLocalOrderMap();

  return [...projectList].sort((a, b) => {
    const aLocal = getNumericOrder(localOrderMap[a.$id]);
    const bLocal = getNumericOrder(localOrderMap[b.$id]);

    if (aLocal !== null && bLocal !== null && aLocal !== bLocal) {
      return aLocal - bLocal;
    }

    if (aLocal !== null && bLocal === null) return -1;
    if (aLocal === null && bLocal !== null) return 1;

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
      toast.error(error.message || "Failed to update enquiry");
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
    } catch (error) {
      console.error("[ADMIN_ENQUIRY_DELETE] Delete failed", error);
      toast.error("Failed to delete enquiry");
    }
  };

  // Fetch projects and enquiries from Appwrite
// Removed duplicate fetchData declaration
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [canSyncProjectOrder, setCanSyncProjectOrder] = useState<boolean | null>(getInitialCloudSyncCapability);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
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
            tags: editForm.tags,
            image: imageUrl,
            live_site_link: editForm.live_site_link
          }
        );
        console.info("[ADMIN_PROJECT_EDIT] Update success", { projectId: editProjectId });
        toast.success("Project updated successfully!");
        setIsEditModalOpen(false);
        setEditProjectId(null);
        fetchData();
      } catch (error: any) {
        console.error("[ADMIN_PROJECT_EDIT] Update failed", error);
        toast.error(error.message || "Failed to update project");
      } finally {
        console.info("[ADMIN_PROJECT_EDIT] Update flow completed", { projectId: editProjectId });
        setIsSubmitting(false);
      }
    };
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
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
      console.info("[ADMIN_DATA] Fetch success", {
        projectsCount: projRes.documents.length,
        enquiriesCount: enqRes.documents.length,
      });
      setProjects(sortProjectsByCustomOrder(projRes.documents));

      const hasCloudOrderFieldOnAnyDoc = projRes.documents.some((doc: any) => typeof doc.display_order !== "undefined");
      if (hasCloudOrderFieldOnAnyDoc) {
        setCanSyncProjectOrder(true);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PROJECT_ORDER_CLOUD_SYNC_KEY, "enabled");
        }
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

  const persistProjectOrderLocally = (orderedProjects: any[]) => {
    if (typeof window === "undefined") {
      return;
    }

    const orderMap: Record<string, number> = {};
    orderedProjects.forEach((project, index) => {
      if (project.$id) {
        orderMap[project.$id] = index + 1;
      }
    });

    window.localStorage.setItem(PROJECT_ORDER_STORAGE_KEY, JSON.stringify(orderMap));
  };

  const moveProject = (projectId: string, direction: "up" | "down") => {
    setProjects((prev) => {
      const currentIndex = prev.findIndex((p) => p.$id === projectId);
      if (currentIndex === -1) {
        return prev;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
      persistProjectOrderLocally(next);
      return next;
    });

    setOrderDirty(true);
  };

  const saveProjectOrder = async () => {
    setIsSavingOrder(true);
    console.info("[ADMIN_PROJECT_ORDER] Save started", { count: projects.length });

    try {
      if (canSyncProjectOrder === false) {
        persistProjectOrderLocally(projects);
        setOrderDirty(false);
        toast.success("Project order saved locally");
        return;
      }

      for (let index = 0; index < projects.length; index += 1) {
        const project = projects[index];
        try {
          await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_PROJECTS,
            project.$id,
            { display_order: index + 1 }
          );
        } catch (error: any) {
          const message = String(error?.message || "");
          const missingAttribute =
            message.includes("Unknown attribute") && message.includes("display_order");

          if (missingAttribute) {
            setCanSyncProjectOrder(false);
            if (typeof window !== "undefined") {
              window.localStorage.setItem(PROJECT_ORDER_CLOUD_SYNC_KEY, "disabled");
            }
            console.warn("[ADMIN_PROJECT_ORDER] display_order not found in schema, saving locally", {
              projectId: project.$id,
            });
            throw new Error("DISPLAY_ORDER_ATTRIBUTE_MISSING");
          }

          throw error;
        }
      }

      setCanSyncProjectOrder(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PROJECT_ORDER_CLOUD_SYNC_KEY, "enabled");
      }

      persistProjectOrderLocally(projects);
      setOrderDirty(false);
      toast.success("Project order saved");
      console.info("[ADMIN_PROJECT_ORDER] Save success");
    } catch (error: any) {
      persistProjectOrderLocally(projects);
      setOrderDirty(false);

      if (String(error?.message || "") === "DISPLAY_ORDER_ATTRIBUTE_MISSING") {
        toast.success("Order saved locally. Add numeric 'display_order' field in Appwrite projects collection to sync globally.");
      } else {
        console.error("[ADMIN_PROJECT_ORDER] Save failed", error);
        toast.error("Could not sync order to cloud. Local order is still saved.");
      }
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
          tags: projectForm.tags,
          image: imageUrl,
          live_site_link: projectForm.live_site_link
        }
      );

      console.info("[ADMIN_PROJECT_CREATE] Create success", { projectId: createdProject.$id });

      toast.success("Project created successfully!");
      setIsModalOpen(false);
      setProjectForm({ name: "", description: "", tags: "", live_site_link: "", imageFile: null });
      fetchData();
    } catch (error: any) {
      console.error("[ADMIN_PROJECT_CREATE] Create failed", error);
      toast.error(error.message || "Failed to create project");
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
      toast.success("Project deleted");
      setProjects(projects.filter(p => p.$id !== id));
    } catch (error) {
      console.error("[ADMIN_PROJECT_DELETE] Delete failed", error);
      toast.error("Deletion failed");
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20" />
            <span className="font-bold text-lg">Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
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
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mx-4">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[#0a0a0a]/50">
        <header className="px-8 py-5 bg-[#050816]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{userData?.name || "Gurudeep"}</p>
                <p className="text-[10px] text-white/40">{userData?.email}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-white/10 uppercase font-bold text-indigo-400 ml-2">
                {userData?.name?.charAt(0) || "G"}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                      <p className="text-white/40 text-sm">Active Projects</p>
                      <h4 className="text-4xl font-bold mt-2">{projects.length}</h4>
                    </div>
                    <div className="p-8 bg-purple-500/10 border border-purple-500/20 rounded-3xl">
                      <p className="text-white/40 text-sm">New Enquiries</p>
                      <h4 className="text-4xl font-bold mt-2">{enquiries.length}</h4>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "projects" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center bg-[#151030]/50 p-6 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold">Manage Work</h3>
                    <div className="flex items-center gap-3">
                      {orderDirty && (
                        <button
                          onClick={saveProjectOrder}
                          disabled={isSavingOrder}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-60"
                        >
                          {isSavingOrder ? <Loader2 size={18} className="animate-spin" /> : null}
                          Save Order
                        </button>
                      )}
                      <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20">
                        <Plus size={18} /> Add Project
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-white/50 px-1">
                    Use arrow buttons on each card to set custom order. Click Save Order to apply it.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                      {projects.map((p, index) => (
                       <div key={p.$id} className="bg-[#151030]/30 border border-white/5 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all flex flex-col">
                         <div className="h-48 overflow-hidden relative">
                           <img src={p.image || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                             <button onClick={() => handleDeleteProject(p.$id)} className="p-2 bg-red-500/80 rounded-lg" title="Delete Project" aria-label="Delete Project"><Trash2 size={18} /></button>
                             <a href={p.live_site_link} target="_blank" className="p-2 bg-indigo-500/80 rounded-lg" title="Open Live Site" aria-label="Open Live Site"><ExternalLink size={18} /></a>
                             <button onClick={() => openEditModal(p)} className="p-2 bg-yellow-500/80 rounded-lg" title="Edit Project" aria-label="Edit Project"><Settings size={18} /></button>
                           </div>
                         </div>
                         <div className="p-6 flex-1 flex flex-col">
                           <div className="mb-3 flex items-center justify-between">
                             <span className="text-[10px] uppercase tracking-wider text-white/40">Position #{index + 1}</span>
                             <div className="flex items-center gap-2">
                               <button
                                 onClick={() => moveProject(p.$id, "up")}
                                 disabled={index === 0}
                                 className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30"
                                 title="Move Up"
                                 aria-label="Move Up"
                               >
                                 <ArrowUp size={14} />
                               </button>
                               <button
                                 onClick={() => moveProject(p.$id, "down")}
                                 disabled={index === projects.length - 1}
                                 className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30"
                                 title="Move Down"
                                 aria-label="Move Down"
                               >
                                 <ArrowDown size={14} />
                               </button>
                             </div>
                           </div>
                           <h4 className="font-bold text-lg mb-2">{p.name}</h4>
                           <p className="text-sm text-white/40 line-clamp-2 mb-4">{p.description}</p>
                           <div className="flex flex-wrap gap-2 mb-2">
                             {p.tags?.split(',').map((tag: any, i: any) => (
                              <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md uppercase font-bold tracking-wider text-white/60">#{tag.trim()}</span>
                             ))}
                           </div>
                         </div>
                       </div>
                      ))}
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
