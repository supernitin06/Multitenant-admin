import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

/**
 * Blocks pages for visitors who are not logged in, and shows a clear
 * "no access" message when the user's role lacks the page's permission.
 */
const ProtectedRoute = ({ permission, children }) => {
  const { user, loading, hasPermission } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: "#1a2a40", borderTopColor: "#00e676" }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (!hasPermission(permission)) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,82,82,0.1)", color: "#ff5252" }}>
          <FiLock size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">You don't have access to this page</h2>
        <p className="text-sm text-[#557a9a] max-w-md">
          Your role ({user.role || "no role"}) needs the <code className="text-[#00e676]">{permission}</code> permission.
          Ask a Super Admin to grant it under Role Based Access.
        </p>
        <button onClick={() => navigate("/dashboard")} className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-[#00e676]">
          Back to dashboard
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
