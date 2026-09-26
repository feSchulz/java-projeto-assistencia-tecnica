// src/components/MaterialFormModal.js
import React, { useEffect, useState } from "react";
import { FiPackage, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { listarMarcas } from "../services/MarcaService";
import { criarMaterial, atualizarMaterial } from "../services/MaterialEstoqueService";

const STATUS_MATERIAL = [
  { valor: "NOVA", label: "Nova" },
  { valor: "USADA", label: "Usada" },
  { valor: "SUBSTITUIDA", label: "Substituída" },
];

const initialForm = {
  nome: "",
  codigo: "",
  descricao: "",
  marcaId: "",
  modeloId: "",
  quantidadeEstoque: "",
  valorUnitario: "",
  status: "NOVA",
};

const MaterialFormModal = ({ isOpen, onClose, onCreated, materialEditando }) => {
  const { token } = useSelector((state) => state.auth);
  const emEdicao = !!materialEditando;

  const [form, setForm] = useState(initialForm);
  const [marcas, setMarcas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    listarMarcas(token).then(setMarcas).catch((err) => setError(err.message));

    if (materialEditando) {
      setForm({
        nome: materialEditando.nome || "",
        codigo: materialEditando.codigo || "",
        descricao: materialEditando.descricao || "",
        marcaId: materialEditando.marca?.id != null ? String(materialEditando.marca.id) : "",
        modeloId: materialEditando.modelo?.id != null ? String(materialEditando.modelo.id) : "",
        quantidadeEstoque:
          materialEditando.quantidadeEstoque != null ? String(materialEditando.quantidadeEstoque) : "",
        valorUnitario: materialEditando.valorUnitario != null ? String(materialEditando.valorUnitario) : "",
        status: materialEditando.status || "NOVA",
      });
    } else {
      setForm(initialForm);
    }
    setError("");
  }, [isOpen, materialEditando, token]);

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

    const obrigatorios = [
      "nome", "codigo", "descricao", "marcaId", "modeloId",
      "quantidadeEstoque", "valorUnitario",
    ];
    if (obrigatorios.some((campo) => !form[campo])) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const materialDTO = {
        ...(emEdicao ? { id: materialEditando.id } : {}),
        nome: form.nome,
        codigo: form.codigo,
        descricao: form.descricao,
        marca: { id: Number(form.marcaId) },
        modelo: { id: Number(form.modeloId) },
        quantidadeEstoque: Number(form.quantidadeEstoque),
        valorUnitario: Number(form.valorUnitario),
        status: form.status,
      };

      if (emEdicao) {
        await atualizarMaterial(materialDTO, token);
      } else {
        await criarMaterial(materialDTO, token);
      }
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao salvar material.");
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
              <FiPackage className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {emEdicao ? "Editar material" : "Cadastrar material"}
              </h3>
              <p className="text-xs text-gray-500">Peças e materiais disponíveis em estoque.</p>
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
          <div className="grid grid-cols-2 gap-4 px-6 py-5">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={handleChange("nome")}
                placeholder="Ex.: Tela LCD 15.6&quot;"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Código</label>
              <input
                type="text"
                value={form.codigo}
                onChange={handleChange("codigo")}
                placeholder="SKU/código único"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {STATUS_MATERIAL.map((s) => (
                  <option key={s.valor} value={s.valor}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Descrição</label>
              <textarea
                rows={2}
                value={form.descricao}
                onChange={handleChange("descricao")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

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

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Quantidade em estoque
              </label>
              <input
                type="number"
                min="0"
                value={form.quantidadeEstoque}
                onChange={handleChange("quantidadeEstoque")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Valor unitário (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.valorUnitario}
                onChange={handleChange("valorUnitario")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
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
              {saving ? "Salvando..." : emEdicao ? "Salvar alterações" : "Salvar material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialFormModal;
