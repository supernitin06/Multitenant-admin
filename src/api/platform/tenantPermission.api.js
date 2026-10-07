import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

/**
 * Tenant permission CATALOG — the permissions every tenant can give to its own roles.
 * Backend: /api/v1/super-admin/tenant-permissions
 */
export const tenantPermissionApi = createApi({
    reducerPath: "tenantPermissionApi",
    baseQuery: getBaseQuery(),
    tagTypes: ["TenantPermissions"],
    endpoints: (builder) => ({
        getTenantPermissionGroups: builder.query({
            query: () => "/tenant-permissions",
            providesTags: ["TenantPermissions"],
        }),
        createTenantPermission: builder.mutation({
            query: (body) => ({ url: "/tenant-permissions", method: "POST", body }),
            invalidatesTags: ["TenantPermissions"],
        }),
        updateTenantPermission: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/tenant-permissions/${id}`, method: "PUT", body }),
            invalidatesTags: ["TenantPermissions"],
        }),
        deleteTenantPermission: builder.mutation({
            query: (id) => ({ url: `/tenant-permissions/${id}`, method: "DELETE" }),
            invalidatesTags: ["TenantPermissions"],
        }),
    }),
});

export const {
    useGetTenantPermissionGroupsQuery,
    useCreateTenantPermissionMutation,
    useUpdateTenantPermissionMutation,
    useDeleteTenantPermissionMutation,
} = tenantPermissionApi;
