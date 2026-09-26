// src/services/MarcaService.js
import { apiBase, requestConfig } from "../utils/config";

export const listarMarcas = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/marcas/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de marcas.");
    }

    return response.json();
};

export const buscarMarcaPorId = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/marcas/v1/${id}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a marca.");
    }

    return response.json();
};

// marcaDTO: { nome, modelos: [{ nome }] }
export const criarMarca = async (marcaDTO, token) => {
    const config = requestConfig("POST", marcaDTO, token);
    const response = await fetch(`${apiBase}/marcas/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível cadastrar a marca.");
    }

    return response.text();
};

// marcaDTO precisa incluir id e a lista completa de modelos (os já existentes +
// os novos), já que o backend substitui a coleção inteira ao salvar.
export const atualizarMarca = async (marcaDTO, token) => {
    const config = requestConfig("PUT", marcaDTO, token);
    const response = await fetch(`${apiBase}/marcas/v1/${marcaDTO.id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar a marca.");
    }

    return response.text();
};

export const excluirMarca = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/marcas/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir a marca.");
    }

    return response.text();
};

export const listarModelos = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/modelos/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de modelos.");
    }

    return response.json();
};

export const atualizarModelo = async (id, modeloDTO, token) => {
    const config = requestConfig("PUT", modeloDTO, token);
    const response = await fetch(`${apiBase}/modelos/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar o modelo.");
    }

    return response.text();
};

export const excluirModelo = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/modelos/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir o modelo.");
    }

    return response.text();
};
