import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  logout, 
  getCurrentUser, 
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
  Mail,
  Calendar,
  User as UserIcon
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const checkAuth = async () => {
      console.log("[DASHBOARD_AUTH]: Checking session...");
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
    console.log("[DASHBOARD_DATA]: Fetching database records...");
    setLoading(true);
    try {
      const [projRes, enqRes] = await Promise.all([
        databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_PROJECTS, [Query.orderDesc("$createdAt")]),
        databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ENQUIRIES, [Query.orderDesc("$createdAt")])
      ]);
      console.log("[DASHBOARD_DATA]: Successfully fetched", projRes.documents.length, "projects and", enqRes.documents.length, "enquiries");
      setProjects(projRes.documents);
      setEnquiries(enqRes.documents);
    } catch (error) {
      console.error("[DASHBOARD_DATA_ERROR]:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      
      // Upload Image if selected
      if (projectForm.imageFile) {
        const uploadRes = await storage.createFile(
          APPWRITE_BUCKET_ID,
          ID.unique(),
          projectForm.imageFile
        );
        imageUrl = storage.getFilePreview(APPWRITE_BUCKET_ID, uploadRes.$id).toString();
      }

      await databases.createDocument(
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

      toast.success("Project created successfully!");
      setIsModalOpen(false);
      setProjectForm({ name: "", description: "", tags: "", live_site_link: "", imageFile: null });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_PROJECTS, id);
      toast.success("Project deleted");
      setProjects(projects.filter(p => p.$id !== id));
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "experience", label: "Experience", icon: History },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
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
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20">
                       <Plus size={18} /> Add Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {projects.map((p) => (
                      <div key={p.$id} className="bg-[#151030]/30 border border-white/5 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all">
                         <div className="h-48 overflow-hidden relative">
                            <img src={p.image || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                               <button onClick={() => handleDeleteProject(p.$id)} className="p-2 bg-red-500/80 rounded-lg"><Trash2 size={18} /></button>
                               <a href={p.live_site_link} target="_blank" className="p-2 bg-indigo-500/80 rounded-lg"><ExternalLink size={18} /></a>
                            </div>
                         </div>
                         <div className="p-6">
                            <h4 className="font-bold text-lg mb-2">{p.name}</h4>
                            <p className="text-sm text-white/40 line-clamp-2 mb-4">{p.description}</p>
                            <div className="flex flex-wrap gap-2">
                               {p.tags?.split(',').map((tag: any, i: any) => (
                                 <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md uppercase font-bold tracking-wider text-white/60">#{tag.trim()}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "enquiries" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                   {enquiries.length === 0 ? (
                     <div className="text-center py-20 opacity-20"><Mail size={48} className="mx-auto mb-4" /><p>No messages yet</p></div>
                   ) : (
                     enquiries.map((e) => (
                       <div key={e.$id} className="p-6 bg-[#151030]/30 border border-white/5 rounded-3xl flex flex-col md:flex-row gap-6 md:items-center">
                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                <UserIcon size={16} className="text-indigo-400" />
                                <span className="font-bold">{e.name}</span>
                                <span className="text-xs text-white/20 ml-2">•</span>
                                <span className="text-xs text-white/40">{e.email}</span>
                             </div>
                             <p className="text-white/80 text-sm bg-black/20 p-4 rounded-xl italic border border-white/5">"{e.message}"</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-white/20 whitespace-nowrap">
                             <Calendar size={14} /> {new Date(e.$createdAt).toLocaleDateString()}
                          </div>
                       </div>
                     ))
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
