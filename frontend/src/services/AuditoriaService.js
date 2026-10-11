// src/services/AuditoriaService.js
import { apiBase, requestConfig } from "../utils/config";

// Log de auditoria (só administrador): { content, page, size, totalElements, totalPages }
export const listarAuditoria = async ({ page = 0, size = 20, q = "", entidade = "" }, token) => {
    const params = new URLSearchParams({ page, size, q, entidade });
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/auditoria/v1?${params}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar o log de auditoria.");
    }

    return response.json();
};

export const listarEntidadesAuditoria = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/auditoria/v1/entidades`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar os recursos auditados.");
    }

    return response.json();
};
