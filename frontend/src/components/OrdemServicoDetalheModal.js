// src/components/OrdemServicoDetalheModal.js
import React, { useCallback, useEffect, useState } from "react";
import { FiFileText, FiX, FiTrash2, FiPlus, FiPrinter, FiShield } from "react-icons/fi";
import { useSelector } from "react-redux";
import { listarMateriais } from "../services/MaterialEstoqueService";
import {
  listarPecasPorOrdemServico,
  associarPeca,
  excluirPeca,
} from "../services/PecaOrdemServicoService";
import {
  statusLabel,
  statusNome,
  statusPillClasses,
  PROXIMOS_STATUS,
  acaoDoPasso,
  alterarStatusOrdemServico,
  listarHistoricoOrdemServico,
  atualizarValoresOrdemServico,
} from "../services/OrdemServicoService";
import { formatarData, formatarDataHora, formatarMoeda } from "../utils/formatadores";
import { imprimirOS } from "../utils/impressaoOS";

const inputClasses =
  "w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400";

// Fim da garantia = data de conclusão + dias de garantia.
const fimDaGarantia = (os) => {
  if (!os?.dataConclusao || !os?.garantiaDias) return null;
  const fim = new Date(os.dataConclusao);
  if (Number.isNaN(fim.getTime())) return null;
  fim.setDate(fim.getDate() + Number(os.garantiaDias));
  return fim;
};

