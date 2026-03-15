import React, { useState } from "react";
import { FiPlus, FiSearch, FiEye, FiTrash2, FiUsers } from "react-icons/fi";

const initialCustomers = [
  {
    id: 1,
    name: "João Silva",
    cpf: "123.456.789-00",
    email: "[email protected]",
  },
  {
    id: 2,
    name: "Maria Souza",
    cpf: "987.654.321-00",
    email: "[email protected]",
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    cpf: "111.222.333-44",
    email: "[email protected]",
  },
];

const Clientes = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf.includes(search.replace(/\D/g, "")),
  );

  const handleAddCustomer = () => {
    // abrir modal ou navegar para página de cadastro
    alert("Abrir formulário de cadastro de cliente");
  };

  const handleRemoveCustomer = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
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
          {filteredCustomers.length === 0 ? (
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
                <span className="truncate">{c.name}</span>
                <span className="truncate">{c.cpf}</span>
                <span className="truncate">{c.email}</span>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => alert(`Visualizar cliente ${c.name}`)}
                    className="
                      inline-flex items-center justify-center
                      h-8 w-8 rounded-full
                      text-blue-600 hover:bg-blue-100
                      transition-colors
                    "
                    title="Visualizar"
                  >
                    <FiEye className="text-base" />
                  </button>
                  <button
                    onClick={() => handleRemoveCustomer(c.id)}
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
    </section>
  );
};

export default Clientes;
