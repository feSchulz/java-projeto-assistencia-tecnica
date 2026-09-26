// src/services/PecaOrdemServicoService.js
import { apiBase, requestConfig } from "../utils/config";

export const listarPecasPorOrdemServico = async (ordemServicoId, token) => {
    if (!ordemServicoId) return [];

    const config = requestConfig("GET", null, token);
    const response = await fetch(
        `${apiBase}/pecas-ordem-servico/v1/ordem-servico/${ordemServicoId}`,
        config,
    );

    if (!response.ok) {
        throw new Error("Não foi possível carregar as peças da ordem de serviço.");
    }

    return response.json();
};

// pecaDTO: { ordemServico: { id }, material: { id }, quantidade, valorUnitario? }
export const associarPeca = async (pecaDTO, token) => {
    const config = requestConfig("POST", pecaDTO, token);
    const response = await fetch(`${apiBase}/pecas-ordem-servico/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível associar a peça à ordem de serviço.");
    }

    return response.text();
};

export const excluirPeca = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/pecas-ordem-servico/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível remover a peça.");
    }

    return response.text();
};
