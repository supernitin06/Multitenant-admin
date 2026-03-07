import React from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const { user } = useAuth();

  const hideSidebarRoutes = ["/", "/login"];
  const isHiddenRoute = hideSidebarRoutes.includes(location.pathname) || location.pathname === "";

  const showSidebar = user && !isHiddenRoute;

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#080d14" }}
    >
      {showSidebar && <Sidebar />}

      <main
        className="flex-1 transition-all duration-300 min-h-screen pt-6 pb-10 px-6 sm:px-8 lg:px-10"
        style={{
          marginLeft: showSidebar ? (isCollapsed ? 64 : 256) : 0,
          background: "transparent",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
