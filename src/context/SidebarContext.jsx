import {
    Home,
    Users,
    CreditCard,
    ShieldCheck,
    LayoutGrid,
} from "lucide-react";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from "react";
import { useAuth } from "./AuthContext";
import sidebarData from "../Data/Sidebar.json";
import { useGetSidebarbyRoleQuery } from "../api/platform/sidebar.api";

const ICON_MAP = {
    Home,
    Users,
    CreditCard,
    ShieldCheck,
    LayoutGrid
};

const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
    const getInitialState = () => (window.innerWidth < 1024 ? true : false);

    const [isCollapsed, setIsCollapsed] = useState(getInitialState());
    const [sidebarConfig, setSidebarConfig] = useState([]);
    const [expandedItems, setExpandedItems] = useState(new Set());

    const { user, loading: authLoading } = useAuth();

    // Identify roleId for non-superadmin users
    const roleId = user?.role?._id || user?.role?.id || user?.roleId;
    const isSuperAdmin = typeof user?.role === "string" || user?.isSuperAdmin;

    const {
        data: roleSidebarData,
        isLoading: isRoleSidebarLoading,
    } = useGetSidebarbyRoleQuery(
        { roleId },
        { skip: !roleId || isSuperAdmin }
    );

    /* ---------------- Optimized Sidebar Config ---------------- */
    useEffect(() => {
        if (authLoading) return;

        let finalConfig = [];

        if (isSuperAdmin) {
            // Superadmin uses local Sidebar.json
            finalConfig = sidebarData
                .filter(item => !item.adminOnly || isSuperAdmin)
                .map(item => ({
                    ...item,
                    icon: ICON_MAP[item.icon]
                }));
        } else if (roleSidebarData) {
            // Other roles use data from API
            const sidebarsFromApi = roleSidebarData.sidebars ||
                (Array.isArray(roleSidebarData) ? roleSidebarData : (roleSidebarData?.data || []));

            finalConfig = sidebarsFromApi.map(sb => {
                // Find matching template in local Sidebar.json to get children and correct paths
                const template = sidebarData.find(t =>
                    t.label?.toLowerCase() === sb.name?.toLowerCase() ||
                    t.id?.toLowerCase() === sb.name?.toLowerCase().replace(/\s+/g, '-')
                );

                if (template) {
                    return {
                        ...template,
                        icon: ICON_MAP[template.icon] || LayoutGrid
                    };
                }

                // Fallback if no template found
                return {
                    id: sb.id || sb._id,
                    label: sb.name,
                    icon: ICON_MAP[sb.icon] || LayoutGrid,
                    path: sb.path || `/dashboard/${sb.name?.toLowerCase().replace(/\s+/g, '-')}`,
                    children: sb.children?.map(child => ({
                        id: child.id || child._id,
                        label: child.name || child.label,
                        path: child.path
                    }))
                };
            });
        }

        setSidebarConfig(finalConfig);
    }, [user, roleSidebarData, authLoading, isSuperAdmin]);

    const loading = authLoading || (roleId && !isSuperAdmin && isRoleSidebarLoading);

    const toggleSidebar = useCallback(() => setIsCollapsed((s) => !s), []);
    const closeSidebar = useCallback(() => setIsCollapsed(true), []);

    const toggleExpand = useCallback((id) => {
        setExpandedItems((prev) => {
            if (prev.has(id)) return new Set();
            return new Set([id]);
        });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isCollapsed) setIsCollapsed(false);
            if (window.innerWidth < 1024 && !isCollapsed) setIsCollapsed(true);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isCollapsed]);

    return (
        <SidebarContext.Provider
            value={{ isCollapsed, toggleSidebar, closeSidebar, sidebarConfig, loading, expandedItems, toggleExpand }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export default SidebarContext;
