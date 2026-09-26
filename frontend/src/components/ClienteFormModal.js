// src/components/ClienteFormModal.js
import React, { useEffect, useState } from "react";
import { FiUserPlus, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { criarCliente, atualizarCliente } from "../services/ClienteService";
import { listarEstados, listarCidades } from "../services/EnderecoService";

const onlyDigits = (value) => value.replace(/\D/g, "");

const initialForm = {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
    cep: "",
    estadoId: "",
    cidadeId: "",
};

// clienteEditando: quando informado, o modal abre em modo edição, pré-preenchido
// com os dados desse cliente (objeto retornado por GET /api/clientes/v1/{id}).
const ClienteFormModal = ({ isOpen, onClose, onCreated, clienteEditando }) => {
    const { token } = useSelector((state) => state.auth);
    const emEdicao = !!clienteEditando;

    const [form, setForm] = useState(initialForm);
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [loadingEstados, setLoadingEstados] = useState(false);
    const [loadingCidades, setLoadingCidades] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // enquanto true, mantemos a cidade já cadastrada do cliente sem depender de
    // saber o estado dela (a Cidade não guarda o Estado na modelagem atual) —
    // vira false assim que o usuário escolhe um novo estado, indicando que ele
    // quer trocar a cidade.
    const [preservandoCidadeAtual, setPreservandoCidadeAtual] = useState(false);

    // reseta/preenche o formulário sempre que o modal é aberto
    useEffect(() => {
        if (!isOpen) return;

        if (clienteEditando) {
            const pessoa = clienteEditando.pessoa || {};
            const endereco = pessoa.endereco || {};
            const cidade = endereco.cidade || {};

            setForm({
                nome: pessoa.nome || "",
                cpf: pessoa.cpf || "",
                telefone: pessoa.telefone || "",
                email: pessoa.email || "",
                rua: endereco.rua || "",
                numero: endereco.numero != null ? String(endereco.numero) : "",
                bairro: endereco.bairro || "",
                complemento: endereco.complemento || "",
                cep: endereco.cep || "",
                estadoId: "",
                cidadeId: cidade.id != null ? String(cidade.id) : "",
            });

            // mostra a cidade atual como única opção até o usuário trocar o estado
            setCidades(cidade.id ? [{ id: cidade.id, nome: cidade.nome }] : []);
            setPreservandoCidadeAtual(true);
        } else {
            setForm(initialForm);
            setCidades([]);
            setPreservandoCidadeAtual(false);
        }

        setError("");
    }, [isOpen, clienteEditando]);

    // carrega estados uma vez, ao abrir
    useEffect(() => {
        if (!isOpen) return;

        setLoadingEstados(true);
        listarEstados(token)
            .then(setEstados)
            .catch((err) => setError(err.message))
            .finally(() => setLoadingEstados(false));
    }, [isOpen, token]);

    // recarrega cidades sempre que o estado muda (a não ser que ainda estejamos
    // preservando a cidade original do cliente em edição)
    useEffect(() => {
        if (preservandoCidadeAtual) return;

        if (!form.estadoId) {
            setCidades([]);
            return;
        }

        setLoadingCidades(true);
        listarCidades(form.estadoId, token)
            .then(setCidades)
            .catch((err) => setError(err.message))
            .finally(() => setLoadingCidades(false));
    }, [form.estadoId, token, preservandoCidadeAtual]);

    if (!isOpen) return null;

    const handleChange = (field) => (e) => {
        let { value } = e.target;

        if (field === "cpf") value = onlyDigits(value).slice(0, 11);
        if (field === "telefone") value = onlyDigits(value).slice(0, 11);
        if (field === "cep") value = onlyDigits(value).slice(0, 8);
        if (field === "numero") value = onlyDigits(value);

        if (field === "estadoId") {
            // usuário decidiu trocar o estado -> abandona a cidade preservada
            setPreservandoCidadeAtual(false);
        }

        setForm((prev) => ({
            ...prev,
            [field]: value,
            ...(field === "estadoId" ? { cidadeId: "" } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const obrigatorios = [
            "nome", "cpf", "telefone", "email",
            "rua", "numero", "bairro", "cep",
            "cidadeId",
        ];
        const faltando = obrigatorios.some((campo) => !form[campo]);

        if (faltando) {
            setError("Preencha todos os campos obrigatórios.");
            return;
        }

        setSaving(true);

        try {
            const pessoaBase = emEdicao ? { id: clienteEditando.pessoa?.id } : {};
            const enderecoBase = emEdicao
                ? { id: clienteEditando.pessoa?.endereco?.id }
                : {};

            const clienteDTO = {
                ...(emEdicao ? { id: clienteEditando.id } : {}),
                pessoa: {
                    ...pessoaBase,
                    nome: form.nome,
                    cpf: form.cpf,
                    telefone: form.telefone,
                    email: form.email,
                    endereco: {
                        ...enderecoBase,
                        rua: form.rua,
                        numero: Number(form.numero),
                        bairro: form.bairro,
                        complemento: form.complemento,
                        cep: form.cep,
                        cidade: { id: Number(form.cidadeId) },
                    },
                },
            };

            if (emEdicao) {
                await atualizarCliente(clienteDTO, token);
            } else {
                await criarCliente(clienteDTO, token);
            }
            onCreated?.();
            onClose();
        } catch (err) {
            setError(err.message || "Erro ao salvar cliente.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <FiUserPlus className="text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900">
                                {emEdicao ? "Editar cliente" : "Cadastrar cliente"}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Preencha os dados pessoais e o endereço do cliente.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        title="Fechar"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 px-6 py-5">
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                value={form.nome}
                                onChange={handleChange("nome")}
                                placeholder="Ex.: João da Silva"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                CPF
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.cpf}
                                onChange={handleChange("cpf")}
                                placeholder="Somente números"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Telefone
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.telefone}
                                onChange={handleChange("telefone")}
                                placeholder="Somente números"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={handleChange("email")}
                                placeholder="cliente@email.com"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Endereço */}
                        <div className="col-span-2 mt-2 border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                Endereço
              </span>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Estado
                            </label>
                            <select
                                value={form.estadoId}
                                onChange={handleChange("estadoId")}
                                disabled={loadingEstados}
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">
                                    {loadingEstados
                                        ? "Carregando..."
                                        : preservandoCidadeAtual
                                            ? "Trocar estado/cidade"
                                            : "Selecione"}
                                </option>
                                {estados.map((estado) => (
                                    <option key={estado.id} value={estado.id}>
                                        {estado.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Cidade
                            </label>
                            <select
                                value={form.cidadeId}
                                onChange={handleChange("cidadeId")}
                                disabled={
                                    (!form.estadoId && !preservandoCidadeAtual) ||
                                    loadingCidades
                                }
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">
                                    {loadingCidades ? "Carregando..." : "Selecione"}
                                </option>
                                {cidades.map((cidade) => (
                                    <option key={cidade.id} value={cidade.id}>
                                        {cidade.nome}
                                    </option>
                                ))}
                            </select>
                            {preservandoCidadeAtual && (
                                <p className="mt-1 text-[11px] text-gray-400">
                                    Mantendo a cidade atual. Selecione um estado acima para trocar.
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Rua
                            </label>
                            <input
                                type="text"
                                value={form.rua}
                                onChange={handleChange("rua")}
                                placeholder="Ex.: Rua das Flores"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Número
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.numero}
                                onChange={handleChange("numero")}
                                placeholder="Ex.: 123"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Bairro
                            </label>
                            <input
                                type="text"
                                value={form.bairro}
                                onChange={handleChange("bairro")}
                                placeholder="Ex.: Centro"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Complemento
                            </label>
                            <input
                                type="text"
                                value={form.complemento}
                                onChange={handleChange("complemento")}
                                placeholder="Ex.: Apto 12 (opcional)"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                CEP
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={form.cep}
                                onChange={handleChange("cep")}
                                placeholder="Somente números"
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {error && (
                            <p className="col-span-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-100 bg-gray-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : emEdicao ? "Salvar alterações" : "Salvar cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClienteFormModal;
