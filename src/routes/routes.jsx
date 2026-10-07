import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";

// Optimized imports with new folder structure
import { Tenants } from "../pages/Tenants";
import Plans from "../pages/Billing/Plans.jsx";
import Subscription from "../pages/Billing/Subscriptions.jsx";
import Features from "../pages/Platform/Features.jsx"; // Used for Feature and Discounts

// Access Control imports
import Roles from "../pages/AccessControl/Roles.jsx";
import Permissions from "../pages/AccessControl/Permissions.jsx";
import DomainPermissions from "../pages/AccessControl/DomainPermissions.jsx";
import RoleBasedAccess from "../pages/AccessControl/RBAC.jsx";

// Legacy imports (temporarily commented out until APIs are recreated)
// import { AuditLogs, GlobalControl } from "../pages/AuditLogs";

import Users from "../pages/Users/Users";
import ActiveUsers from "../pages/Users/ActiveUsers.jsx";
import InactiveUsers from "../pages/Users/InactiveUsers.jsx";
import CreateUser from "../pages/Users/CreateUsers.jsx";
import NotFound from "../pages/NotFound/NotFound";
import Domains from "../components/Domain/featureDomain.jsx";
import TenantDetailsPage from "../components/Tenants/TenantDetailsPage";
import Staff from "../pages/staff/Staff.jsx";
import Settings from "../pages/sidebar-Footer/setting.jsx";
import Sidebar from "../pages/sidebar/sidebar.jsx";
import AssignSidebar from "../pages/sidebar/AssignSidebar.jsx";
import AuditLogs from "../pages/AuditLogs/AuditLogs.jsx";
import TenantPermissions from "../pages/AccessControl/TenantPermissions.jsx";


/**
 * `public: true`  → reachable without logging in.
 * `permission`    → platform permission needed to open the page
 *                   (Super Admin always passes). Keep in sync with Data/Sidebar.json.
 */
const routes = [
  { path: "/", element: <Login />, public: true },
  { path: "/dashboard", element: <Dashboard /> },

  // Tenants
  { path: "/tenants", element: <Tenants />, permission: "VIEW_TENANTS" },
  { path: "/tenants/:id/details", element: <TenantDetailsPage />, permission: "VIEW_TENANTS" },

  // Plans & subscription
  { path: "/plans", element: <Plans />, permission: "VIEW_SUBSCRIPTIONS" },
  { path: "/plans/subscriptions", element: <Subscription />, permission: "VIEW_SUBSCRIPTIONS" },
  { path: "/plans/domains", element: <Domains />, permission: "VIEW_FEATURE_DOMAINS" },
  { path: "/plans/features", element: <Features />, permission: "VIEW_FEATURES" },
  { path: "/plans/discounts", element: <Features />, permission: "VIEW_FEATURES" },

  // Access control
  { path: "/roles-permissions/roles", element: <Roles />, permission: "VIEW_PLATFORM_ROLES" },
  { path: "/roles-permissions/permissions", element: <Permissions />, permission: "VIEW_PERMISSIONS" },
  { path: "/roles-permissions/domain-permission", element: <DomainPermissions />, permission: "VIEW_PERMISSION_DOMAINS" },
  { path: "/roles-permissions/tenant-permissions", element: <TenantPermissions />, permission: "VIEW_TENANT_PERMISSION_CATALOG" },
  { path: "/role-based-access/roles", element: <RoleBasedAccess />, permission: "VIEW_PLATFORM_ROLES" },

  // Staff & navigation
  { path: "/staff-management/staff", element: <Staff />, permission: "VIEW_STAFF" },
  { path: "/sidebar", element: <Sidebar />, permission: "VIEW_PLATFORM_SIDEBARS" },
  { path: "/sidebar/assign", element: <AssignSidebar />, permission: "ASSIGN_PLATFORM_SIDEBAR" },

  // Monitoring
  { path: "/audit-logs", element: <AuditLogs />, permission: "VIEW_AUDIT_LOGS" },

  // Demo pages (static sample data, not connected to the backend yet)
  { path: "/users", element: <Users /> },
  { path: "/users/active-users", element: <ActiveUsers /> },
  { path: "/users/inactive-users", element: <InactiveUsers /> },
  { path: "/users/create-users", element: <CreateUser /> },

  { path: "/settings", element: <Settings /> },

  // 404
  { path: "*", element: <NotFound />, public: true },
];

export default routes;
