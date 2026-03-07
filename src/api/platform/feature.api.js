import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const featureApi = createApi({
  reducerPath: "featureApi",
  baseQuery: getBaseQuery(),
  tagTypes: ["Features"],
  endpoints: (builder) => ({
    getFeatures: builder.query({
      query: () => "/features", // Adjust based on your actual endpoint
      providesTags: ["Features"],
    }),
    createFeature: builder.mutation({
      query: (newFeature) => ({
        url: "/features",
        method: "POST",
        body: newFeature,
      }),
      invalidatesTags: ["Features"],
    }),
    getDomains: builder.query({
      query: () => "/domains",
      providesTags: ["Domains"],
    }),
    assignFeatureToDomain: builder.mutation({
      query: ({ featureId, domainId }) => ({
        url: '/features/domain/assignfeature',
        method: "POST",
        body: { featureId, domainId },
      }),
      invalidatesTags: ["Features"],
    }),
    getDomainFeatures: builder.query({
      query: (domainId) => `/features/domain/${domainId}`,
      providesTags: ["Features"],
    }),
  }),
});

export const { useGetFeaturesQuery, useCreateFeatureMutation, useGetDomainsQuery, useAssignFeatureToDomainMutation, useGetDomainFeaturesQuery } = featureApi;