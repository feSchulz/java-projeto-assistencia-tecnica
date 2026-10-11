import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";
import { useSelector } from "react-redux";
import MaterialFormModal from "../../components/MaterialFormModal";
import Paginacao from "../../components/Paginacao";
import { buscarMateriaisPaginado, excluirMaterial } from "../../services/MaterialEstoqueService";
import { usePermissoes } from "../../utils/permissoes";
import { useDebouncedValue } from "../../utils/hooks";
import { useNavegacao } from "../../context/NavegacaoContext";

const TAMANHO_PAGINA = 10;

const formatarMoeda = (valor) =>
  valor != null
    ? Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

const Materiais = () => {
  const { token } = useSelector((state) => state.auth);

  const { isAdmin } = usePermissoes();
  const { parametros, limpar } = useNavegacao();

  const [pagina, setPagina] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [abaixoMinimo, setAbaixoMinimo] = useState(false);
  const buscaDebounced = useDebouncedValue(search);

  // Filtros vindos de outra tela (busca global, card "Materiais acabando" do Dashboard).
  useEffect(() => {
    if (!parametros) return;
    if (parametros.busca !== undefined) setSearch(String(parametros.busca));
    if (parametros.abaixoMinimo !== undefined) setAbaixoMinimo(!!parametros.abaixoMinimo);
    setPage(0);
    limpar();
  }, [parametros, limpar]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialEditando, setMaterialEditando] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const carregar = useCallback(() => {
    setLoading(true);
    setError("");
    buscarMateriaisPaginado(
      { page, size: TAMANHO_PAGINA, q: buscaDebounced, abaixoMinimo },
      token,
    )
      .then(setPagina)
      // Lista vazia (ou falha pontual ao buscar) não é erro: a tela já trata
      // isso com "Nenhum material encontrado.", sem banner de erro.
      .catch((err) => {
        console.error("Erro ao carregar materiais:", err);
        setPagina({ content: [], page: 0, totalPages: 0, totalElements: 0 });
      })
      .finally(() => setLoading(false));
  }, [page, buscaDebounced, abaixoMinimo, token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = pagina.content;

  const handleAdd = () => {
    setMaterialEditando(null);
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleEdit = (material) => {
    setMaterialEditando(material);
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleSalvo = () => {
    setFeedback(
      materialEditando ? "Material atualizado com sucesso." : "Material cadastrado com sucesso.",
    );
    carregar();
  };

  const handleRemove = async (material) => {
    if (!window.confirm(`Excluir o material "${material.nome}"? Essa ação não pode ser desfeita.`)) return;

    try {
      // o servidor diz se apagou de vez ou só inativou (material já usado em OS)
      const mensagem = await excluirMaterial(material.id, token);
      setFeedback(mensagem || `Material "${material.nome}" excluído com sucesso.`);
      carregar();
    } catch (err) {
      setError(err.message || "Não foi possível excluir o material.");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiPackage className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Materiais e Estoque</h2>
            <p className="text-xs text-gray-500">Peças usadas nas ordens de serviço.</p>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          <FiPlus className="text-sm" />
          <span>Cadastrar material</span>
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

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por nome ou código"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
          />
        </div>
        <label className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
          <input
            type="checkbox"
            checked={abaixoMinimo}
            onChange={(e) => {
              setAbaixoMinimo(e.target.checked);
              setPage(0);
            }}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
          />
          Só abaixo do mínimo
        </label>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-blue-50 text-xs font-semibold text-blue-900">
          <span>Nome</span>
          <span>Código</span>
          <span>Marca/Modelo</span>
          <span>Estoque</span>
          <span>Valor unit.</span>
          <span className="text-right pr-2">Ações</span>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">Carregando materiais...</div>
          ) : filtrados.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">Nenhum material encontrado.</div>
          ) : (
            filtrados.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-6 gap-4 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50/70 transition-colors"
              >
                <span className="truncate">{m.nome}</span>
                <span className="truncate">{m.codigo}</span>
                <span className="truncate">
                  {m.marca?.nome} / {m.modelo?.nome}
                </span>
                <span
                  className={
                    m.quantidadeEstoque <= 0
                      ? "font-medium text-red-600"
                      : m.estoqueMinimo != null && m.quantidadeEstoque <= m.estoqueMinimo
                        ? "font-medium text-orange-600"
                        : "text-gray-700"
                  }
                  title={
                    m.estoqueMinimo != null && m.quantidadeEstoque <= m.estoqueMinimo
                      ? `Abaixo do mínimo (${m.estoqueMinimo})`
                      : undefined
                  }
                >
                  {m.quantidadeEstoque}
                  {m.estoqueMinimo != null && m.quantidadeEstoque <= m.estoqueMinimo && (
                    <span className="ml-1 rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
                      repor
                    </span>
                  )}
                </span>
                <span>{formatarMoeda(m.valorUnitario)}</span>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Editar"
                  >
                    <FiEdit2 className="text-base" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemove(m)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      title="Remover"
                    >
                      <FiTrash2 className="text-base" />
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

      <MaterialFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleSalvo}
        materialEditando={materialEditando}
      />
    </section>
  );
};

export default Materiais;
