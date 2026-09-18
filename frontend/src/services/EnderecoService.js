// src/services/EnderecoService.js
import { apiBase, requestConfig } from "../utils/config";

export const listarEstados = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/endereco/v1/estado`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de estados.");
    }

    return response.json();
};

export const listarCidades = async (idEstado, token) => {
    if (!idEstado) return [];

    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/endereco/v1/cidade/${idEstado}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de cidades.");
    }

    return response.json();
};