// In your chosen API file (e.g., dashboard.api.js)
import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const domainApi = createApi({
  reducerPath: "domainApi",
  baseQuery: getBaseQuery(),
  tagTypes: ["Domain", "Features"], // Updated tags
  endpoints: (builder) => ({
    
    // Existing endpoints...

    // Domain endpoints
    getDomains: builder.query({
      query: () => "/features/domain",
      providesTags: ["Domain"],
    }),
    createDomain: builder.mutation({
      query: (data) => ({
        url: "/features/domain",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Domain"],
    }),

    // Feature assignment endpoints
    getDomainFeatures: builder.query({
      query: (domainId) => `/features/domain/${domainId}/features`,
      providesTags: ["Features"],
    }),
    assignFeatureToDomain: builder.mutation({
      query: ({ featureId, domainId }) => ({
        url: '/features/domain/assignfeature',
        method: "POST",
        body: { featureId, domainId },
      }),
      invalidatesTags: ["Domain", "Features"],
    }),
    removeFeatureFromDomain: builder.mutation({
      query: ({ featureId, domainId }) => ({
        url: `/features/domain/${domainId}/features/${featureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Domain", "Features"],
    }),

    // assignDomainToPlan: builder.mutation({
    //   query: ({ planId, domainId }) => ({
    //     url: "/subscription/assign-domain",
    //     method: "POST",
    //     body: { planId, domainId },
    //   }),
    //   invalidatesTags: ["Domain", "Features"],
    // }),
    
    // Remove unused endpoints
    // getNewFeature: builder.query({
    //   query: (params) => `/new-endpoint${params ? `?${new URLSearchParams(params)}` : ''}`,
    //   providesTags: ["NewFeature"],
    // }),
    
    // createNewFeature: builder.mutation({
    //   query: (data) => ({
    //     url: "/new-endpoint",
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["NewFeature"],
    // }),
  }),
});

// Export the hooks
export const {
  useGetDomainsQuery,
  useCreateDomainMutation,
  useGetDomainFeaturesQuery,
  useAssignFeatureToDomainMutation,
  useRemoveFeatureFromDomainMutation,
 // useAssignDomainToPlanMutation,
} = domainApi;