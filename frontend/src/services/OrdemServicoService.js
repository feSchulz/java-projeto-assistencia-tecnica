// src/services/OrdemServicoService.js
import { apiBase, requestConfig } from "../utils/config";

// código <-> rótulo do enum StatusOrdemServico do backend (0=ABERTA, 1=EM_ANDAMENTO, 2=CONCLUIDA, 3=CANCELADA)
export const STATUS_OS = [
    { codigo: 0, nome: "ABERTA", label: "Aberta" },
    { codigo: 1, nome: "EM_ANDAMENTO", label: "Em andamento" },
    { codigo: 2, nome: "CONCLUIDA", label: "Concluída" },
    { codigo: 3, nome: "CANCELADA", label: "Cancelada" },
];

export const statusLabel = (status) => {
    const encontrado = STATUS_OS.find(
        (s) => s.nome === status || s.codigo === status,
    );
    return encontrado ? encontrado.label : "—";
};

export const listarOrdensServico = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar as ordens de serviço.");
    }

    return response.json();
};

export const listarOrdensServicoPorCliente = async (clienteId, token) => {
    if (!clienteId) return [];

    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/cliente/${clienteId}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar as ordens de serviço do cliente.");
    }

    return response.json();
};

export const listarOrdensServicoPorStatus = async (statusCodigo, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/status/${statusCodigo}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível filtrar as ordens de serviço por status.");
    }

    return response.json();
};

export const buscarOrdemServicoPorId = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/${id}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a ordem de serviço.");
    }

    return response.json();
};

// osDTO: { descricaoCliente, descricaoTecnico, dataAbertura, prazoConclusao, dataConclusao,
//          valor, status, equipamento: { id }, cliente: { id }, funcionarioResponsavel: { id } }
export const criarOrdemServico = async (osDTO, token) => {
    const config = requestConfig("POST", osDTO, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível cadastrar a ordem de serviço.");
    }

    return response.text();
};

export const atualizarOrdemServico = async (id, osDTO, token) => {
    const config = requestConfig("PUT", osDTO, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar a ordem de serviço.");
    }

    return response.text();
};

export const excluirOrdemServico = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir a ordem de serviço.");
    }

    return response.text();
};
