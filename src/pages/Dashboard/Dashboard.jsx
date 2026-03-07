import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiUsers, FiPackage, FiActivity, FiArrowUpRight,
    FiShield, FiTrendingUp, FiGlobe, FiDatabase,
    FiArrowDownRight, FiMoreVertical, FiRefreshCw
} from "react-icons/fi";
import { useGetTenantsQuery } from "../../api/tenants/tenant.api";
import { useGetPlansQuery } from "../../api/plans.api";
import { useGetDomainsQuery } from "../../api/Common/domain.api";
import { useGetPlatformStatsQuery } from "../../api/dashboard.api.js";
import GenericTable from "../../components/Common/GenericTable";
import { tenantsTableConfig } from "../../config/tableConfigs.jsx";

// ─── Sparkline mini chart using canvas ───────────────────────────────────────
const Sparkline = ({ data = [], color = "#00e676", height = 40 }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data.length) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        ctx.clearRect(0, 0, w, h);

        // Gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, color + "33");
        grad.addColorStop(1, color + "00");

        const pts = data.map((v, i) => ({
            x: (i / (data.length - 1)) * w,
            y: h - ((v - min) / range) * (h - 4) - 2,
        }));

        // Fill area
        ctx.beginPath();
        ctx.moveTo(pts[0].x, h);
        pts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(pts[pts.length - 1].x, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;
        ctx.stroke();
    }, [data, color]);

    return <canvas ref={canvasRef} width={100} height={height} style={{ width: "100%", height }} />;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, trend, trendUp = true, sparkData, color = "#00e676", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -3, boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${color}22` }}
        className="metric-card p-5 cursor-default"
        style={{
            background: "linear-gradient(145deg, #0d1523, #0a1220)",
            border: "1px solid #1a2a40",
            borderRadius: "16px",
        }}
    >
        <div className="flex items-start justify-between mb-4">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
                {React.cloneElement(icon, { size: 18, style: { color } })}
            </div>
            {trend && (
                <div
                    className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg"
                    style={{
                        background: trendUp ? "rgba(0,230,118,0.12)" : "rgba(255,82,82,0.12)",
                        color: trendUp ? "#00e676" : "#ff5252",
                    }}
                >
                    {trendUp ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                    {trend}
                </div>
            )}
        </div>

        <div className="mb-4">
            <p className="text-[10px] font-semibold text-[#557a9a] uppercase tracking-widest mb-1.5">
                {title}
            </p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
                {value}
            </h3>
        </div>

        {sparkData && (
            <div className="opacity-80">
                <Sparkline data={sparkData} color={color} height={36} />
            </div>
        )}
    </motion.div>
);

// ─── Progress Row ─────────────────────────────────────────────────────────────
const ProgressRow = ({ label, value, total, color, unit = "", delay = 0 }) => {
    const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="space-y-2"
        >
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-[#557a9a]">{label}</span>
                <span className="text-[11px] font-bold text-white">
                    {value}{unit} <span className="text-[#2a4060] font-normal">/ {total}{unit}</span>
                </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "#1a2a40" }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${color}, ${color}bb)`,
                        boxShadow: `0 0 8px ${color}55`,
                    }}
                />
            </div>
        </motion.div>
    );
};

