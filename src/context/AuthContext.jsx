import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SUPER_ADMIN_API } from "../api/base.api";

/**
 * Platform session (Super Admin or Platform Staff).
 *
 * The backend returns the same session shape from login and from
 * GET /super-admin/auth/me:
 *   { id, type: "SUPER_ADMIN" | "PLATFORM_STAFF", name, email, role, roleId, power,
 *     permissions: ["*"] | ["VIEW_TENANTS", ...] }
 *
 * `permissions: ["*"]` means "everything" (Super Admin).
 */
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE = SUPER_ADMIN_API; // e.g. /api/v1/super-admin or the Render URL
const API_ROOT = API_BASE.replace(/\/super-admin\/?$/, ""); // e.g. /api/v1

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }, []);

  const storeUser = useCallback((userObj) => {
    setUser(userObj);
    localStorage.setItem("auth_user", JSON.stringify(userObj));
  }, []);

  // Refresh the session (role + permissions) from the server on every app load,
  // so permission changes made by an admin show up without logging in again.
  const refreshSession = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      clearSession();
      return null;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        clearSession();
        return null;
      }
      const data = await res.json();
      if (data?.user) storeUser(data.user);
      return data?.user ?? null;
    } catch {
      // Network error: keep the stored session and try again next load
      return readStoredUser();
    }
  }, [clearSession, storeUser]);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const login = (userObj, token) => {
    localStorage.setItem("auth_token", token);
    storeUser(userObj);
  };

  const logout = async () => {
    clearSession();
    try {
      await fetch(`${API_ROOT}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      /* the local session is already cleared */
    }
  };

  const isSuperAdmin = user?.type === "SUPER_ADMIN";

  /** hasPermission("VIEW_TENANTS") or hasPermission(["A", "B"]) → any of them */
  const hasPermission = useCallback(
    (keys) => {
      if (!keys) return true;
      const perms = user?.permissions || [];
      if (perms.includes("*")) return true;
      const list = Array.isArray(keys) ? keys : [keys];
      return list.some((k) => perms.includes(k));
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshSession, hasPermission, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
