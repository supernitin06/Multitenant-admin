import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./base.api";

// Import from new structure
import { authApi } from "./platform/auth.api";
import { dashboardApi } from "./dashboard.api";
import { plansApi } from "./plans.api";
import { tenantApi } from "./tenants/tenant.api";
import { domainApi } from "./Common/domain.api";
import { featureApi } from "./platform/feature.api";
import { tenantDetailsApi } from "./tenants/tenantDetails.api";
import { roleApi } from "./platform/role.api";
import { domainPermissionApi } from "./platform/domainPermission.api";
import { permissionApi } from "./platform/permission.api";
import { staffApi } from "./platform/staff.api"
import { sidebarApi } from "./platform/sidebar.api"

// Legacy APIs - need to be recreated or moved to new structure
// import { modulesApi } from "./modules.api";
// import { auditLogsApi } from "./auditLogs.api";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [tenantApi.reducerPath]: tenantApi.reducer,
    [domainApi.reducerPath]: domainApi.reducer,
    [featureApi.reducerPath]: featureApi.reducer,
    [tenantDetailsApi.reducerPath]: tenantDetailsApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [domainPermissionApi.reducerPath]: domainPermissionApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [sidebarApi.reducerPath]: sidebarApi.reducer,
    // [modulesApi.reducerPath]: modulesApi.reducer,
    // [auditLogsApi.reducerPath]: auditLogsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      authApi.middleware,
      dashboardApi.middleware,
      plansApi.middleware,
      tenantApi.middleware,
      domainApi.middleware,
      featureApi.middleware,
      tenantDetailsApi.middleware,
      roleApi.middleware,
      domainPermissionApi.middleware,
      permissionApi.middleware,
      staffApi.middleware,
      sidebarApi.middleware,
      // modulesApi.middleware,
      // auditLogsApi.middleware,
    ),
});

export default store;
