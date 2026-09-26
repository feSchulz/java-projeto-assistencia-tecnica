// src/components/PapelFormModal.js
import React, { useEffect, useState } from "react";
import { FiShield, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { criarPapel, atualizarPapel } from "../services/PapelService";

const initialForm = { codigo: "", nome: "" };

// papelEditando: quando informado, abre em modo edição.
const PapelFormModal = ({ isOpen, onClose, onCreated, papelEditando }) => {
  const { token } = useSelector((state) => state.auth);
  const emEdicao = !!papelEditando;

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (papelEditando) {
      setForm({
        codigo: papelEditando.codigo || "",
        nome: papelEditando.nome || "",
      });
    } else {
      setForm(initialForm);
    }
    setError("");
  }, [isOpen, papelEditando]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.codigo.trim() || !form.nome.trim()) {
      setError("Preencha código e nome do papel.");
      return;
    }

    setSaving(true);
    try {
      const papelDTO = {
        codigo: form.codigo.trim().toUpperCase(),
        nome: form.nome.trim(),
      };

      if (emEdicao) {
        await atualizarPapel(papelEditando.id, { ...papelDTO, id: papelEditando.id }, token);
      } else {
        await criarPapel(papelDTO, token);
      }
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao salvar papel.");
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
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <FiShield className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {emEdicao ? "Editar papel" : "Cadastrar papel"}
              </h3>
              <p className="text-xs text-gray-500">Perfil de acesso dos funcionários.</p>
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
          <div className="space-y-4 px-6 py-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Código</label>
              <input
                type="text"
                value={form.codigo}
                onChange={handleChange("codigo")}
                placeholder="Ex.: ADMIN"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={handleChange("nome")}
                placeholder="Ex.: Administrador"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
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
              {saving ? "Salvando..." : emEdicao ? "Salvar alterações" : "Salvar papel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PapelFormModal;
