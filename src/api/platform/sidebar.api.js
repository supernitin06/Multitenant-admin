import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const sidebarApi = createApi({
    reducerPath: "sidebarApi",
    baseQuery: getBaseQuery(),
    tagTypes: ["Sidebar"],
    endpoints: (builder) => ({
        
        getSidebar: builder.query({
            query: () => "/platform-sidebar",
            providesTags: ["Sidebar"],
        }),
        assignSidebarToRole: builder.mutation({
            query: ({ roleId, sidebarId }) => ({
                url: "/platform-sidebar/assign",
                method: "POST",
                body: { roleId, sidebarId },
            }),
            invalidatesTags: ["Sidebar", "Roles"],
        }),
        removeSidebarFromRole: builder.mutation({
            query: ({ roleId, sidebarId }) => ({
                url: "/platform-sidebar/assign",
                method: "DELETE",
                body: { roleId, sidebarId },
            }),
            invalidatesTags: ["Sidebar", "Roles"],
        }),

        getSidebarbyRole: builder.query({
            query: ({ roleId }) => ({
                url: `/platform-sidebar/${roleId}`,
                method: "GET",
            }),
            invalidatesTags: ["Sidebar", "Roles"],
        }),

    }),
});

export const {
    useGetSidebarQuery,
    useAssignSidebarToRoleMutation,
    useRemoveSidebarFromRoleMutation,
    useGetSidebarbyRoleQuery
} = sidebarApi;