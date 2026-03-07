import api from "./api/auth.api";

export const superAdminLogin = async (payload) => {
  const res = await api.post("/platform/auth/login", payload);
  return res.data;
};
