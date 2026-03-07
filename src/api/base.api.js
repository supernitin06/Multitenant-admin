import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ================= BASE API CONFIGURATION =================
// This handles authentication centrally - switch between token and cookie-based auth

const AUTH_MODE = 'TOKEN'; // Changed to TOKEN since API returns token in response

// Base query configuration
const getBaseQuery = () => {
  const baseUrl = import.meta.env.VITE_SUPER_ADMIN_API;

  if (AUTH_MODE === 'COOKIES') {
    // Cookie-based authentication (recommended)
    return fetchBaseQuery({
      baseUrl,
      credentials: "include", // 🔥 THIS sends cookies automatically
    });
  } else {
    // Token-based authentication (fallback)
    return fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
    });
  }
};

// ================= BASE API =================
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: getBaseQuery(),
  tagTypes: [], // Common tags can be added here
  endpoints: () => ({}), // No endpoints in base API
});

// Export the base query for other APIs to use
export { getBaseQuery };
