// src/components/MarcaFormModal.js
import React, { useEffect, useState } from "react";
import { FiTag, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { criarMarca } from "../services/MarcaService";

const MarcaFormModal = ({ isOpen, onClose, onCreated }) => {
  const { token } = useSelector((state) => state.auth);

  const [nome, setNome] = useState("");
  const [modelos, setModelos] = useState([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNome("");
      setModelos([""]);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModeloChange = (index, value) => {
    setModelos((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  const handleAddModeloRow = () => setModelos((prev) => [...prev, ""]);
  const handleRemoveModeloRow = (index) =>
    setModelos((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nome.trim()) {
      setError("Informe o nome da marca.");
      return;
    }

    setSaving(true);
    try {
      const modelosValidos = modelos.map((m) => m.trim()).filter(Boolean);
      await criarMarca(
        {
          nome: nome.trim(),
          modelos: modelosValidos.map((m) => ({ nome: m })),
        },
        token,
      );
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao cadastrar marca.");
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
              <FiTag className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Cadastrar marca</h3>
              <p className="text-xs text-gray-500">
                Você pode já cadastrar os modelos dessa marca (opcional).
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

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Nome da marca</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Dell, Samsung, HP..."
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-600">
                  Modelos (opcional)
                </label>
                <button
                  type="button"
                  onClick={handleAddModeloRow}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <FiPlus className="text-sm" /> Adicionar modelo
                </button>
              </div>

              <div className="space-y-2">
                {modelos.map((modelo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={modelo}
                      onChange={(e) => handleModeloChange(index, e.target.value)}
                      placeholder="Ex.: XPS 13"
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {modelos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveModeloRow(index)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                        title="Remover"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    )}
                  </div>
                ))}
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
              {saving ? "Salvando..." : "Salvar marca"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarcaFormModal;
