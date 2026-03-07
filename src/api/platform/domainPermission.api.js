import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const domainPermissionApi = createApi({
    reducerPath: "domainPermissionApi",
    baseQuery: getBaseQuery(),
    tagTypes: ["DomainPermissions"],
    endpoints: (builder) => ({
        getDomainPermissions: builder.query({
            query: () => "/permissions/domains",
            providesTags: ["DomainPermissions"],
        }),
        createDomainPermission: builder.mutation({
            query: (role) => ({
                url: "/permissions/domains",
                method: "POST",
                body: role,
            }),
            invalidatesTags: ["DomainPermissions"],
        }),
        updateDomainPermission: builder.mutation({
            query: ({ id, ...role }) => ({
                url: `/permissions/domains/${id}`,
                method: "PUT",
                body: role,
            }),
            invalidatesTags: ["DomainPermissions"],
        }),
        deleteDomainPermission: builder.mutation({
            query: (id) => ({
                url: `/permissions/domains/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DomainPermissions"],
        }),


        assignDomainPermission: builder.mutation({
            query: ({ domainId, permissionIds }) => ({
                url: `/permissions/assign-domain`,
                method: "POST",
                body: { domainId, permissionIds: permissionIds },
            }),
            invalidatesTags: ["DomainPermissions"],
        }),

    }),
});

export const {
    useGetDomainPermissionsQuery,
    useCreateDomainPermissionMutation,
    useUpdateDomainPermissionMutation,
    useDeleteDomainPermissionMutation,
    useAssignDomainPermissionMutation,
} = domainPermissionApi;