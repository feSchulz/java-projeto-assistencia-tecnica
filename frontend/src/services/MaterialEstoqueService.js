// src/services/MaterialEstoqueService.js
import { apiBase, requestConfig } from "../utils/config";

export const listarMateriais = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/materiais/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de materiais.");
    }

    return response.json();
};

export const buscarMaterialPorId = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/materiais/v1/${id}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar o material.");
    }

    return response.json();
};

// materialDTO: { nome, codigo, descricao, marca: { id }, modelo: { id }, quantidadeEstoque, valorUnitario, status }
export const criarMaterial = async (materialDTO, token) => {
    const config = requestConfig("POST", materialDTO, token);
    const response = await fetch(`${apiBase}/materiais/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível cadastrar o material.");
    }

    return response.text();
};

export const atualizarMaterial = async (materialDTO, token) => {
    const config = requestConfig("PUT", materialDTO, token);
    const response = await fetch(`${apiBase}/materiais/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar o material.");
    }

    return response.text();
};

export const excluirMaterial = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/materiais/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir o material.");
    }

    return response.text();
};
