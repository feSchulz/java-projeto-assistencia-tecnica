import React, { useCallback, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import Paginacao from "../../components/Paginacao";
import { listarAuditoria, listarEntidadesAuditoria } from "../../services/AuditoriaService";
import { useDebouncedValue } from "../../utils/hooks";
import { formatarDataHora } from "../../utils/formatadores";

const TAMANHO_PAGINA = 20;

const corAcao = (acao) => {
  if (acao === "CRIAR") return "bg-green-50 text-green-700";
  if (acao === "EXCLUIR") return "bg-red-50 text-red-700";
  return "bg-blue-50 text-blue-700";
};

const rotuloAcao = (acao) =>
  ({ CRIAR: "Criou", EDITAR: "Alterou", EXCLUIR: "Excluiu" })[acao] || acao;

// Quem fez o quê e quando (só administrador).
const Auditoria = () => {
  const { token } = useSelector((state) => state.auth);

  const [pagina, setPagina] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entidade, setEntidade] = useState("");
  const [entidades, setEntidades] = useState([]);
  const buscaDebounced = useDebouncedValue(search);

  useEffect(() => {
    listarEntidadesAuditoria(token)
      .then((lista) => setEntidades(Array.isArray(lista) ? lista : []))
      .catch(() => setEntidades([]));
  }, [token]);

  const carregar = useCallback(() => {
    setLoading(true);
    listarAuditoria({ page, size: TAMANHO_PAGINA, q: buscaDebounced, entidade }, token)
      .then(setPagina)
      .catch((err) => {
        console.error("Erro ao carregar auditoria:", err);
        setPagina({ content: [], page: 0, totalPages: 0, totalElements: 0 });
      })
      .finally(() => setLoading(false));
  }, [page, buscaDebounced, entidade, token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por usuário ou caminho"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
          />
        </div>
        <select
          value={entidade}
          onChange={(e) => {
            setEntidade(e.target.value);
            setPage(0);
          }}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos os recursos</option>
          {entidades.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-blue-50 text-xs font-semibold text-blue-900">
          <span>Data/hora</span>
          <span>Usuário</span>
          <span>Ação</span>
          <span>Recurso</span>
          <span>Registro</span>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">Carregando auditoria...</div>
          ) : pagina.content.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Nenhum registro de auditoria encontrado.
            </div>
          ) : (
            pagina.content.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-5 items-center gap-4 px-4 py-2.5 text-sm text-gray-700"
                title={`${a.metodo} ${a.caminho} (HTTP ${a.statusHttp})`}
              >
                <span>{formatarDataHora(a.dataHora)}</span>
                <span className="truncate">{a.usuarioLogin || "—"}</span>
                <span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${corAcao(a.acao)}`}
                  >
                    {rotuloAcao(a.acao)}
                  </span>
                </span>
                <span className="truncate">{a.entidade}</span>
                <span>{a.registroId != null ? `#${a.registroId}` : "—"}</span>
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
    </section>
  );
};

export default Auditoria;
