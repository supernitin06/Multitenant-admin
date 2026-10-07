import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ================= BASE API CONFIGURATION =================
// This handles authentication centrally - switch between token and cookie-based auth

const AUTH_MODE = 'TOKEN'; // Changed to TOKEN since API returns token in response

// Base query configuration
// Deployed backend (Render). Locally .env sets /api/v1/super-admin, which the Vite proxy forwards.
export const PRODUCTION_SUPER_ADMIN_API = "https://multitenant-uv76.onrender.com/api/v1/super-admin";
export const SUPER_ADMIN_API = import.meta.env.VITE_SUPER_ADMIN_API || PRODUCTION_SUPER_ADMIN_API;

const getBaseQuery = () => {
  const baseUrl = SUPER_ADMIN_API;

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
