import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const tenantApi = createApi({
    reducerPath: "tenantApi",
    baseQuery: getBaseQuery(),
    tagTypes: ["Tenants"],
    endpoints: (builder) => ({
        getTenants: builder.query({
            query: () => "/tenants",
            providesTags: ["Tenants"],
        }),

        createTenant: builder.mutation({
            query: (data) => ({
                url: "/tenants",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tenants"],
        }),

        updateTenant: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/tenants/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Tenants"],
        }),

        deleteTenant: builder.mutation({
            query: (id) => ({
                url: `/tenants/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tenants"],
        }),

        asignPlan: builder.mutation({
            query: ({ tenantId, planId }) => ({
                url: `/subscription/assign/${tenantId}`,
                method: "POST",
                body: { planId },
            }),
            invalidatesTags: ["Tenants"],
        }),
    }),
});

export const {
    useGetTenantsQuery,
    useCreateTenantMutation,
    useUpdateTenantMutation,
    useDeleteTenantMutation,
    useAsignPlanMutation,
} = tenantApi;
