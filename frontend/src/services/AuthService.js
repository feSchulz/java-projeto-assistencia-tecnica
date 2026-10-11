// src/services/authService.js
import { api, apiBase, requestConfig } from "../utils/config";

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

// Dados do funcionário autenticado (tela "Meu perfil"), resolvidos no
// backend a partir do login gravado no token — não é uma listagem, então
// uma falha aqui é mesmo um erro a ser exibido para o usuário.
export const buscarMeuPerfil = async (token) => {
  const config = requestConfig("GET", null, token);
  const response = await fetch(`${apiBase}/auth/v1/me`, config);

  if (!response.ok) {
    throw new Error(
      `Não foi possível carregar os dados do perfil (HTTP ${response.status}).`
    );
  }

  return response.json();
};

// perfil (plano): { nome, cpf, telefone, email, rua, numero, bairro, complemento,
//                   cep, cidadeId, senha? }
// login e papel são ignorados pelo backend nessa rota, mesmo se enviados.
export const atualizarMeuPerfil = async (perfil, token) => {
  const config = requestConfig("PUT", perfil, token);
  const response = await fetch(`${apiBase}/auth/v1/me`, config);

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(errText || "Não foi possível atualizar o perfil.");
  }

  return response.text();
};