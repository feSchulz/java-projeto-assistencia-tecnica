import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import { useSelector } from "react-redux";
import ClienteFormModal from "../../components/ClienteFormModal";
import { listarClientes, excluirCliente } from "../../services/ClienteService";

const Clientes = () => {
  const { token } = useSelector((state) => state.auth);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const carregarClientes = useCallback(() => {
    setLoading(true);
    setError("");
    listarClientes(token)
      .then(setCustomers)
      // Não ter clientes cadastrados (ou uma falha momentânea ao buscar a lista)
      // não é um erro para o usuário: a tela já trata lista vazia com a
      // mensagem "Nenhum cliente encontrado.", então aqui só registramos no
      // console para depuração, sem exibir um banner de erro.
      .catch((err) => {
        console.error("Erro ao carregar clientes:", err);
        setCustomers([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const filteredCustomers = customers.filter((c) => {
    const nome = c.pessoa?.nome || "";
    const cpf = c.pessoa?.cpf || "";
    const termo = search.toLowerCase();
    return (
      nome.toLowerCase().includes(termo) || cpf.includes(search.replace(/\D/g, ""))
    );
  });

  const handleAddCustomer = () => {
    setClienteEditando(null);
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleEditCustomer = (cliente) => {
    setClienteEditando(cliente);
    setFeedback("");
    setIsModalOpen(true);
  };

  const handleClienteSalvo = () => {
    setFeedback(
      clienteEditando ? "Cliente atualizado com sucesso." : "Cliente cadastrado com sucesso.",
    );
    carregarClientes();
  };

  const handleRemoveCustomer = async (cliente) => {
    const nome = cliente.pessoa?.nome || `#${cliente.id}`;
    if (!window.confirm(`Excluir o cliente "${nome}"? Essa ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await excluirCliente(cliente.id, token);
      setFeedback(`Cliente "${nome}" excluído com sucesso.`);
      carregarClientes();
    } catch (err) {
      setError(err.message || "Não foi possível excluir o cliente.");
    }
  };

  return (
    <section className="space-y-4">
      {/* Header da seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiUsers className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Clientes</h2>
            <p className="text-xs text-gray-500">
              Gerencie os clientes cadastrados no sistema.
            </p>
          </div>
        </div>

        {/* Botão cadastrar */}
        <button
          onClick={handleAddCustomer}
          className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-md
            bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
          "
        >
          <FiPlus className="text-sm" />
          <span>Cadastrar cliente</span>
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

      {/* Barra de busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      </div>

      {/* Card/Tabela */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Cabeçalho da tabela */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-blue-50 text-xs font-semibold text-blue-900">
          <span>Nome</span>
          <span>CPF</span>
          <span>E-mail</span>
          <span className="text-right pr-2">Ações</span>
        </div>

        {/* Linhas */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Carregando clientes...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Nenhum cliente encontrado.
            </div>
          ) : (
            filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="
                  grid grid-cols-4 gap-4 px-4 py-3
                  text-sm text-gray-700
                  hover:bg-blue-50/70
                  transition-colors
                "
              >
                <span className="truncate">{c.pessoa?.nome}</span>
                <span className="truncate">{c.pessoa?.cpf}</span>
                <span className="truncate">{c.pessoa?.email}</span>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditCustomer(c)}
                    className="
                      inline-flex items-center justify-center
                      h-8 w-8 rounded-full
                      text-blue-600 hover:bg-blue-100
                      transition-colors
                    "
                    title="Editar"
                  >
                    <FiEdit2 className="text-base" />
                  </button>
                  <button
                    onClick={() => handleRemoveCustomer(c)}
                    className="
                      inline-flex items-center justify-center
                      h-8 w-8 rounded-full
                      text-red-500 hover:bg-red-50
                      transition-colors
                    "
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

      <ClienteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleClienteSalvo}
        clienteEditando={clienteEditando}
      />
    </section>
  );
};

export default Clientes;
