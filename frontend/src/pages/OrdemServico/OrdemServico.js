import React, { useCallback, useEffect, useState } from "react";
import { FiFileText, FiSearch, FiEye, FiTool, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import OrdemServicoFormModal from "../../components/OrdemServicoFormModal";
import OrdemServicoDetalheModal from "../../components/OrdemServicoDetalheModal";
import Paginacao from "../../components/Paginacao";
import {
  buscarOrdensServicoPaginado,
  excluirOrdemServico,
  statusLabel,
  statusPillClasses,
  STATUS_OS,
} from "../../services/OrdemServicoService";
import { usePermissoes } from "../../utils/permissoes";
import { useDebouncedValue } from "../../utils/hooks";
import { useNavegacao } from "../../context/NavegacaoContext";

const TAMANHO_PAGINA = 10;

const OrdemServico = () => {
  const { token } = useSelector((state) => state.auth);
  const { isAdmin } = usePermissoes();
  const { parametros, limpar } = useNavegacao();

  const [pagina, setPagina] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [somenteAtrasadas, setSomenteAtrasadas] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [osSelecionada, setOsSelecionada] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const buscaDebounced = useDebouncedValue(search);

  // Filtros vindos de outra tela (busca global do cabeçalho, cards do Dashboard).
  useEffect(() => {
    if (!parametros) return;
    if (parametros.busca !== undefined) setSearch(String(parametros.busca));
    if (parametros.status !== undefined) setStatusFiltro(parametros.status);
    if (parametros.atrasadas !== undefined) setSomenteAtrasadas(!!parametros.atrasadas);
    setPage(0);
    limpar();
  }, [parametros, limpar]);

  const carregarOrdens = useCallback(() => {
    setLoading(true);
    setError("");

    buscarOrdensServicoPaginado(
      { page, size: TAMANHO_PAGINA, q: buscaDebounced, status: statusFiltro, atrasadas: somenteAtrasadas },
      token,
    )
      .then(setPagina)
      // Lista vazia (ou falha pontual ao buscar) não é erro: a tela já trata
      // isso com "Nenhuma ordem de serviço encontrada.", sem banner de erro.
      .catch((err) => {
        console.error("Erro ao carregar ordens de serviço:", err);
        setPagina({ content: [], page: 0, totalPages: 0, totalElements: 0 });
      })
      .finally(() => setLoading(false));
  }, [page, buscaDebounced, statusFiltro, somenteAtrasadas, token]);

  useEffect(() => {
    carregarOrdens();
  }, [carregarOrdens]);

  const orders = pagina.content;

  const handleNewOrder = () => {
    setFeedback("");
    setIsFormOpen(true);
  };

  const handleOrdemCriada = () => {
    setFeedback("Ordem de serviço cadastrada com sucesso.");
    carregarOrdens();
  };

  const handleViewOrder = (os) => {
    setOsSelecionada(os);
  };

  const mudarFiltro = (setter) => (valor) => {
    setter(valor);
    setPage(0);
  };

  const handleRemoveOrder = async (os) => {
    if (!window.confirm(`Excluir a OS #${os.id}? Essa ação não pode ser desfeita.`)) return;

    try {
      await excluirOrdemServico(os.id, token);
      setFeedback(`OS #${os.id} excluída com sucesso. As peças dela voltaram ao estoque.`);
      carregarOrdens();
    } catch (err) {
      setError(err.message || "Não foi possível excluir a ordem de serviço.");
    }
  };

  return (
    <section className="space-y-4">
      {/* Header da seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiTool className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">
              Ordens de Serviço
            </h2>
            <p className="text-xs text-gray-500">
              Acompanhe as OS da assistência técnica.
            </p>
          </div>
        </div>

        {/* Botão Nova OS */}
        <button
          onClick={handleNewOrder}
          className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-md
            bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
          "
        >
          <FiPlusCircle className="text-sm" />
          <span>Nova OS</span>
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

      {/* Barra de busca + filtro de status */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por número da OS, cliente ou equipamento"
            value={search}
            onChange={(e) => mudarFiltro(setSearch)(e.target.value)}
            className="
              w-full pl-9 pr-3 py-2
              rounded-md border border-gray-200
              bg-white text-sm text-gray-700
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
              shadow-sm
            "
          />
        </div>
        <select
          value={statusFiltro}
          onChange={(e) => mudarFiltro(setStatusFiltro)(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos os status</option>
          {STATUS_OS.map((s) => (
            <option key={s.nome} value={s.nome}>
              {s.label}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
          <input
            type="checkbox"
            checked={somenteAtrasadas}
            onChange={(e) => mudarFiltro(setSomenteAtrasadas)(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
          />
          Só atrasadas
        </label>
      </div>

      {/* Card/Tabela */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Cabeçalho da tabela */}
        <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-blue-50 text-xs font-semibold text-blue-900">
          <span>Nº OS</span>
          <span>Cliente</span>
          <span>Equipamento</span>
          <span>Status</span>
          <span className="text-right pr-2">Ações</span>
        </div>

        {/* Linhas */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Carregando ordens de serviço...
            </div>
          ) : orders.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Nenhuma OS encontrada.
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="
                  grid grid-cols-5 gap-4 px-4 py-3
                  text-sm text-gray-700
                  hover:bg-blue-50/70
                  transition-colors
                "
              >
                <div className="flex items-center gap-2">
                  <FiFileText className="text-blue-500 text-base" />
                  <span className="font-medium text-blue-900">#{o.id}</span>
                </div>
                <span className="truncate">{o.cliente?.pessoa?.nome}</span>
                <span className="truncate">{o.equipamento?.equipamento}</span>

                {/* Status com pill */}
                <span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClasses(o.status)}`}
                  >
                    {statusLabel(o.status)}
                  </span>
                </span>

                {/* Ações */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleViewOrder(o)}
                    className="
                      inline-flex items-center gap-1
                      px-3 py-1.5 rounded-full
                      text-blue-600 bg-blue-50
                      hover:bg-blue-100
                      text-xs font-medium
                      transition-colors
                    "
                  >
                    <FiEye className="text-sm" />
                    <span>Ver detalhes</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveOrder(o)}
                      className="
                        inline-flex items-center justify-center
                        h-8 w-8 rounded-full
                        text-red-500 hover:bg-red-50
                        transition-colors
                      "
                      title="Excluir"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <Paginacao
          page={pagina.page}
          totalPages={pagina.totalPages}
          totalElements={pagina.totalElements}
          size={TAMANHO_PAGINA}
          onChange={setPage}
        />
      </div>

      <OrdemServicoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreated={handleOrdemCriada}
      />

      <OrdemServicoDetalheModal
        isOpen={!!osSelecionada}
        onClose={() => setOsSelecionada(null)}
        ordemServico={osSelecionada}
        onChanged={carregarOrdens}
      />
    </section>
  );
};

export default OrdemServico;
