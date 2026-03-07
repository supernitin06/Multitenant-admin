import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const roleApi = createApi({
    reducerPath: "roleApi",
    baseQuery: getBaseQuery(),
    tagTypes: ["Roles"],
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: () => "/platform-roles",
            providesTags: ["Roles"],
        }),
        createRole: builder.mutation({
            query: (role) => ({
                url: "/platform-roles",
                method: "POST",
                body: role,
            }),
            invalidatesTags: ["Roles"],
        }),
        updateRole: builder.mutation({
            query: ({ id, ...role }) => ({
                url: `/platform-roles/${id}`,
                method: "PATCH",
                body: role,
            }),
            invalidatesTags: ["Roles"],
        }),
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/platform-roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Roles"],
        }),
        assignPlatformPermissionToRole: builder.mutation({
            query: ({ roleId, ...permissions }) => ({
                url: `/permissions/assign`,
                method: "POST",
                body: permissions,
            }),
            invalidatesTags: ["Roles"],
        }),
        assignRolePermission: builder.mutation({
            query: ({ permissionId, roleId }) => ({
                url: `/permissions/assign`,
                method: "POST",
                body: { permissionId, roleId },
            }),
            invalidatesTags: ["Roles"],
        }),
        DeleteRolePermission: builder.mutation({
            query: ({ permissionId, roleId }) => ({
                url: `/permissions/assign`,
                method: "DELETE",
                body: { permissionId, roleId },
            }),
            invalidatesTags: ["Roles"],
        }),
    }),
});

export const {
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPlatformPermissionToRoleMutation,
    useAssignRolePermissionMutation,
    useDeleteRolePermissionMutation
} = roleApi;