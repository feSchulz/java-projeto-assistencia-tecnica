// src/components/EquipamentoFormModal.js
import React, { useEffect, useState } from "react";
import { FiTool, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { listarClientes } from "../services/ClienteService";
import { listarMarcas } from "../services/MarcaService";
import { criarEquipamento, atualizarEquipamento } from "../services/EquipamentoService";

const initialForm = { equipamento: "", clienteId: "", marcaId: "", modeloId: "" };

// equipamentoEditando: quando informado, abre em modo edição.
const EquipamentoFormModal = ({ isOpen, onClose, onCreated, equipamentoEditando }) => {
  const { token } = useSelector((state) => state.auth);
  const emEdicao = !!equipamentoEditando;

  const [form, setForm] = useState(initialForm);
  const [clientes, setClientes] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    // Lista vazia (ou falha pontual) não é erro: os <select>s só ficam sem opções.
    listarClientes(token)
      .then(setClientes)
      .catch((err) => {
        console.error("Erro ao carregar clientes:", err);
        setClientes([]);
      });
    listarMarcas(token)
      .then(setMarcas)
      .catch((err) => {
        console.error("Erro ao carregar marcas:", err);
        setMarcas([]);
      });

    if (equipamentoEditando) {
      setForm({
        equipamento: equipamentoEditando.equipamento || "",
        clienteId: equipamentoEditando.cliente?.id != null ? String(equipamentoEditando.cliente.id) : "",
        marcaId: equipamentoEditando.marca?.id != null ? String(equipamentoEditando.marca.id) : "",
        modeloId: equipamentoEditando.modelo?.id != null ? String(equipamentoEditando.modelo.id) : "",
      });
    } else {
      setForm(initialForm);
    }
    setError("");
  }, [isOpen, equipamentoEditando, token]);

  if (!isOpen) return null;

  const marcaSelecionada = marcas.find((m) => String(m.id) === form.marcaId);
  const modelosDisponiveis = marcaSelecionada?.modelos || [];

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "marcaId" ? { modeloId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const obrigatorios = ["equipamento", "clienteId", "marcaId", "modeloId"];
    if (obrigatorios.some((campo) => !form[campo])) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const equipamentoDTO = {
        ...(emEdicao ? { id: equipamentoEditando.id } : {}),
        equipamento: form.equipamento,
        cliente: { id: Number(form.clienteId) },
        marca: { id: Number(form.marcaId) },
        modelo: { id: Number(form.modeloId) },
      };

      if (emEdicao) {
        await atualizarEquipamento(equipamentoDTO, token);
      } else {
        await criarEquipamento(equipamentoDTO, token);
      }
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao salvar equipamento.");
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
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <FiTool className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {emEdicao ? "Editar equipamento" : "Cadastrar equipamento"}
              </h3>
              <p className="text-xs text-gray-500">Vincule o equipamento a um cliente, marca e modelo.</p>
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Descrição do equipamento</label>
              <input
                type="text"
                value={form.equipamento}
                onChange={handleChange("equipamento")}
                placeholder="Ex.: Notebook Dell XPS 13"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Marca</label>
                <select
                  value={form.marcaId}
                  onChange={handleChange("marcaId")}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Selecione</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Modelo</label>
                <select
                  value={form.modeloId}
                  onChange={handleChange("modeloId")}
                  disabled={!form.marcaId}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {!form.marcaId
                      ? "Selecione uma marca"
                      : modelosDisponiveis.length === 0
                        ? "Nenhum modelo cadastrado"
                        : "Selecione"}
                  </option>
                  {modelosDisponiveis.map((mo) => (
                    <option key={mo.id} value={mo.id}>
                      {mo.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

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
              {saving ? "Salvando..." : emEdicao ? "Salvar alterações" : "Salvar equipamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipamentoFormModal;
