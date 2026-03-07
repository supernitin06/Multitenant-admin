import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const staffApi = createApi({
    reducerPath: "staffApi",
    baseQuery: getBaseQuery(),
    tagTypes: ["Staff"],
    endpoints: (builder) => ({
        getStaff: builder.query({
            query: () => "/platform-staff",
            providesTags: ["Staff"],
        }),
        createStaff: builder.mutation({
            query: (role) => ({
                url: "/platform-staff/register",
                method: "POST",
                body: role,
            }),
            invalidatesTags: ["Staff"],
        }),
        updateStaff: builder.mutation({
            query: ({ id, ...role }) => ({
                url: `/platform-staff/${id}`,
                method: "PATCH",
                body: role,
            }),
            invalidatesTags: ["Staff"],
        }),
        deleteStaff: builder.mutation({
            query: (id) => ({
                url: `/platform-staff/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Staff"],
        }),
        staffLogin: builder.mutation({
            query: (role) => ({
                url: "/platform-staff/login",
                method: "POST",
                body: role,
            }),
            invalidatesTags: ["Staff"],
        }),

    }),
});

export const {
    useGetStaffQuery,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
    useStaffLoginMutation,
} = staffApi;