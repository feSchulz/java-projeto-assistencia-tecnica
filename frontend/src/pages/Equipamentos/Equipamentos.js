import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiTool } from "react-icons/fi";
import { useSelector } from "react-redux";
import EquipamentoFormModal from "../../components/EquipamentoFormModal";
import { listarEquipamentos, excluirEquipamento } from "../../services/EquipamentoService";

const Equipamentos = () => {
  const { token } = useSelector((state) => state.auth);

  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipamentoEditando, setEquipamentoEditando] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const carregar = useCallback(() => {
    setLoading(true);
    setError("");
    listarEquipamentos(token)
      .then(setEquipamentos)
      .catch((err) => setError(err.message || "Não foi possível carregar os equipamentos."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = equipamentos.filter((eq) => {
    const termo = search.toLowerCase();
    return (
      (eq.equipamento || "").toLowerCase().includes(termo) ||
      (eq.cliente?.pessoa?.nome || "").toLowerCase().includes(termo)
    );
  });

  const handleAdd = () => {
    setEquipamentoEditando(null);
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleEdit = (eq) => {
    setEquipamentoEditando(eq);
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleSalvo = () => {
    setFeedback(
      equipamentoEditando ? "Equipamento atualizado com sucesso." : "Equipamento cadastrado com sucesso.",
    );
    carregar();
  };

  const handleRemove = async (eq) => {
    if (!window.confirm(`Excluir o equipamento "${eq.equipamento}"? Essa ação não pode ser desfeita.`)) return;

    try {
      await excluirEquipamento(eq.id, token);
      setFeedback(`Equipamento "${eq.equipamento}" excluído com sucesso.`);
      carregar();
    } catch (err) {
      setError(err.message || "Não foi possível excluir o equipamento.");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiTool className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Equipamentos</h2>
            <p className="text-xs text-gray-500">
              Equipamentos dos clientes atendidos pela assistência técnica.
            </p>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          <FiPlus className="text-sm" />
          <span>Cadastrar equipamento</span>
        </button>
      </div>

      {feedback && (
        <div className="rounded-md border border-green-100 bg-green-50 px-4 py-2 text-sm text-green-700">
          {feedback}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Buscar por equipamento ou cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-blue-50 text-xs font-semibold text-blue-900">
          <span>Equipamento</span>
          <span>Cliente</span>
          <span>Marca</span>
          <span>Modelo</span>
          <span className="text-right pr-2">Ações</span>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">Carregando equipamentos...</div>
          ) : filtrados.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">Nenhum equipamento encontrado.</div>
          ) : (
            filtrados.map((eq) => (
              <div
                key={eq.id}
                className="grid grid-cols-5 gap-4 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50/70 transition-colors"
              >
                <span className="truncate">{eq.equipamento}</span>
                <span className="truncate">{eq.cliente?.pessoa?.nome}</span>
                <span className="truncate">{eq.marca?.nome}</span>
                <span className="truncate">{eq.modelo?.nome}</span>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(eq)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Editar"
                  >
                    <FiEdit2 className="text-base" />
                  </button>
                  <button
                    onClick={() => handleRemove(eq)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    title="Remover"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <EquipamentoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleSalvo}
        equipamentoEditando={equipamentoEditando}
      />
    </section>
  );
};

export default Equipamentos;
