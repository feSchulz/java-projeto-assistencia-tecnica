// src/services/OrdemServicoService.js
import { apiBase, requestConfig } from "../utils/config";

// código <-> rótulo do enum StatusOrdemServico do backend
// (0=ABERTA, 1=EM_ANDAMENTO, 2=CONCLUIDA, 3=CANCELADA, 4=ORCAMENTO,
//  5=AGUARDANDO_APROVACAO, 6=APROVADA). A ordem aqui é a ordem do fluxo.
export const STATUS_OS = [
    { codigo: 0, nome: "ABERTA", label: "Aberta" },
    { codigo: 4, nome: "ORCAMENTO", label: "Em orçamento" },
    { codigo: 5, nome: "AGUARDANDO_APROVACAO", label: "Aguardando aprovação" },
    { codigo: 6, nome: "APROVADA", label: "Aprovada" },
    { codigo: 1, nome: "EM_ANDAMENTO", label: "Em andamento" },
    { codigo: 2, nome: "CONCLUIDA", label: "Concluída" },
    { codigo: 3, nome: "CANCELADA", label: "Cancelada" },
];

// Status em que uma OS pode ser criada (os demais só se alcançam pelo fluxo).
export const STATUS_INICIAIS = ["ABERTA", "ORCAMENTO", "EM_ANDAMENTO"];

// Mesmo fluxo validado pelo backend (StatusOrdemServico.proximosPermitidos).
export const PROXIMOS_STATUS = {
    ABERTA: ["ORCAMENTO", "EM_ANDAMENTO", "CANCELADA"],
    ORCAMENTO: ["AGUARDANDO_APROVACAO", "CANCELADA"],
    AGUARDANDO_APROVACAO: ["APROVADA", "ORCAMENTO", "CANCELADA"],
    APROVADA: ["EM_ANDAMENTO", "CANCELADA"],
    EM_ANDAMENTO: ["CONCLUIDA", "CANCELADA"],
    CONCLUIDA: ["EM_ANDAMENTO"],
    CANCELADA: ["ABERTA"],
};

// Aceita o status como nome ("EM_ANDAMENTO") ou código (1) e devolve o nome.
export const statusNome = (status) => {
    const encontrado = STATUS_OS.find((s) => s.nome === status || s.codigo === status);
    return encontrado ? encontrado.nome : null;
};

export const statusLabel = (status) => {
    const encontrado = STATUS_OS.find(
        (s) => s.nome === status || s.codigo === status,
    );
    return encontrado ? encontrado.label : "—";
};

export const statusFinalizado = (status) => {
    const nome = statusNome(status);
    return nome === "CONCLUIDA" || nome === "CANCELADA";
};

// Cores do "selo" de status, usadas nas listas, no dashboard e nos detalhes.
export const statusPillClasses = (status) => {
    switch (statusNome(status)) {
        case "CONCLUIDA":
            return "bg-green-50 text-green-700";
        case "CANCELADA":
            return "bg-red-50 text-red-700";
        case "EM_ANDAMENTO":
            return "bg-orange-50 text-orange-700";
        case "ORCAMENTO":
        case "AGUARDANDO_APROVACAO":
            return "bg-purple-50 text-purple-700";
        case "APROVADA":
            return "bg-teal-50 text-teal-700";
        default:
            return "bg-blue-50 text-blue-700"; // Aberta
    }
};

// Texto do botão de cada passo do fluxo (depende de onde a OS está e para onde vai).
// pedeValorOrcado / pedeGarantia: o passo abre um mini-formulário antes de confirmar.
export const acaoDoPasso = (de, para) => {
    const deNome = statusNome(de);
    switch (para) {
        case "ORCAMENTO":
            return deNome === "AGUARDANDO_APROVACAO"
                ? { label: "Voltar para orçamento" }
                : { label: "Iniciar orçamento", pedeValorOrcado: true };
        case "AGUARDANDO_APROVACAO":
            return { label: "Enviar para aprovação", pedeValorOrcado: true };
        case "APROVADA":
            return { label: "Orçamento aprovado" };
        case "EM_ANDAMENTO":
            return deNome === "CONCLUIDA"
                ? { label: "Reabrir (retorno)" }
                : { label: "Iniciar atendimento" };
        case "CONCLUIDA":
            return { label: "Concluir", pedeGarantia: true };
        case "CANCELADA":
            return { label: "Cancelar OS", perigo: true };
        case "ABERTA":
            return { label: "Reabrir OS" };
        default:
            return { label: statusLabel(para) };
    }
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

// Lista paginada pelo servidor: { content, page, size, totalElements, totalPages }.
// status: nome do enum (ex.: "CONCLUIDA") ou vazio para todos.
export const buscarOrdensServicoPaginado = async (
    { page = 0, size = 10, q = "", status = "", atrasadas = false },
    token,
) => {
    const params = new URLSearchParams({ page, size, q });
    const codigo = STATUS_OS.find((s) => s.nome === status)?.codigo;
    if (codigo !== undefined) params.set("status", codigo);
    if (atrasadas) params.set("atrasadas", "true");

    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/paginado?${params}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar as ordens de serviço.");
    }

    return response.json();
};

// corpo: { status, observacao?, valorOrcado?, garantiaDias? } -> devolve a OS atualizada
export const alterarStatusOrdemServico = async (id, corpo, token) => {
    const config = requestConfig("PATCH", corpo, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/${id}/status`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível alterar o status da ordem de serviço.");
    }

    return response.json();
};

export const listarHistoricoOrdemServico = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/${id}/historico`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar o histórico da ordem de serviço.");
    }

    return response.json();
};

// corpo: { valorMaoDeObra?, aplicarTotal } -> devolve a OS atualizada
export const atualizarValoresOrdemServico = async (id, corpo, token) => {
    const config = requestConfig("PATCH", corpo, token);
    const response = await fetch(`${apiBase}/ordens-servico/v1/${id}/valores`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível atualizar os valores da ordem de serviço.");
    }

    return response.json();
};

// Garantia ainda em vigor do equipamento (null quando não há).
export const buscarGarantiaEquipamento = async (equipamentoId, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(
        `${apiBase}/ordens-servico/v1/garantia/equipamento/${equipamentoId}`,
        config,
    );

    if (response.status === 204) return null;
    if (!response.ok) {
        throw new Error("Não foi possível verificar a garantia do equipamento.");
    }

    return response.json();
};
