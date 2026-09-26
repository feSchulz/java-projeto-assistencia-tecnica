// src/services/PapelService.js
import { apiBase, requestConfig } from "../utils/config";

export const listarPapeis = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/papeis/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de papéis.");
    }

    return response.json();
};

export const buscarPapelPorId = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/papeis/v1/${id}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar o papel.");
    }

    return response.json();
};

// papelDTO: { codigo, nome }
export const criarPapel = async (papelDTO, token) => {
    const config = requestConfig("POST", papelDTO, token);
    const response = await fetch(`${apiBase}/papeis/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível cadastrar o papel.");
    }

    return response.text();
};

export const atualizarPapel = async (id, papelDTO, token) => {
    const config = requestConfig("PUT", papelDTO, token);
    const response = await fetch(`${apiBase}/papeis/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar o papel.");
    }

    return response.text();
};

export const excluirPapel = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/papeis/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir o papel.");
    }

    return response.text();
};
