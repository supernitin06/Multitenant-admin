import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiLock, FiMail, FiEye, FiEyeOff, FiShield, FiCpu,
  FiGlobe, FiServer, FiBriefcase, FiZap, FiSun, FiMoon, FiGrid, FiUsers, FiUserCheck
} from "react-icons/fi";

import { useLoginMutation } from "../../api/platform/auth.api";
import { useStaffLoginMutation } from "../../api/platform/staff.api";
import { useAuth } from "../../context/AuthContext";

export default function UnifiedLogin() {
  const navigate = useNavigate();
  const { login: authLogin, user, loading } = useAuth();

  const [theme, setTheme] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // DEFAULT: STAFF (2 fields)

  const [adminLoginApi, { isLoading: isAdminLoading }] = useLoginMutation();
  const [staffLoginApi, { isLoading: isStaffLoading }] = useStaffLoginMutation();

  const isLoading = isAdminLoading || isStaffLoading;

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const loginFn = isAdmin ? adminLoginApi : staffLoginApi;
      const response = await loginFn({ email, password }).unwrap();

      toast.success(`✅ ${isAdmin ? 'SUPER ADMIN' : 'STAFF'} VERIFIED`);

      setTimeout(() => {
        authLogin(response.user, response.token);
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(`❌ AUTHENTICATION FAILED`);
    }
  };

  const themeConfig = {
    1: { name: "Clinical", icon: <FiSun />, color: "#2563eb", bg: "bg-[#f8fafc]", card: "rounded-none border-slate-200 bg-white shadow-2xl" },
    2: { name: "Matrix", icon: <FiMoon />, color: "#10b981", bg: "bg-[#020617]", card: "rounded-[2.5rem] border-[#10b981]/20 bg-slate-950/80" },

    3: { name: "Protocol", icon: <FiZap />, color: "#f59e0b", bg: "bg-black", card: "rounded-tr-[5rem] rounded-bl-[5rem] border-[#f59e0b] bg-black" },
    4: { name: "Global Hub", icon: <FiGlobe />, color: "#06b6d4", bg: "bg-[#082f49]", card: "rounded-3xl border-[#06b6d4]/30 bg-sky-950/50 backdrop-blur-md" },
    5: { name: "Core Engine", icon: <FiServer />, color: "#e11d48", bg: "bg-[#1c1917]", card: "rounded-none border-l-8 border-[#e11d48] bg-stone-900" },
    6: { name: "Executive", icon: <FiBriefcase />, color: "#4f46e5", bg: "bg-slate-50", card: "rounded-xl border-slate-300 bg-white shadow-sm" }
  };

  const current = themeConfig[theme];
  const isLightTheme = theme === 2 || theme === 6;

  const inputStyle = {
    color: isLightTheme ? '#000' : '#fff',
    borderColor: `${current.color}30`,
    backgroundColor: isLightTheme ? '#f1f5f9' : 'rgba(0,0,0,0.2)'
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-700 ${current.bg}`}>

      {/* THEME SELECTOR */}
      <div className="absolute top-6 flex flex-wrap justify-center gap-2 p-1.5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl z-[100]">
        {Object.entries(themeConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setTheme(Number(key))}
            className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all flex items-center gap-2 relative h-10"
            style={{ color: theme === Number(key) ? '#000' : '#94a3b8' }}
          >
            {theme === Number(key) && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-lg z-0" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
            )}
            <span className="relative z-10 flex items-center gap-2">{cfg.icon} {cfg.name}</span>
          </button>
        ))}
      </div>

      <ToastContainer theme={isLightTheme ? "light" : "dark"} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${theme}-${isAdmin}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`w-full max-w-[1200px] flex overflow-hidden border transition-all duration-500 shadow-2xl ${current.card}`}
        >
          {/* LEFT: FORM AREA */}
          <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">

            {/* ROLE TOGGLE */}
            <div className="flex mb-8 p-1 bg-black/10 rounded-xl w-fit border border-white/5">
              <button onClick={() => setIsAdmin(false)} className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${!isAdmin ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <FiUsers /> Staff Portal
              </button>
              <button onClick={() => setIsAdmin(true)} className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${isAdmin ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <FiShield /> Super Admin
              </button>
            </div>

            <div className="mb-10">
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none" style={{ color: isLightTheme ? '#0f172a' : '#fff' }}>
                {isAdmin ? 'SYSTEM' : 'STAFF'} <span style={{ color: current.color }}>{isAdmin ? 'ADMIN' : 'LOGIN'}</span>
              </h1>
              <p className="text-[10px] opacity-60 font-mono mt-3 tracking-[0.4em] uppercase" style={{ color: isLightTheme ? '#64748b' : '#94a3b8' }}>
                {isAdmin ? 'Multi-Tenant Master Control' : 'Secure Enterprise Gateway'}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* FIELD 1: EMAIL */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest opacity-80 ml-1" style={{ color: current.color }}>Email Identifier</label>
                <div className="relative">
                  <FiMail className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: current.color }} />
                  <input
                    name="email"
                    required
                    defaultValue={isAdmin ? "super@erp.com" : "SUDHANSHU@GMAIL.COM"}
                    className="w-full py-5 pl-14 pr-6 bg-black/10 border-2 outline-none transition-all rounded-xl font-bold"
                    style={inputStyle}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* FIELD 2: PASSWORD */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest opacity-80 ml-1" style={{ color: current.color }}>Access Secret</label>
                <div className="relative">
                  <FiLock className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: current.color }} />
                  <input
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    defaultValue="111111"
                    className="w-full py-5 pl-14 pr-14 bg-black/10 border-2 outline-none transition-all rounded-xl font-bold"
                    style={inputStyle}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100">
                    {showPassword ? <FiEyeOff style={{ color: current.color }} /> : <FiEye style={{ color: current.color }} />}
                  </button>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full py-5 font-black uppercase tracking-widest transition-all text-white rounded-xl shadow-lg flex items-center justify-center gap-3 mt-4"
                style={{ backgroundColor: current.color }}
              >
                {isLoading ? "Authenticating..." : isAdmin ? "Authorize Master Session" : "Access Workspace"}
                {!isLoading && (isAdmin ? <FiCpu className="animate-pulse" /> : <FiUserCheck />)}
              </motion.button>
            </form>
          </div>

          {/* RIGHT VISUALS: CHANGES BASED ON ROLE */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-16 relative bg-black/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={isAdmin}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative flex items-center justify-center"
              >
                {isAdmin ? (
                  <>
                    <FiShield size={220} style={{ color: current.color, opacity: 0.1 }} />
                    <FiCpu size={80} style={{ color: current.color }} className="absolute animate-pulse" />
                  </>
                ) : (
                  <>
                    <FiGrid size={220} style={{ color: current.color, opacity: 0.1 }} />
                    <FiUserCheck size={80} style={{ color: current.color }} className="absolute" />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}