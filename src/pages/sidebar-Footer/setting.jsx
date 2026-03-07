import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSettings, FiUser, FiBell, FiShield, FiMoon, FiSun,
    FiZap, FiGlobe, FiServer, FiBriefcase, FiCpu, FiSave, FiLogOut, FiCheckCircle
} from "react-icons/fi";

export default function LightSettingsPage() {
    const [theme, setTheme] = useState(2); // Defaulting to Clinical (Light Mode)
    const [activeTab, setActiveTab] = useState("profile");

    const themeConfig = {
        1: { name: "Matrix", color: "#10b981", bg: "bg-[#020617]", card: "bg-slate-900 border-emerald-500/20", text: "text-white" },
        2: { name: "Clinical", color: "#2563eb", bg: "bg-slate-50", card: "bg-white border-slate-200 shadow-sm", text: "text-slate-900" },
        3: { name: "Protocol", color: "#f59e0b", bg: "bg-black", card: "bg-zinc-900 border-amber-500", text: "text-white" },
        4: { name: "Global Hub", color: "#06b6d4", bg: "bg-slate-50", card: "bg-white border-cyan-200 shadow-sm", text: "text-slate-900" },
        5: { name: "Core Engine", color: "#e11d48", bg: "bg-stone-50", card: "bg-white border-l-8 border-rose-500 shadow-md", text: "text-slate-900" },
        6: { name: "Executive", color: "#4f46e5", bg: "bg-[#f1f5f9]", card: "bg-white border-indigo-100 shadow-xl", text: "text-slate-900" }
    };

    const current = themeConfig[theme];
    // Logic to determine if we should use dark text based on background brightness
    const isLightMode = [2, 4, 5, 6].includes(theme);

    return (
        <div className={`min-h-screen transition-all duration-500 p-6 md:p-12 ${current.bg}`}>

            {/* MINIMALIST HEADER */}
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-5xl mx-auto flex justify-between items-end mb-12 border-b border-slate-200 pb-6"
            >
                <div>
                    <h1 className={`text-4xl font-black tracking-tight uppercase ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                        System <span style={{ color: current.color }}>Settings</span>
                    </h1>
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
                        Configuration Node • Alpha-01
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="text-right hidden sm:block">
                        <p className={`text-xs font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Super Admin</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: 882-991-X</p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                        <FiLogOut />
                    </button>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">

                {/* NAVIGATION SIDEBAR */}
                <div className="space-y-1">
                    {["profile", "security", "appearance", "notifications"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all`}
                            style={{
                                color: activeTab === tab ? current.color : '#94a3b8',
                                backgroundColor: activeTab === tab ? `${current.color}10` : 'transparent'
                            }}
                        >
                            <span className="flex items-center gap-3">
                                {tab === 'profile' && <FiUser />}
                                {tab === 'security' && <FiShield />}
                                {tab === 'appearance' && <FiZap />}
                                {tab === 'notifications' && <FiBell />}
                                {tab}
                            </span>
                            {activeTab === tab && <motion.div layoutId="dot" className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: current.color }} />}
                        </button>
                    ))}
                </div>

                {/* MAIN SETTINGS CARD */}
                <motion.div
                    layout
                    className={`lg:col-span-3 p-10 border rounded-[2rem] ${current.card} relative min-h-[500px]`}
                >
                    <AnimatePresence mode="wait">
                        {activeTab === "appearance" && (
                            <motion.div
                                key="appearance"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-8"
                            >
                                <section>
                                    <h3 className={`text-lg font-black uppercase mb-4 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Visual Engine</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {Object.entries(themeConfig).map(([key, cfg]) => (
                                            <button
                                                key={key}
                                                onClick={() => setTheme(Number(key))}
                                                className={`group relative overflow-hidden h-24 rounded-2xl border-2 transition-all p-4 text-left`}
                                                style={{
                                                    borderColor: theme === Number(key) ? cfg.color : 'transparent',
                                                    backgroundColor: theme === Number(key) ? `${cfg.color}05` : '#f8fafc'
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cfg.color }} />
                                                    {theme === Number(key) && <FiCheckCircle style={{ color: cfg.color }} />}
                                                </div>
                                                <p className="mt-4 font-black text-[9px] uppercase tracking-tighter text-slate-500">{cfg.name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-8 border-b border-slate-100 pb-8">
                                    <div className="w-20 h-20 rounded-3xl rotate-3 flex items-center justify-center shadow-inner bg-slate-100" style={{ border: `2px solid ${current.color}` }}>
                                        <FiUser size={30} style={{ color: current.color }} />
                                    </div>
                                    <div>
                                        <h4 className={`text-xl font-black ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Administrative Unit</h4>
                                        <p className="text-sm text-slate-400">super.admin@enterprise.sys</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-slate-800" defaultValue="Chief Administrator" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400">Access Key ID</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none transition-all font-mono text-xs text-slate-500" disabled defaultValue="RSA-4096-772-X" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* FLOATING ACTION BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute bottom-8 right-8 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-white flex items-center gap-3"
                        style={{ backgroundColor: current.color }}
                    >
                        <FiSave /> Save Settings
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}