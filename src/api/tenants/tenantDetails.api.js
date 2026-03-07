
import { createApi } from "@reduxjs/toolkit/query/react";

// s:\S_Admin\src\api\tenants\tenantDetails.api.js
export const tenantDetailsApi = createApi({
  endpoints: (builder) => ({
    getTenantDetails: builder.query({
      query: (tenantId) => `/tenants/${tenantId}/details`,
    }),
  }),
});

export const { useGetTenantDetailsQuery } = tenantDetailsApi;