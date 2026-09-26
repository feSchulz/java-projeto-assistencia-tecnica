// src/components/OrdemServicoFormModal.js
import React, { useEffect, useState } from "react";
import { FiTool, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { listarClientes } from "../services/ClienteService";
import { listarEquipamentosPorCliente } from "../services/EquipamentoService";
import { listarFuncionarios } from "../services/FuncionarioService";
import { criarOrdemServico, STATUS_OS } from "../services/OrdemServicoService";

const initialForm = {
  clienteId: "",
  equipamentoId: "",
  funcionarioId: "",
  descricaoCliente: "",
  descricaoTecnico: "",
  prazoConclusao: "",
  valor: "",
  status: "ABERTA",
};

const OrdemServicoFormModal = ({ isOpen, onClose, onCreated }) => {
  const { token } = useSelector((state) => state.auth);

  const [form, setForm] = useState(initialForm);
  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialForm);
    setEquipamentos([]);
    setError("");

    listarClientes(token).then(setClientes).catch((err) => setError(err.message));
    listarFuncionarios(token).then(setFuncionarios).catch((err) => setError(err.message));
  }, [isOpen, token]);

  useEffect(() => {
    if (!form.clienteId) {
      setEquipamentos([]);
      return;
    }

    setLoadingEquipamentos(true);
    listarEquipamentosPorCliente(form.clienteId, token)
      .then(setEquipamentos)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingEquipamentos(false));
  }, [form.clienteId, token]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "clienteId" ? { equipamentoId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const obrigatorios = [
      "clienteId", "equipamentoId", "funcionarioId",
      "descricaoCliente", "descricaoTecnico", "prazoConclusao", "valor",
    ];
    const faltando = obrigatorios.some((campo) => !form[campo]);

    if (faltando) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);

    try {
      const agora = new Date().toISOString();
      const prazo = new Date(`${form.prazoConclusao}T23:59:59`).toISOString();

      const osDTO = {
        descricaoCliente: form.descricaoCliente,
        descricaoTecnico: form.descricaoTecnico,
        dataAbertura: agora,
        prazoConclusao: prazo,
        valor: Number(form.valor),
        status: form.status,
        cliente: { id: Number(form.clienteId) },
        equipamento: { id: Number(form.equipamentoId) },
        funcionarioResponsavel: { id: Number(form.funcionarioId) },
      };

      await criarOrdemServico(osDTO, token);
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar ordem de serviço.");
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
              <FiTool className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Nova ordem de serviço</h3>
              <p className="text-xs text-gray-500">
                Informe o cliente, o equipamento e os dados do atendimento.
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
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Cliente</label>
              <select
                value={form.clienteId}
                onChange={handleChange("clienteId")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecione</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.pessoa?.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Equipamento</label>
              <select
                value={form.equipamentoId}
                onChange={handleChange("equipamentoId")}
                disabled={!form.clienteId || loadingEquipamentos}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">
                  {!form.clienteId
                    ? "Selecione um cliente primeiro"
                    : loadingEquipamentos
                      ? "Carregando..."
                      : equipamentos.length === 0
                        ? "Nenhum equipamento cadastrado"
                        : "Selecione"}
                </option>
                {equipamentos.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.equipamento} {e.marca?.nome ? `— ${e.marca.nome}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Relato do cliente
              </label>
              <textarea
                rows={2}
                value={form.descricaoCliente}
                onChange={handleChange("descricaoCliente")}
                placeholder="O que o cliente relatou sobre o problema"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Diagnóstico/observação técnica
              </label>
              <textarea
                rows={2}
                value={form.descricaoTecnico}
                onChange={handleChange("descricaoTecnico")}
                placeholder="Ex.: Aguardando avaliação técnica"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Técnico responsável
              </label>
              <select
                value={form.funcionarioId}
                onChange={handleChange("funcionarioId")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Selecione</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.usuario?.nome} ({f.login})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {STATUS_OS.map((s) => (
                  <option key={s.nome} value={s.nome}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Prazo de conclusão
              </label>
              <input
                type="date"
                value={form.prazoConclusao}
                onChange={handleChange("prazoConclusao")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Valor orçado (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.valor}
                onChange={handleChange("valor")}
                placeholder="0,00"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
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
              {saving ? "Salvando..." : "Salvar OS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrdemServicoFormModal;
