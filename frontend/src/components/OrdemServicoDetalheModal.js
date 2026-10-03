// src/components/OrdemServicoDetalheModal.js
import React, { useCallback, useEffect, useState } from "react";
import { FiFileText, FiX, FiTrash2, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { listarMateriais } from "../services/MaterialEstoqueService";
import {
  listarPecasPorOrdemServico,
  associarPeca,
  excluirPeca,
} from "../services/PecaOrdemServicoService";
import { statusLabel } from "../services/OrdemServicoService";

const formatarData = (valor) => {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
};

const formatarMoeda = (valor) =>
  valor != null
    ? Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

const OrdemServicoDetalheModal = ({ isOpen, onClose, ordemServico }) => {
  const { token } = useSelector((state) => state.auth);

  const [pecas, setPecas] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [loadingPecas, setLoadingPecas] = useState(false);
  const [novaPeca, setNovaPeca] = useState({ materialId: "", quantidade: "1" });
  const [error, setError] = useState("");
  const [salvandoPeca, setSalvandoPeca] = useState(false);

  const carregarPecas = useCallback(() => {
    if (!ordemServico?.id) return;
    setLoadingPecas(true);
    listarPecasPorOrdemServico(ordemServico.id, token)
      .then(setPecas)
      // Lista vazia (ou falha pontual) não é erro: a tela já trata isso
      // mostrando que não há peças associadas.
      .catch((err) => {
        console.error("Erro ao carregar peças da ordem de serviço:", err);
        setPecas([]);
      })
      .finally(() => setLoadingPecas(false));
  }, [ordemServico, token]);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setNovaPeca({ materialId: "", quantidade: "1" });
    carregarPecas();
    listarMateriais(token)
      .then(setMateriais)
      .catch((err) => {
        console.error("Erro ao carregar materiais:", err);
        setMateriais([]);
      });
  }, [isOpen, carregarPecas, token]);

  if (!isOpen || !ordemServico) return null;

  const handleAdicionarPeca = async (e) => {
    e.preventDefault();
    setError("");

    if (!novaPeca.materialId || !novaPeca.quantidade) {
      setError("Selecione o material e a quantidade.");
      return;
    }

    setSalvandoPeca(true);
    try {
      await associarPeca(
        {
          ordemServico: { id: ordemServico.id },
          material: { id: Number(novaPeca.materialId) },
          quantidade: Number(novaPeca.quantidade),
        },
        token,
      );
      setNovaPeca({ materialId: "", quantidade: "1" });
      carregarPecas();
    } catch (err) {
      setError(err.message || "Não foi possível associar a peça.");
    } finally {
      setSalvandoPeca(false);
    }
  };

  const handleRemoverPeca = async (peca) => {
    if (!window.confirm("Remover essa peça da ordem de serviço? A quantidade volta ao estoque.")) {
      return;
    }
    try {
      await excluirPeca(peca.id, token);
      carregarPecas();
    } catch (err) {
      setError(err.message || "Não foi possível remover a peça.");
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
              <FiFileText className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                OS #{ordemServico.id}
              </h3>
              <p className="text-xs text-gray-500">
                {ordemServico.cliente?.pessoa?.nome} — {ordemServico.equipamento?.equipamento}
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

        <div className="px-6 py-5 space-y-5">
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-gray-500">Status</span>
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {statusLabel(ordemServico.status)}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Valor orçado</span>
              <span className="text-gray-800 font-medium">{formatarMoeda(ordemServico.valor)}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Aberta em</span>
              <span className="text-gray-800">{formatarData(ordemServico.dataAbertura)}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Prazo</span>
              <span className="text-gray-800">{formatarData(ordemServico.prazoConclusao)}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Técnico responsável</span>
              <span className="text-gray-800">
                {ordemServico.funcionarioResponsavel?.usuario?.nome || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Concluída em</span>
              <span className="text-gray-800">{formatarData(ordemServico.dataConclusao)}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-xs font-medium text-gray-500">Relato do cliente</span>
              <span className="text-gray-800">{ordemServico.descricaoCliente}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-xs font-medium text-gray-500">Diagnóstico técnico</span>
              <span className="text-gray-800">{ordemServico.descricaoTecnico}</span>
            </div>
          </div>

          {/* Peças usadas */}
          <div className="border-t border-gray-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
              Peças utilizadas
            </span>

            <div className="mt-3 bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-5 gap-2 px-3 py-2 bg-blue-50 text-[11px] font-semibold text-blue-900">
                <span className="col-span-2">Material</span>
                <span>Qtd.</span>
                <span>Total</span>
                <span className="text-right pr-1">Ações</span>
              </div>
              <div className="divide-y divide-gray-100">
                {loadingPecas ? (
                  <div className="px-3 py-4 text-center text-xs text-gray-500">Carregando...</div>
                ) : pecas.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-gray-500">
                    Nenhuma peça associada a esta OS.
                  </div>
                ) : (
                  pecas.map((peca) => (
                    <div key={peca.id} className="grid grid-cols-5 gap-2 px-3 py-2 text-xs text-gray-700 items-center">
                      <span className="col-span-2 truncate">{peca.material?.nome}</span>
                      <span>{peca.quantidade}</span>
                      <span>{formatarMoeda(peca.valorTotal)}</span>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoverPeca(peca)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                          title="Remover"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleAdicionarPeca} className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-medium text-gray-600">Material</label>
                <select
                  value={novaPeca.materialId}
                  onChange={(e) => setNovaPeca((p) => ({ ...p, materialId: e.target.value }))}
                  className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Selecione</option>
                  {materiais.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} (estoque: {m.quantidadeEstoque})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="mb-1 block text-[11px] font-medium text-gray-600">Qtd.</label>
                <input
                  type="number"
                  min="1"
                  value={novaPeca.quantidade}
                  onChange={(e) => setNovaPeca((p) => ({ ...p, quantidade: e.target.value }))}
                  className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                disabled={salvandoPeca}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                <FiPlus className="text-sm" />
                Adicionar
              </button>
            </form>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 rounded-b-lg border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdemServicoDetalheModal;