const OrdemServicoDetalheModal = ({ isOpen, onClose, ordemServico, onChanged }) => {
  const { token } = useSelector((state) => state.auth);

  // Cópia local da OS: muda sozinha quando o status ou os valores são alterados aqui dentro.
  const [os, setOs] = useState(ordemServico);
  const [pecas, setPecas] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loadingPecas, setLoadingPecas] = useState(false);
  const [novaPeca, setNovaPeca] = useState({ materialId: "", quantidade: "1" });
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [salvandoPeca, setSalvandoPeca] = useState(false);

  // passo do fluxo em confirmação: { para, acao } + campos do mini-formulário
  const [passo, setPasso] = useState(null);
  const [formPasso, setFormPasso] = useState({ valorOrcado: "", garantiaDias: "", observacao: "" });
  const [salvandoStatus, setSalvandoStatus] = useState(false);

  const [maoDeObra, setMaoDeObra] = useState("");
  const [salvandoValores, setSalvandoValores] = useState(false);

  useEffect(() => {
    setOs(ordemServico);
  }, [ordemServico]);

  const osId = ordemServico?.id;

  const carregarPecas = useCallback(() => {
    if (!osId) return;
    setLoadingPecas(true);
    listarPecasPorOrdemServico(osId, token)
      .then(setPecas)
      // Lista vazia (ou falha pontual) não é erro: a tela já trata isso
      // mostrando que não há peças associadas.
      .catch((err) => {
        console.error("Erro ao carregar peças da ordem de serviço:", err);
        setPecas([]);
      })
      .finally(() => setLoadingPecas(false));
  }, [osId, token]);

  const carregarHistorico = useCallback(() => {
    if (!osId) return;
    listarHistoricoOrdemServico(osId, token)
      .then(setHistorico)
      .catch((err) => {
        console.error("Erro ao carregar histórico da ordem de serviço:", err);
        setHistorico([]);
      });
  }, [osId, token]);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setFeedback("");
    setPasso(null);
    setNovaPeca({ materialId: "", quantidade: "1" });
    setMaoDeObra(
      ordemServico?.valorMaoDeObra != null ? String(ordemServico.valorMaoDeObra) : "",
    );
    carregarPecas();
    carregarHistorico();
    listarMateriais(token)
      .then(setMateriais)
      .catch((err) => {
        console.error("Erro ao carregar materiais:", err);
        setMateriais([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, osId, token]);

  if (!isOpen || !os) return null;

  const statusAtual = statusNome(os.status);
  const passosPermitidos = PROXIMOS_STATUS[statusAtual] || [];

  const totalPecas = pecas.reduce((soma, p) => soma + Number(p.valorTotal || 0), 0);
  const totalCalculado = totalPecas + Number(maoDeObra || 0);
  const fimGarantia = fimDaGarantia(os);
  const garantiaVigente = fimGarantia && fimGarantia >= new Date();

  const escolherPasso = (para) => {
    setError("");
    setFeedback("");
    const acao = acaoDoPasso(statusAtual, para);
    setPasso({ para, acao });
    setFormPasso({
      valorOrcado: os.valorOrcado != null ? String(os.valorOrcado) : os.valor != null ? String(os.valor) : "",
      garantiaDias: os.garantiaDias != null ? String(os.garantiaDias) : "",
      observacao: "",
    });
  };

  const confirmarPasso = async (e) => {
    e.preventDefault();
    if (!passo) return;
    setError("");

    const corpo = { status: passo.para };
    if (formPasso.observacao.trim()) corpo.observacao = formPasso.observacao.trim();

    if (passo.acao.pedeValorOrcado) {
      if (formPasso.valorOrcado === "" || Number(formPasso.valorOrcado) < 0) {
        setError("Informe o valor do orçamento.");
        return;
      }
      corpo.valorOrcado = Number(formPasso.valorOrcado);
    }
    if (passo.acao.pedeGarantia && formPasso.garantiaDias !== "") {
      if (Number(formPasso.garantiaDias) < 0) {
        setError("Os dias de garantia não podem ser negativos.");
        return;
      }
      corpo.garantiaDias = Number(formPasso.garantiaDias);
    }

    setSalvandoStatus(true);
    try {
      const atualizada = await alterarStatusOrdemServico(os.id, corpo, token);
      setOs(atualizada);
      setPasso(null);
      setFeedback(`Status alterado para "${statusLabel(passo.para)}".`);
      carregarHistorico();
      onChanged?.();
    } catch (err) {
      setError(err.message || "Não foi possível alterar o status.");
    } finally {
      setSalvandoStatus(false);
    }
  };

  const handleAdicionarPeca = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");

    if (!novaPeca.materialId || !novaPeca.quantidade) {
      setError("Selecione o material e a quantidade.");
      return;
    }

    setSalvandoPeca(true);
    try {
      await associarPeca(
        {
          ordemServico: { id: os.id },
          material: { id: Number(novaPeca.materialId) },
          quantidade: Number(novaPeca.quantidade),
        },
        token,
      );
      setNovaPeca({ materialId: "", quantidade: "1" });
      carregarPecas();
      // o estoque mudou: recarrega a lista de materiais do select
      listarMateriais(token).then(setMateriais).catch(() => {});
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
      listarMateriais(token).then(setMateriais).catch(() => {});
    } catch (err) {
      setError(err.message || "Não foi possível remover a peça.");
    }
  };

  const salvarValores = async (aplicarTotal) => {
    setError("");
    setFeedback("");
    if (maoDeObra !== "" && Number(maoDeObra) < 0) {
      setError("A mão de obra não pode ser negativa.");
      return;
    }

    setSalvandoValores(true);
    try {
      const corpo = { aplicarTotal };
      if (maoDeObra !== "") corpo.valorMaoDeObra = Number(maoDeObra);
      const atualizada = await atualizarValoresOrdemServico(os.id, corpo, token);
      setOs(atualizada);
      setFeedback(
        aplicarTotal
          ? "Valor da OS atualizado para peças + mão de obra."
          : "Mão de obra salva.",
      );
      onChanged?.();
    } catch (err) {
      setError(err.message || "Não foi possível atualizar os valores.");
    } finally {
      setSalvandoValores(false);
    }
  };

  const handleImprimir = (tipo) => {
    setError("");
    if (!imprimirOS(os, pecas, tipo)) {
      setError("O navegador bloqueou a janela de impressão. Libere pop-ups para este site.");
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
              <h3 className="text-lg font-semibold text-blue-900">OS #{os.id}</h3>
              <p className="text-xs text-gray-500">
                {os.cliente?.pessoa?.nome} — {os.equipamento?.equipamento}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleImprimir("entrada")}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              title="Imprimir o termo de recebimento (via de entrada)"
            >
              <FiPrinter className="text-sm" /> Entrada
            </button>
            <button
              type="button"
              onClick={() => handleImprimir("retirada")}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              title="Imprimir o comprovante de retirada (peças, valores e garantia)"
            >
              <FiPrinter className="text-sm" /> Retirada
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Fechar"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-gray-500">Status</span>
              <span
                className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClasses(os.status)}`}
              >
                {statusLabel(os.status)}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Valor da OS</span>
              <span className="text-gray-800 font-medium">{formatarMoeda(os.valor)}</span>
            </div>
            {os.valorOrcado != null && (
              <div>
                <span className="block text-xs font-medium text-gray-500">Valor orçado</span>
                <span className="text-gray-800">{formatarMoeda(os.valorOrcado)}</span>
              </div>
            )}
            <div>
              <span className="block text-xs font-medium text-gray-500">Aberta em</span>
              <span className="text-gray-800">{formatarData(os.dataAbertura)}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Prazo</span>
              <span className="text-gray-800">{formatarData(os.prazoConclusao)}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Técnico responsável</span>
              <span className="text-gray-800">{os.funcionarioResponsavel?.usuario?.nome || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Concluída em</span>
              <span className="text-gray-800">{formatarData(os.dataConclusao)}</span>
            </div>
            {fimGarantia && (
              <div>
                <span className="block text-xs font-medium text-gray-500">Garantia</span>
                <span
                  className={`inline-flex items-center gap-1 text-sm ${garantiaVigente ? "text-green-700" : "text-gray-500"}`}
                >
                  <FiShield className="text-sm" />
                  {os.garantiaDias} dias — {garantiaVigente ? "até" : "venceu em"} {formatarData(fimGarantia)}
                </span>
              </div>
            )}
            <div className="col-span-2">
              <span className="block text-xs font-medium text-gray-500">Relato do cliente</span>
              <span className="text-gray-800">{os.descricaoCliente}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-xs font-medium text-gray-500">Diagnóstico técnico</span>
              <span className="text-gray-800">{os.descricaoTecnico}</span>
            </div>
          </div>

          {feedback && (
            <div className="rounded-md border border-green-100 bg-green-50 px-3 py-2 text-xs text-green-700">
              {feedback}
            </div>
          )}
          {error && (
            <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Andamento da OS (troca de status) */}
          <div className="border-t border-gray-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
              Andamento
            </span>

            <div className="mt-3 flex flex-wrap gap-2">
              {passosPermitidos.map((para) => {
                const acao = acaoDoPasso(statusAtual, para);
                const selecionado = passo?.para === para;
                return (
                  <button
                    key={para}
                    type="button"
                    onClick={() => escolherPasso(para)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      acao.perigo
                        ? "border border-red-200 text-red-600 hover:bg-red-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } ${selecionado ? "ring-2 ring-blue-300" : ""}`}
                  >
                    {acao.label}
                  </button>
                );
              })}
              {passosPermitidos.length === 0 && (
                <span className="text-xs text-gray-500">Nenhuma mudança de status disponível.</span>
              )}
            </div>

            {passo && (
              <form
                onSubmit={confirmarPasso}
                className="mt-3 space-y-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3"
              >
                <p className="text-xs text-gray-700">
                  <strong>{passo.acao.label}</strong> — a OS passará de{" "}
                  <strong>{statusLabel(statusAtual)}</strong> para{" "}
                  <strong>{statusLabel(passo.para)}</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {passo.acao.pedeValorOrcado && (
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-gray-600">
                        Valor do orçamento (R$)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formPasso.valorOrcado}
                        onChange={(e) => setFormPasso((f) => ({ ...f, valorOrcado: e.target.value }))}
                        className={inputClasses}
                      />
                    </div>
                  )}
                  {passo.acao.pedeGarantia && (
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-gray-600">
                        Garantia (dias — 0 ou vazio = sem garantia)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formPasso.garantiaDias}
                        onChange={(e) => setFormPasso((f) => ({ ...f, garantiaDias: e.target.value }))}
                        placeholder="Ex.: 90"
                        className={inputClasses}
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="mb-1 block text-[11px] font-medium text-gray-600">
                      Observação (opcional)
                    </label>
                    <input
                      type="text"
                      maxLength={500}
                      value={formPasso.observacao}
                      onChange={(e) => setFormPasso((f) => ({ ...f, observacao: e.target.value }))}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPasso(null)}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={salvandoStatus}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {salvandoStatus ? "Salvando..." : "Confirmar"}
                  </button>
                </div>
              </form>
            )}
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
                    <div
                      key={peca.id}
                      className="grid grid-cols-5 gap-2 px-3 py-2 text-xs text-gray-700 items-center"
                    >
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
                  className={inputClasses}
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
                  className={inputClasses}
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

          {/* Valores: peças + mão de obra */}
          <div className="border-t border-gray-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
              Valores
            </span>

            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="block text-[11px] font-medium text-gray-500">Peças</span>
                <span className="text-sm font-medium text-gray-800">{formatarMoeda(totalPecas)}</span>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-gray-500">
                  Mão de obra (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={maoDeObra}
                  onChange={(e) => setMaoDeObra(e.target.value)}
                  placeholder="0,00"
                  className={inputClasses}
                />
              </div>
              <div>
                <span className="block text-[11px] font-medium text-gray-500">Peças + mão de obra</span>
                <span className="text-sm font-semibold text-blue-900">{formatarMoeda(totalCalculado)}</span>
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                disabled={salvandoValores}
                onClick={() => salvarValores(false)}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Salvar mão de obra
              </button>
              <button
                type="button"
                disabled={salvandoValores}
                onClick={() => salvarValores(true)}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                title="Define o valor da OS como a soma das peças com a mão de obra"
              >
                Aplicar total como valor da OS
              </button>
            </div>
          </div>

          {/* Histórico de status */}
          <div className="border-t border-gray-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
              Histórico de status
            </span>

            {historico.length === 0 ? (
              <p className="mt-3 text-xs text-gray-500">Nenhum registro de mudança de status.</p>
            ) : (
              <ol className="mt-3 space-y-3 border-l-2 border-blue-100 pl-4">
                {historico.map((h) => (
                  <li key={h.id} className="relative text-xs text-gray-700">
                    <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <div className="font-medium text-gray-800">
                      {h.statusAnterior
                        ? `${statusLabel(h.statusAnterior)} → ${statusLabel(h.statusNovo)}`
                        : `Criada como ${statusLabel(h.statusNovo)}`}
                    </div>
                    <div className="text-gray-500">
                      {formatarDataHora(h.dataHora)}
                      {(h.funcionarioNome || h.funcionarioLogin) &&
                        ` — por ${h.funcionarioNome || h.funcionarioLogin}`}
                    </div>
                    {h.observacao && <div className="mt-0.5 italic text-gray-600">“{h.observacao}”</div>}
                  </li>
                ))}
              </ol>
            )}
          </div>
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
