// src/services/FuncionarioService.js
import { apiBase, requestConfig } from "../utils/config";

export const listarFuncionarios = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/funcionarios/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de funcionários.");
    }

    return response.json();
};

export const buscarFuncionarioPorId = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/funcionarios/v1/${id}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar o funcionário.");
    }

    return response.json();
};

// funcionarioDTO: { login, senha, papel: { id }, usuario: { nome, cpf, telefone, email, endereco: {...} } }
export const criarFuncionario = async (funcionarioDTO, token) => {
    const config = requestConfig("POST", funcionarioDTO, token);
    const response = await fetch(`${apiBase}/funcionarios/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível cadastrar o funcionário.");
    }

    return response.text();
};

export const atualizarFuncionario = async (id, funcionarioDTO, token) => {
    const config = requestConfig("PUT", funcionarioDTO, token);
    const response = await fetch(`${apiBase}/funcionarios/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar o funcionário.");
    }

    return response.text();
};

export const excluirFuncionario = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/funcionarios/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir o funcionário.");
    }

    return response.text();
};
