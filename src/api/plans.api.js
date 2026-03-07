import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base.api";

// ================= PLANS API =================
export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: getBaseQuery(), // 🔥 Uses centralized auth from base.api.js
  tagTypes: ["Plans"],
  endpoints: (builder) => ({
    // GET ALL PLANS
    getPlans: builder.query({
      query: () => "/subscription",
      providesTags: ["Plans"],
    }),

    // CREATE PLAN
    createPlan: builder.mutation({
      query: (plan) => ({
        url: "/subscription",
        method: "POST",
        body: plan,
      }),
      invalidatesTags: ["Plans"],
    }),

    // ADD DOMAIN TO PLAN
    addDomainToPlan: builder.mutation({
      query: ({ planId, domain }) => ({
        url: `/subscription/${planId}/domain`,
        method: "POST",
        body: { domain },
      }),
      invalidatesTags: ["Plans"],
    }),

    // ASSIGN DOMAIN TO PLAN
    assignDomainToPlan: builder.mutation({
      query: ({ planId, domainId }) => ({
        url: "/subscription/assign-domain",
        method: "POST",
        body: { planId, domainId },
      }),
      invalidatesTags: ["Domain", "Features"],
    }),

    // UPDATE PLAN
    updatePlan: builder.mutation({
      query: ({ planId, ...data }) => ({
        url: `/subscription/${planId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Plans"],
    }),

    // UPDATE MODULE IN PLAN
    updateModuleInPlan: builder.mutation({
      query: ({ planId, module }) => ({
        url: `/subscription/${planId}/modules`,
        method: "PUT",
        body: module,
      }),
      invalidatesTags: ["Plans"],
    }),

    // ADD PLAN TO TENANT
    addPlanToTenant: builder.mutation({
      query: ({ tenantId, planId }) => ({
        url: `/tenant/${tenantId}/assign`,
        method: "POST",
        body: { planId },
      }),
      invalidatesTags: ["Plans"],
    }),

    // SYNC PLAN TO TENANTS
    syncPlanToTenants: builder.mutation({
      query: (planId) => ({
        url: `/subscription/${planId}/sync-to-tenants`,
        method: "POST",
      }),
      invalidatesTags: ["Plans"],
    }),

    // GET ALL DOMAINS IN PLAN
    getPlanDomains: builder.query({
      query: (planId) => `/subscription/all-domains?planId=${planId}`,
      providesTags: ["Plans"],
    }),
  }),
});

// ================= EXPORT HOOKS =================
export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useUpdateModuleInPlanMutation,
  useAddPlanToTenantMutation,
  useSyncPlanToTenantsMutation,
  useAddDomainToPlanMutation,
  useAssignDomainToPlanMutation,
  useGetPlanDomainsQuery,
} = plansApi;

export default plansApi;
