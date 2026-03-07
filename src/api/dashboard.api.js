import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base.api";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: getBaseQuery(),
  tagTypes: ["DashboardTenants"],
  endpoints: (builder) => ({
    
    // 1. Get Tenants
    getTenants: builder.query({
      query: () => "/tenants",
      providesTags: ["DashboardTenants"],
    }),

    // 2. Toggle Tenant Status
    toggleTenantStatus: builder.mutation({
      query: ({ tenantId, isActive }) => ({
        url: `/${tenantId}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      // refresh list after status change
      invalidatesTags: ["DashboardTenants"],
    }),

    // 3. Get Platform Stats
    getPlatformStats: builder.query({
      query: () => "/summary",
    }),
  }),
});


export const {
  useGetTenantsQuery,
  useToggleTenantStatusMutation,
  useGetPlatformStatsQuery,
} = dashboardApi;