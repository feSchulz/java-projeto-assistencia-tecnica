// src/services/ClienteService.js
import { apiBase, requestConfig } from "../utils/config";

export const criarCliente = async (clienteDTO, token) => {
    const config = requestConfig("POST", clienteDTO, token);
    const response = await fetch(`${apiBase}/clientes/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível cadastrar o cliente.");
    }

    // o backend responde com texto simples ("Cliente cadastrado com sucesso"),
    // não com JSON — então lemos como texto mesmo.
    return response.text();
};

export const listarClientes = async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/clientes/v1`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar a lista de clientes.");
    }

    return response.json();
};

export const buscarClientePorId = async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(`${apiBase}/clientes/v1/${id}`, config);

    if (!response.ok) {
        throw new Error("Não foi possível carregar o cliente.");
    }

    return response.json();
};

export const buscarClientesPorNome = async (nome, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(
        `${apiBase}/clientes/v1?nome=${encodeURIComponent(nome)}`,
        config,
    );

    if (!response.ok) {
        throw new Error("Não foi possível buscar clientes.");
    }

    return response.json();
};

export const atualizarCliente = async (clienteDTO, token) => {
    const config = requestConfig("PUT", clienteDTO, token);
    const response = await fetch(`${apiBase}/clientes/v1`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível editar o cliente.");
    }

    return response.text();
};

export const excluirCliente = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(`${apiBase}/clientes/v1/${id}`, config);

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(errText || "Não foi possível excluir o cliente.");
    }

    return response.text();
};
