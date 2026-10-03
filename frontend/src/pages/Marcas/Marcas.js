import React, { useCallback, useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiTag,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import MarcaFormModal from "../../components/MarcaFormModal";
import {
  listarMarcas,
  excluirMarca,
  atualizarMarca,
  excluirModelo,
} from "../../services/MarcaService";

const MarcaCard = ({ marca, onChanged, onError }) => {
  const { token } = useSelector((state) => state.auth);
  const [expandido, setExpandido] = useState(false);
  const [novoModelo, setNovoModelo] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleExcluirMarca = async () => {
    if (
      !window.confirm(
        `Excluir a marca "${marca.nome}"? Todos os modelos dela também serão removidos.`,
      )
    )
      return;

    try {
      await excluirMarca(marca.id, token);
      onChanged();
    } catch (err) {
      onError(err.message || "Não foi possível excluir a marca.");
    }
  };

  const handleAdicionarModelo = async (e) => {
    e.preventDefault();
    if (!novoModelo.trim()) return;

    setSalvando(true);
    try {
      const modelosAtuais = (marca.modelos || []).map((m) => ({ id: m.id, nome: m.nome }));
      await atualizarMarca(
        {
          id: marca.id,
          nome: marca.nome,
          modelos: [...modelosAtuais, { nome: novoModelo.trim() }],
        },
        token,
      );
      setNovoModelo("");
      onChanged();
    } catch (err) {
      onError(err.message || "Não foi possível adicionar o modelo.");
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirModelo = async (modelo) => {
    if (!window.confirm(`Excluir o modelo "${modelo.nome}"?`)) return;
    try {
      await excluirModelo(modelo.id, token);
      onChanged();
    } catch (err) {
      onError(err.message || "Não foi possível excluir o modelo.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="flex items-center gap-2 text-left flex-1"
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiTag className="text-sm" />
          </div>
          <div>
            <span className="block text-sm font-medium text-blue-900">{marca.nome}</span>
            <span className="block text-xs text-gray-500">
              {(marca.modelos || []).length} modelo(s)
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExcluirMarca}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-red-500 hover:bg-red-50 transition-colors"
            title="Excluir marca"
          >
            <FiTrash2 className="text-base" />
          </button>
          <button
            type="button"
            onClick={() => setExpandido((v) => !v)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            title={expandido ? "Recolher" : "Ver modelos"}
          >
            {expandido ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
      </div>

      {expandido && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
          {(marca.modelos || []).length === 0 ? (
            <p className="text-xs text-gray-500">Nenhum modelo cadastrado ainda.</p>
          ) : (
            marca.modelos.map((modelo) => (
              <div
                key={modelo.id}
                className="flex items-center justify-between bg-white rounded-md border border-gray-100 px-3 py-2"
              >
                <span className="text-sm text-gray-700">{modelo.nome}</span>
                <button
                  type="button"
                  onClick={() => handleExcluirModelo(modelo)}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  title="Excluir modelo"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            ))
          )}

          <form onSubmit={handleAdicionarModelo} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={novoModelo}
              onChange={(e) => setNovoModelo(e.target.value)}
              placeholder="Novo modelo dessa marca"
              className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <FiPlus className="text-sm" />
              Adicionar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const Marcas = () => {
  const { token } = useSelector((state) => state.auth);

  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const carregar = useCallback(() => {
    setLoading(true);
    setError("");
    listarMarcas(token)
      .then(setMarcas)
      // Lista vazia (ou falha pontual ao buscar) não é erro: a tela já trata
      // isso com "Nenhuma marca encontrada.", sem banner de erro.
      .catch((err) => {
        console.error("Erro ao carregar marcas:", err);
        setMarcas([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtradas = marcas.filter((m) => m.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiTag className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Marcas e Modelos</h2>
            <p className="text-xs text-gray-500">
              Catálogo usado nos cadastros de equipamentos e materiais.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFeedback("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          <FiPlus className="text-sm" />
          <span>Cadastrar marca</span>
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
          placeholder="Buscar marca"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">Carregando marcas...</div>
        ) : filtradas.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500 bg-white rounded-lg border border-gray-100">
            Nenhuma marca encontrada.
          </div>
        ) : (
          filtradas.map((marca) => (
            <MarcaCard
              key={marca.id}
              marca={marca}
              onChanged={() => {
                setFeedback("");
                carregar();
              }}
              onError={setError}
            />
          ))
        )}
      </div>

      <MarcaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          setFeedback("Marca cadastrada com sucesso.");
          carregar();
        }}
      />
    </section>
  );
};

export default Marcas;
