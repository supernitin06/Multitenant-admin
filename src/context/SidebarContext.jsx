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

    const { user, loading: authLoading, hasPermission, isSuperAdmin } = useAuth();

    /*
     * Who sees what:
     *  - Super Admin: every section in Data/Sidebar.json.
     *  - Platform staff: only the sections assigned to their role
     *    (Sidebar Management → Assign to Roles), and inside those only the
     *    links their role has the permission for.
     */
    const roleId = user?.roleId;

    const {
        data: roleSidebarData,
        isLoading: isRoleSidebarLoading,
    } = useGetSidebarbyRoleQuery(
        { roleId },
        { skip: !user || !roleId || isSuperAdmin }
    );

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setSidebarConfig([]);
            return;
        }

        let sections = sidebarData;

        if (!isSuperAdmin) {
            const assigned = (roleSidebarData?.sidebars || []).map((sb) => sb.name?.trim().toLowerCase());
            sections = sidebarData.filter((item) => assigned.includes(item.label.toLowerCase()));
        }

        const finalConfig = sections
            .map((item) => {
                const children = item.children?.filter((child) => hasPermission(child.permission));
                return { ...item, icon: ICON_MAP[item.icon] || LayoutGrid, children };
            })
            .filter((item) =>
                item.children ? item.children.length > 0 : hasPermission(item.permission)
            );

        setSidebarConfig(finalConfig);
    }, [user, roleSidebarData, authLoading, isSuperAdmin, hasPermission]);

    const loading = authLoading || (!!roleId && !isSuperAdmin && isRoleSidebarLoading);

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
