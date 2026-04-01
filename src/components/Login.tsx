import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, getCurrentUser, hasAppwriteSessionCookie } from "../lib/appwrite";
import { motion } from "framer-motion";
import { LogIn, User, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!hasAppwriteSessionCookie()) {
        console.info("[AUTH_LOGIN] No session cookie found, skipping account check");
        return;
      }

      const user = await getCurrentUser();
      if (user) {
        navigate("/admin");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[AUTH_LOGIN]: Attempting login for", email);
      await login(email, password);
      console.log("[AUTH_LOGIN]: Login successful");
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (error: any) {
      console.error("[AUTH_LOGIN_ERROR]:", error);
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 via-primary/50 to-primary pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 bg-[#151030]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-4 bg-indigo-500/20 rounded-2xl mb-4 border border-indigo-500/30">
            <LogIn className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white-100/60 text-sm">Welcome back, Gurudeep.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block ml-1">Email Address</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a]/50 border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a]/50 border border-white/5 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:grayscale disabled:cursor-wait flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/40 text-[13px]">
            &copy; {new Date().getFullYear()} Appwrite Integration Portfolio
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
