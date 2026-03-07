import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const permissionApi = createApi({
    reducerPath: "permissionApi",
    baseQuery: getBaseQuery(),
    tagTypes: ["Permissions"],
    endpoints: (builder) => ({

        getPermissions: builder.query({
            query: () => "/platform-permissions",
            method: "GET",
            providesTags: ["Permissions"],
        }),
        createPermissions: builder.mutation({
            query: (body) => ({
                url: "/platform-permissions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Permissions"],
        }),
        updatePermissions: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/platform-permissions/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Permissions"],
        }),
        deletePermissions: builder.mutation({
            query: (id) => ({
                url: `/platform-permissions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Permissions"],
        }),





    }),
});

export const { useGetPermissionsQuery, useCreatePermissionsMutation, useUpdatePermissionsMutation, useDeletePermissionsMutation } = permissionApi;