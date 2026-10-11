// src/services/BuscaService.js
import { apiBase, requestConfig } from "../utils/config";

// Busca global do cabeçalho: { ordens: [], clientes: [], equipamentos: [] }
// (cada item: { id, titulo, subtitulo, status? }).
export const buscarGlobal = async (q, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/busca/v1?q=${encodeURIComponent(q)}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível realizar a busca.");
    }

    return response.json();
};