// ─── Activity Timeline ────────────────────────────────────────────────────────
const ActivityItem = ({ time, action, entity, status = "success" }) => (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(26,42,64,0.5)" }}>
        <div className="mt-1 flex-shrink-0">
            <div
                className="w-2 h-2 rounded-full"
                style={{
                    background: status === "success" ? "#00e676" : status === "warning" ? "#ffab40" : "#ff5252",
                    boxShadow: `0 0 6px ${status === "success" ? "#00e676" : status === "warning" ? "#ffab40" : "#ff5252"}88`,
                }}
            />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#8bafc7] leading-tight">
                {action} <span className="text-white font-semibold">{entity}</span>
            </p>
            <p className="text-[10px] text-[#2a4060] mt-0.5 font-mono">{time}</p>
        </div>
    </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const { data: tenantsData, isLoading: isTenantsLoading } = useGetTenantsQuery();
    const { data: plansData } = useGetPlansQuery();
    const { data: domainsData } = useGetDomainsQuery();
    const { data: statsData } = useGetPlatformStatsQuery();

    const tenants = tenantsData?.tenants || [];
    const plansCount = plansData?.plans?.length || 0;
    const domainsCount = domainsData?.domains?.length || 0;
    const activeTenants = tenants.filter(t => t.isActive).length;

    const miniTenantsConfig = {
        ...tenantsTableConfig,
        title: "Recent Tenants",
        columns: tenantsTableConfig.columns.slice(0, 3),
    };

    // Fake sparkline data for visual demo
    const revenueSpark = [20, 35, 28, 48, 40, 55, 45, 70, 62, 80, 72, 90];
    const tenantSpark = [5, 8, 6, 12, 10, 15, 13, 18, 16, 22, 20, 25];
    const domainSpark = [2, 3, 4, 3, 6, 5, 8, 7, 9, 11, 10, 13];
    const uptimeSpark = [99, 100, 98, 100, 99, 100, 100, 99, 98, 100, 99, 100];

    const recentActivity = [
        { time: "2 mins ago", action: "New tenant registered:", entity: "Acme Corp", status: "success" },
        { time: "15 mins ago", action: "Plan upgraded to Pro:", entity: "TechStart Ltd", status: "success" },
        { time: "1 hr ago", action: "Domain verified:", entity: "nexshop.io", status: "success" },
        { time: "3 hrs ago", action: "Billing updated for:", entity: "MegaStore Inc", status: "warning" },
        { time: "5 hrs ago", action: "User deactivated in:", entity: "RetailHub", status: "danger" },
    ];

    return (
        <div className="space-y-8 max-w-[1600px]">

            {/* ─── Header ─── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div
                            className="w-1 h-6 rounded-full"
                            style={{ background: "linear-gradient(180deg, #00e676, #00acc1)", boxShadow: "0 0 12px rgba(0,230,118,0.5)" }}
                        />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00e676]">
                            Admin Overview
                        </p>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                        Dashboard <span style={{ color: "#00e676", textShadow: "0 0 30px rgba(0,230,118,0.3)" }}>Overview</span>
                    </h1>
                    <p className="text-[12px] text-[#557a9a] mt-1.5 font-medium">
                        Multi-tenant infrastructure • Real-time monitoring
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-semibold"
                        style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", color: "#00e676" }}
                    >
                        <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" style={{ boxShadow: "0 0 6px rgba(0,230,118,0.8)" }} />
                        System Online
                    </div>
                    <button
                        className="p-2.5 rounded-xl transition-all"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1a2a40", color: "#557a9a" }}
                        title="Refresh"
                    >
                        <FiRefreshCw size={15} />
                    </button>
                </div>
            </motion.div>

            {/* ─── Stats Grid ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    title="Total Tenants"
                    value={tenants.length || "—"}
                    icon={<FiUsers />}
                    trend="+12.5%"
                    trendUp={true}
                    sparkData={tenantSpark}
                    color="#00e676"
                    delay={0}
                />
                <StatCard
                    title="Active Plans"
                    value={plansCount || "—"}
                    icon={<FiPackage />}
                    trend="+8%"
                    trendUp={true}
                    sparkData={revenueSpark}
                    color="#00acc1"
                    delay={0.1}
                />
                <StatCard
                    title="Domain Registry"
                    value={domainsCount || "—"}
                    icon={<FiGlobe />}
                    trend="+5"
                    trendUp={true}
                    sparkData={domainSpark}
                    color="#7c6af7"
                    delay={0.2}
                />
                <StatCard
                    title="System Uptime"
                    value="99.9%"
                    icon={<FiActivity />}
                    trend="0.1%"
                    trendUp={true}
                    sparkData={uptimeSpark}
                    color="#ffab40"
                    delay={0.3}
                />
            </div>

            {/* ─── Main Content Grid ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ─── Tenants Table (2/3 width) ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="xl:col-span-2"
                >
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: "#0d1523",
                            border: "1px solid #1a2a40",
                        }}
                    >
                        {/* Table header */}
                        <div
                            className="px-6 py-4 flex items-center justify-between"
                            style={{ borderBottom: "1px solid #1a2a40" }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.2)" }}
                                >
                                    <FiUsers size={15} color="#00e676" />
                                </div>
                                <div>
                                    <h2 className="text-[13px] font-bold text-white">Recent Operations</h2>
                                    <p className="text-[10px] text-[#557a9a]">Latest tenant activity</p>
                                </div>
                            </div>
                            <button
                                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                                style={{ background: "rgba(0,230,118,0.1)", color: "#00e676", border: "1px solid rgba(0,230,118,0.2)" }}
                            >
                                View All
                            </button>
                        </div>

                        {/* Override GenericTable styling using a wrapper with custom dark styles */}
                        <div className="dark-table-wrapper [&_.bg-white]:!bg-transparent [&_.dark\:bg-slate-800]:!bg-transparent [&_.border]:!border-[#1a2a40] [&_.shadow-sm]:!shadow-none [&_.rounded-xl]:!rounded-none [&_thead_tr]:!border-b-[#1a2a40] [&_th]:!text-[#2a4060] [&_th]:!text-[10px] [&_tbody_tr:hover]:!bg-[rgba(0,230,118,0.03)] [&_td]:!border-b-[#1a2a40] [&_.divide-y]:!divide-[#1a2a40] [&_.bg-slate-50]:!bg-transparent [&_.dark\:bg-slate-800\/50]:!bg-transparent [&_h3]:!text-[#557a9a] overflow-hidden">
                            <GenericTable
                                config={miniTenantsConfig}
                                data={tenants.slice(0, 5)}
                                loading={isTenantsLoading}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* ─── Right Panel (1/3 width) ─── */}
                <div className="space-y-5">

                    {/* Access Control Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl p-6 relative overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #0d1f35 0%, #091828 100%)",
                            border: "1px solid rgba(0,172,193,0.2)",
                            boxShadow: "0 0 40px rgba(0,172,193,0.05)",
                        }}
                    >
                        {/* Background glow */}
                        <div
                            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
                            style={{ background: "radial-gradient(circle, #00acc1, transparent)" }}
                        />
                        <FiShield
                            className="absolute -right-4 -bottom-4 opacity-5"
                            size={96}
                            color="#00acc1"
                        />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: "rgba(0,172,193,0.15)", border: "1px solid rgba(0,172,193,0.25)" }}
                                >
                                    <FiShield size={16} color="#00acc1" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-white">Access Control</h3>
                                    <p className="text-[10px] text-[#557a9a]">Security & permissions</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: "Active Roles", value: "12", color: "#00acc1" },
                                    { label: "Stored Permits", value: "156", color: "#00e676" },
                                    { label: "Auth Policies", value: "8", color: "#7c6af7" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <span className="text-[11px] font-medium text-[#557a9a]">{item.label}</span>
                                        <span className="text-[13px] font-bold" style={{ color: item.color }}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Platform Distribution */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl p-6"
                        style={{ background: "#0d1523", border: "1px solid #1a2a40" }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h4 className="text-[13px] font-bold text-white">Distribution</h4>
                                <p className="text-[10px] text-[#557a9a] mt-0.5">Platform utilization</p>
                            </div>
                            <FiTrendingUp size={16} color="#00e676" />
                        </div>

                        <div className="space-y-5">
                            <ProgressRow
                                label="Active Tenants"
                                value={activeTenants}
                                total={Math.max(tenants.length, 1)}
                                color="#00e676"
                                delay={0.5}
                            />
                            <ProgressRow
                                label="Revenue Nodes"
                                value={plansCount}
                                total={20}
                                color="#00acc1"
                                delay={0.6}
                            />
                            <ProgressRow
                                label="Global Domains"
                                value={domainsCount}
                                total={50}
                                color="#7c6af7"
                                delay={0.7}
                            />
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-2xl p-6"
                        style={{ background: "#0d1523", border: "1px solid #1a2a40" }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-[13px] font-bold text-white">Activity Feed</h4>
                                <p className="text-[10px] text-[#557a9a] mt-0.5">Live updates</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" style={{ boxShadow: "0 0 6px rgba(0,230,118,0.6)" }} />
                                <span className="text-[10px] text-[#00e676] font-semibold">Live</span>
                            </div>
                        </div>

                        <div>
                            {recentActivity.map((item, i) => (
                                <ActivityItem key={i} {...item} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ─── Quick Access Footer ─── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: "Cloud Database", icon: <FiDatabase />, color: "#7c6af7", desc: "Manage data nodes" },
                    { label: "Security Protocols", icon: <FiShield />, color: "#00acc1", desc: "Access policies" },
                    { label: "Global Registry", icon: <FiGlobe />, color: "#00e676", desc: "Domain management" },
                    { label: "Performance", icon: <FiTrendingUp />, color: "#ffab40", desc: "System metrics" },
                ].map((action, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ y: -3, boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px ${action.color}22` }}
                        whileTap={{ scale: 0.98 }}
                        className="p-5 rounded-2xl flex items-center gap-4 text-left transition-all"
                        style={{
                            background: "#0d1523",
                            border: "1px solid #1a2a40",
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${action.color}15`, border: `1px solid ${action.color}28` }}
                        >
                            {React.cloneElement(action.icon, { size: 17, style: { color: action.color } })}
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-white leading-tight">{action.label}</p>
                            <p className="text-[10px] text-[#557a9a] mt-0.5">{action.desc}</p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>

        </div>
    );
}