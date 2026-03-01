// src/services/authService.js
import { api, requestConfig } from "../utils/config"; 

export const login = async ({ identifier, password }) => {
  const config = requestConfig("POST", { identifier, password });

  const response = await fetch(`${api}/login`, config);

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Não foi possível fazer login.");
  }

  const data = await response.json();

  // se vier token, salva no localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
    }
    
    

  return data; // ex: { user, token }
};


export const logout = async (token) => {
  const config = requestConfig("POST", null, token); 
  await fetch(`${api}/logout`, config);
  localStorage.removeItem("token");
  
};

