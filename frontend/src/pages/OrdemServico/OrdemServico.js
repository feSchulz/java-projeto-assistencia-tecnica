import React, { useState } from "react";
import {
  FiFileText,
  FiSearch,
  FiEye,
  FiTool,
  FiPlusCircle,
} from "react-icons/fi";

const initialOrders = [
  {
    id: 101,
    customer: "João Silva",
    device: "Notebook Dell",
    status: "Em análise",
    createdAt: "15/03/2026",
  },
  {
    id: 102,
    customer: "Maria Souza",
    device: "Smartphone Samsung",
    status: "Aguardando peça",
    createdAt: "14/03/2026",
  },
  {
    id: 103,
    customer: "Pedro Oliveira",
    device: "Impressora HP",
    status: "Concluída",
    createdAt: "10/03/2026",
  },
];

const OrdemServico = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (o) =>
      String(o.id).includes(search) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.device.toLowerCase().includes(search.toLowerCase()),
  );

  const handleNewOrder = () => {
    // Aqui você abre um modal ou navega para /os/nova
    alert("Abrir formulário de nova Ordem de Serviço (OS)");
  };

  const handleViewOrder = (id) => {
    // Navegar para detalhes ou abrir modal
    alert(`Visualizar detalhes da OS #${id}`);
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

      {/* Barra de busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por número da OS, cliente ou equipamento"
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
        <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-blue-50 text-xs font-semibold text-blue-900">
          <span>Nº OS</span>
          <span>Cliente</span>
          <span>Equipamento</span>
          <span>Status</span>
          <span className="text-right pr-2">Ações</span>
        </div>

        {/* Linhas */}
        <div className="divide-y divide-gray-100">
          {filteredOrders.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Nenhuma OS encontrada.
            </div>
          ) : (
            filteredOrders.map((o) => (
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
                <span className="truncate">{o.customer}</span>
                <span className="truncate">{o.device}</span>

                {/* Status com pill */}
                <span>
                  <span
                    className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        o.status === "Concluída"
                          ? "bg-green-50 text-green-700"
                          : o.status === "Aguardando peça"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-blue-50 text-blue-700"
                      }
                    `}
                  >
                    {o.status}
                  </span>
                </span>

                {/* Ações somente visualizar */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleViewOrder(o.id)}
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default OrdemServico;
