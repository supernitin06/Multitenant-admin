import React, { useEffect, useState } from "react";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiMenu,
    FiX,
    FiSun,
    FiMoon,
    FiUser,
    FiLogOut,
    FiSettings,
    FiChevronDown,
    FiZap,
} from "react-icons/fi";

// ─── SidebarItem Component ────────────────────────────────────────────────────
const SidebarItem = ({ item, level = 0 }) => {
    const { expandedItems, toggleExpand, toggleSidebar, isCollapsed } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    const hasChildren = item.children?.length > 0;
    const isExpanded = expandedItems.has(item.id);

    const isActive =
        location.pathname === item.path ||
        (hasChildren && item.children.some((child) => child.path === location.pathname));

    const handleClick = () => {
        if (hasChildren) {
            toggleExpand(item.id);
            if (isCollapsed) toggleSidebar();
        } else if (item.path) {
            if (isCollapsed) toggleSidebar();
            navigate(item.path);
        }
    };

    const paddingLeft = `${0.75 + level * 1}rem`;
    const IconComponent = level > 0 ? Circle : item.icon;

    return (
        <div className="mb-0.5 relative group">
            <div
                onClick={handleClick}
                style={{ paddingLeft }}
                className={`flex items-center cursor-pointer rounded-xl transition-all duration-200 relative
                    ${isActive
                        ? level > 0
                            ? "bg-[rgba(0,230,118,0.12)] text-[#00e676] border-l-2 border-[#00e676]"
                            : "bg-[rgba(0,230,118,0.12)] text-[#00e676]"
                        : "text-[#557a9a] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#8bafc7]"
                    }
                    ${isCollapsed ? "justify-center px-3 py-3" : "px-4 py-2.5"}
                `}
            >
                {/* Active indicator bar */}
                {isActive && !isCollapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#00e676] rounded-r-full shadow-[0_0_8px_rgba(0,230,118,0.6)]" />
                )}

                <span className="text-lg flex-shrink-0">
                    {IconComponent && (
                        <IconComponent
                            size={level > 0 ? 9 : 16}
                            strokeWidth={level > 0 ? 2 : 1.8}
                            className={`${isActive ? "text-[#00e676]" : ""} ${level > 0 ? "opacity-50" : ""}`}
                        />
                    )}
                </span>

                {!isCollapsed && (
                    <>
                        <span className={`ml-3 flex-1 text-[13px] font-medium truncate ${isActive ? "text-[#00e676] font-semibold" : ""}`}>
                            {item.label}
                        </span>
                        {hasChildren && (
                            <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                className={`ml-auto opacity-50 ${isActive ? "opacity-100 text-[#00e676]" : ""}`}
                            >
                                <FiChevronDown size={14} />
                            </motion.span>
                        )}
                    </>
                )}
            </div>

            {/* Dropdown Children */}
            {hasChildren && !isCollapsed && (
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 border-l border-[#1a2a40] pl-1"
                        >
                            {item.children.map((child) => (
                                <SidebarItem key={child.id} item={child} level={level + 1} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Collapsed hover popup */}
            {hasChildren && isCollapsed && (
                <div className="absolute left-full top-0 ml-3 hidden group-hover:flex flex-col bg-[#0d1523] border border-[#1a2a40] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden min-w-[160px]">
                    <div className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#557a9a] border-b border-[#1a2a40]">
                        {item.label}
                    </div>
                    {item.children.map((child) => (
                        <div
                            key={child.id}
                            onClick={() => navigate(child.path)}
                            className="px-4 py-2.5 text-sm text-[#8bafc7] hover:bg-[rgba(0,230,118,0.08)] hover:text-[#00e676] cursor-pointer whitespace-nowrap flex items-center gap-2 transition-all"
                        >
                            <Circle size={8} strokeWidth={2} className="opacity-50" />
                            {child.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Profile Section ──────────────────────────────────────────────────────────
const ProfileSection = () => {
    const { isCollapsed } = useSidebar();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const getUserInitials = () => {
        if (user?.name)
            return user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
        if (user?.email) return user.email[0].toUpperCase();
        return "U";
    };

    const handleAuthAction = () => {
        logout();
        navigate("/");
    };

    if (isCollapsed) {
        return (
            <div className="border-t border-[#1a2a40] p-3 flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00e676] to-[#00acc1] flex items-center justify-center text-[#080d14] font-bold text-sm shadow-[0_0_12px_rgba(0,230,118,0.3)]">
                    {getUserInitials()}
                </div>
                <button
                    onClick={handleAuthAction}
                    title={user ? "Logout" : "Login"}
                    className="p-2 rounded-lg bg-[rgba(255,82,82,0.15)] text-[#ff5252] hover:bg-[rgba(255,82,82,0.25)] transition-all"
                >
                    {user ? <FiLogOut size={14} /> : <FiUser size={14} />}
                </button>
            </div>
        );
    }

    return (
        <motion.div
            className="border-t border-[#1a2a40] p-4 bg-[#0a121e]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00e676] to-[#00acc1] flex items-center justify-center text-[#080d14] font-bold text-sm flex-shrink-0 shadow-[0_0_12px_rgba(0,230,118,0.25)]">
                    {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate text-white">
                        {user?.email || "Guest User"}
                    </p>
                    {user && (
                        <p className="text-[11px] text-[#00e676] capitalize mt-0.5">
                            {user.role && typeof user.role === "object" ? user.role.name : (user.role || "Admin")}
                        </p>
                    )}
                </div>
                <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse shadow-[0_0_6px_rgba(0,230,118,0.6)]" />
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] text-[#557a9a] hover:text-white transition-all"
                >
                    {theme === "light" ? <FiMoon size={13} /> : <FiSun size={13} />}
                    <span>Theme</span>
                </button>
                {user && (
                    <button
                        onClick={() => navigate("/settings")}
                        className="flex items-center justify-center p-2 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] text-[#557a9a] hover:text-white transition-all"
                    >
                        <FiSettings size={13} />
                    </button>
                )}
                <button
                    onClick={handleAuthAction}
                    className="flex items-center justify-center p-2 rounded-lg bg-[rgba(255,82,82,0.12)] text-[#ff5252] hover:bg-[rgba(255,82,82,0.2)] transition-all"
                >
                    {user ? <FiLogOut size={13} /> : <FiUser size={13} />}
                </button>
            </div>
        </motion.div>
    );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
const Sidebar = () => {
    const { isCollapsed, toggleSidebar, sidebarConfig, loading } = useSidebar();
    const { user, tenant } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderPlaceholder = () =>
        Array.from({ length: 5 }).map((_, idx) => (
            <div
                key={idx}
                className="h-10 bg-[rgba(255,255,255,0.05)] rounded-xl my-1 animate-pulse"
            />
        ));

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && !isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={toggleSidebar}
                />
            )}

            <motion.div
                className="fixed top-0 left-0 h-screen flex flex-col z-50"
                style={{
                    background: "linear-gradient(180deg, #0a121e 0%, #080d14 100%)",
                    borderRight: "1px solid rgba(26, 42, 64, 0.8)",
                    boxShadow: "4px 0 32px rgba(0, 0, 0, 0.5)",
                }}
                animate={{ width: isCollapsed ? (isMobile ? 64 : 64) : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* ─── Logo / Header ─── */}
                <div
                    className="flex items-center justify-between p-4 min-h-[64px]"
                    style={{ borderBottom: "1px solid rgba(26, 42, 64, 0.8)" }}
                >
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            {/* Logo icon */}
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, #00e676, #00acc1)",
                                    boxShadow: "0 0 16px rgba(0, 230, 118, 0.35)",
                                }}
                            >
                                <FiZap size={16} className="text-[#080d14]" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold text-white leading-tight">
                                    {tenant?.name ? tenant.name.split(" ")[0] : "SuperAdmin"}
                                </h2>
                                <p className="text-[10px] text-[#00e676] font-medium tracking-wider uppercase">
                                    Command Center
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {isCollapsed && (
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto"
                            style={{
                                background: "linear-gradient(135deg, #00e676, #00acc1)",
                                boxShadow: "0 0 12px rgba(0, 230, 118, 0.3)",
                            }}
                        >
                            <FiZap size={16} className="text-[#080d14]" strokeWidth={2.5} />
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            className="p-1.5 rounded-lg text-[#557a9a] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
                            onClick={toggleSidebar}
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </div>

                {/* ─── Toggle for collapsed state ─── */}
                {isCollapsed && (
                    <div className="flex justify-center pt-3 pb-1">
                        <button
                            className="p-1.5 rounded-lg text-[#557a9a] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
                            onClick={toggleSidebar}
                        >
                            <FiMenu size={16} />
                        </button>
                    </div>
                )}

                {/* ─── Section Label ─── */}
                {!isCollapsed && (
                    <div className="px-4 pt-5 pb-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#2a4060]">
                            Navigation
                        </p>
                    </div>
                )}

                {/* ─── Nav Items ─── */}
                <div
                    className="flex-1 overflow-y-auto px-2 py-1
                        [&::-webkit-scrollbar]:w-[3px]
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:bg-[#1a2a40]
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-[#00e676]
                        transition-all duration-300"
                >
                    {loading
                        ? renderPlaceholder()
                        : sidebarConfig.map((item) => (
                            <SidebarItem key={item.id} item={item} />
                        ))}
                </div>

                {/* ─── Profile / Footer ─── */}
                <ProfileSection />
            </motion.div>
        </>
    );
};

export default Sidebar;
