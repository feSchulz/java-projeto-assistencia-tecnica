// src/components/ClienteHistoricoModal.js
import React, { useEffect, useState } from "react";
import { FiClock, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import OrdemServicoDetalheModal from "./OrdemServicoDetalheModal";
import { listarEquipamentosPorCliente } from "../services/EquipamentoService";
import {
  listarOrdensServicoPorCliente,
  statusLabel,
  statusNome,
  statusPillClasses,
} from "../services/OrdemServicoService";
import { formatarData, formatarMoeda } from "../utils/formatadores";
import { maskCpf, maskTelefone } from "../utils/masks";

// Tudo do cliente numa tela só: dados, aparelhos e ordens de serviço.
const ClienteHistoricoModal = ({ isOpen, onClose, cliente }) => {
  const { token } = useSelector((state) => state.auth);

  const [equipamentos, setEquipamentos] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [osSelecionada, setOsSelecionada] = useState(null);

  const clienteId = cliente?.id;

  useEffect(() => {
    if (!isOpen || !clienteId) return;
    let ativo = true;
    setLoading(true);

    // Lista vazia (ou falha pontual) não é erro: as seções só mostram "nenhum registro".
    Promise.all([
      listarEquipamentosPorCliente(clienteId, token).catch((err) => {
        console.error("Erro ao carregar equipamentos do cliente:", err);
        return [];
      }),
      listarOrdensServicoPorCliente(clienteId, token).catch((err) => {
        console.error("Erro ao carregar ordens de serviço do cliente:", err);
        return [];
      }),
    ]).then(([eqs, oss]) => {
      if (!ativo) return;
      setEquipamentos(Array.isArray(eqs) ? eqs : []);
      setOrdens(
        (Array.isArray(oss) ? oss : []).sort(
          (a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime(),
        ),
      );
      setLoading(false);
    });

    return () => {
      ativo = false;
    };
  }, [isOpen, clienteId, token]);

  if (!isOpen || !cliente) return null;

  const pessoa = cliente.pessoa || {};
  const endereco = pessoa.endereco || {};
  const totalConcluido = ordens
    .filter((o) => statusNome(o.status) === "CONCLUIDA")
    .reduce((soma, o) => soma + Number(o.valor || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <FiClock className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Histórico do cliente</h3>
              <p className="text-xs text-gray-500">{pessoa.nome}</p>
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

        <div className="space-y-5 px-6 py-5">
          {/* Dados */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-gray-500">CPF</span>
              <span className="text-gray-800">{pessoa.cpf ? maskCpf(pessoa.cpf) : "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Telefone</span>
              <span className="text-gray-800">
                {pessoa.telefone ? maskTelefone(pessoa.telefone) : "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">E-mail</span>
              <span className="text-gray-800">{pessoa.email || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500">Endereço</span>
              <span className="text-gray-800">
                {[endereco.rua, endereco.numero, endereco.bairro, endereco.cidade?.nome]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </span>
            </div>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-blue-50 px-3 py-2">
              <div className="text-xl font-bold text-blue-900">{equipamentos.length}</div>
              <div className="text-[11px] text-gray-500">Equipamentos</div>
            </div>
            <div className="rounded-lg bg-blue-50 px-3 py-2">
              <div className="text-xl font-bold text-blue-900">{ordens.length}</div>
              <div className="text-[11px] text-gray-500">Ordens de serviço</div>
            </div>
            <div className="rounded-lg bg-blue-50 px-3 py-2">
              <div className="text-xl font-bold text-blue-900">{formatarMoeda(totalConcluido)}</div>
              <div className="text-[11px] text-gray-500">Em OS concluídas</div>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-sm text-gray-500">Carregando histórico...</p>
          ) : (
            <>
              {/* Equipamentos */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                  Equipamentos
                </span>
                <div className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-100">
                  {equipamentos.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-gray-500">
                      Nenhum equipamento cadastrado.
                    </div>
                  ) : (
                    equipamentos.map((eq) => (
                      <div key={eq.id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700">
                        <span className="truncate">{eq.equipamento}</span>
                        <span className="text-xs text-gray-500">
                          {[eq.marca?.nome, eq.modelo?.nome].filter(Boolean).join(" / ")}
                          {eq.ativo === false && (
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                              inativo
                            </span>
                          )}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ordens de serviço */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-900">
                  Ordens de serviço
                </span>
                <div className="mt-2 overflow-hidden rounded-lg border border-gray-100">
                  <div className="grid grid-cols-5 gap-2 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-900">
                    <span>Nº</span>
                    <span>Equipamento</span>
                    <span>Aberta em</span>
                    <span>Status</span>
                    <span className="text-right">Valor</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {ordens.length === 0 ? (
                      <div className="px-3 py-4 text-center text-xs text-gray-500">
                        Nenhuma ordem de serviço para este cliente.
                      </div>
                    ) : (
                      ordens.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setOsSelecionada(o)}
                          className="grid w-full grid-cols-5 items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-blue-50/70"
                          title="Abrir detalhes da OS"
                        >
                          <span className="font-medium text-blue-900">#{o.id}</span>
                          <span className="truncate">{o.equipamento?.equipamento}</span>
                          <span>{formatarData(o.dataAbertura)}</span>
                          <span>
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusPillClasses(o.status)}`}
                            >
                              {statusLabel(o.status)}
                            </span>
                          </span>
                          <span className="text-right">{formatarMoeda(o.valor)}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end rounded-b-lg border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Fechar
          </button>
        </div>
      </div>

      <OrdemServicoDetalheModal
        isOpen={!!osSelecionada}
        onClose={() => setOsSelecionada(null)}
        ordemServico={osSelecionada}
        onChanged={() => {
          // recarrega a lista de OS do cliente depois de mudar status/valores lá dentro
          listarOrdensServicoPorCliente(clienteId, token)
            .then((oss) =>
              setOrdens(
                oss.sort(
                  (a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime(),
                ),
              ),
            )
            .catch(() => {});
        }}
      />
    </div>
  );
};

export default ClienteHistoricoModal;
