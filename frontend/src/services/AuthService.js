// src/services/authService.js
import { api, requestConfig } from "../utils/config";

export const login = async ({ login, password }) => {

  const config = requestConfig("POST", { login, password });
  console.log(config);
  const response = await fetch(`${api}/login`, config);

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Não foi possível fazer login.");
  }

  const data = await response.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

export const logout = async (token) => {
  try {
    const config = requestConfig("POST", null, token);
    await fetch(`${api}/logout`, config);
  } finally {
    localStorage.removeItem("token");
  }
};