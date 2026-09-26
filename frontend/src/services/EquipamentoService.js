// src/services/EquipamentoService.js
import { apiBase, requestConfig } from "../utils/config";

export const listarEquipamentos = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/equipamento/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de equipamentos.");
    }

    return response.json();
};

export const listarEquipamentosPorCliente = async (clienteId, token) => {
    if (!clienteId) return [];

    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/equipamento/v1/cliente/${clienteId}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar os equipamentos do cliente.");
    }

    return response.json();
};

export const buscarEquipamentoPorId = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/equipamento/v1/buscar/${id}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar o equipamento.");
    }

    return response.json();
};

// equipamentoDTO: { equipamento, marca: { id }, modelo: { id }, cliente: { id } }
export const criarEquipamento = async (equipamentoDTO, token) => {
    const config = requestConfig("POST", equipamentoDTO, token);
    const response = await fetch(`${apiBase}/equipamento/v1/inserir`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível cadastrar o equipamento.");
    }

    return response.text();
};

export const atualizarEquipamento = async (equipamentoDTO, token) => {
    const config = requestConfig("PUT", equipamentoDTO, token);
    const response = await fetch(`${apiBase}/equipamento/v1/atualizar`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar o equipamento.");
    }

    return response.text();
};

export const excluirEquipamento = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/equipamento/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir o equipamento.");
    }

    return response.text();
};
