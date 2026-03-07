import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "../base.api";

export const auditLogsApi = createApi({
  reducerPath: "auditLogsApi",
  baseQuery: getBaseQuery(), // 🔥 Uses centralized auth from base.api.js
  tagTypes: ["AuditLogs"], 
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: () => "/audit-logs/platform",
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
} = auditLogsApi;
