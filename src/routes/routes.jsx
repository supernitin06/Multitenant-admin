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







const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  // Dashboard Section
  {
    path: "/tenants",
    element: <Tenants />,
  },

  // Plans & Subscription Section
  {
    path: "/plans",
    element: <Plans />,
  },

  {
    path: "/plans/features",
    element: <Features />,
  },
  {
    path: "/plans/subscriptions",
    element: <Subscription />,
  },
  {
    path: "/plans/domains",
    element: <Domains />,
  },
  {
    path: "/staff-management/staff",
    element: <Staff />,
  },


  {
    path: "/plans/discounts",
    element: <Features />,
  },
  {
    path: "roles-permissions/roles",
    element: <Roles />,
  },
  {
    path: "roles-permissions/permissions",
    element: <Permissions />,
  },
  {
    path: "roles-permissions/domain-permission",
    element: <DomainPermissions />,
  },
  {
    path: "role-based-access/roles",
    element: <RoleBasedAccess />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/active-users",
    element: <ActiveUsers />,
  },
  {
    path: "/users/inactive-users",
    element: <InactiveUsers />,
  },
  {
    path: "/users/create-users",
    element: <CreateUser />,
  },
  {
    path: "/tenants/:id/details",
    element: <TenantDetailsPage />,
  },
  {
    path: "/sidebar",
    element: <Sidebar />,
  },
  {
    path: "/sidebar/assign",
    element: <AssignSidebar />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },

];


export default routes;
