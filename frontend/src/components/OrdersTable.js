import React from "react";
import {
  FaClipboard,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaMoneyBill,
  FaEye,
} from "react-icons/fa";

const orders = [
  {
    id: "#1234",
    client: "João Silva",
    date: "04/02/2026",
    status: "entregue",
    total: "R$ 1.250",
  },
  {
    id: "#1233",
    client: "Maria Santos",
    date: "03/02/2026",
    status: "pendente",
    total: "R$ 890",
  },
  {
    id: "#1232",
    client: "Carlos Lima",
    date: "02/02/2026",
    status: "entregue",
    total: "R$ 2.100",
  },
];

const statusColors = {
  entregue: "bg-green-50 text-green-700",
  pendente: "bg-yellow-50 text-yellow-700",
};

const OrdersTable = () => (
  <section className="space-y-4">
    {/* Header da seção */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <FaClipboard className="text-base" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-blue-900">
            Últimos pedidos
          </h2>
          <p className="text-xs text-gray-500">
            Visualize as últimas vendas registradas.
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-blue-50">
          <tr className="text-xs font-semibold text-blue-900">
            <th className="px-4 py-3 text-left">
              <span className="inline-flex items-center gap-1">
                <FaClipboard className="w-3 h-3" />
                <span>Nº pedido</span>
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="inline-flex items-center gap-1">
                <FaUser className="w-3 h-3" />
                <span>Cliente</span>
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="inline-flex items-center gap-1">
                <FaCalendar className="w-3 h-3" />
                <span>Data</span>
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="inline-flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" />
                <span>Status</span>
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="inline-flex items-center gap-1">
                <FaMoneyBill className="w-3 h-3" />
                <span>Total</span>
              </span>
            </th>
            {/* AÇÕES - ALINHADA À DIREITA */}
            {/* HEADER - th da coluna Ações (EXATO igual ao botão) */}
            <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900">
              <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full text-blue-600">
                <FaEye className="w-3 h-3" />
                <span>Ações</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-blue-50/60 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {order.client}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{order.date}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`
                    inline-flex items-center px-2.5 py-1 rounded-full
                    text-xs font-medium
                    ${statusColors[order.status]}
                  `}
                >
                  {order.status === "entregue" ? (
                    <FaCheckCircle className="mr-1 w-3 h-3" />
                  ) : (
                    <FaClock className="mr-1 w-3 h-3" />
                  )}
                  {order.status === "entregue" ? "Entregue" : "Pendente"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                {order.total}
              </td>
              {/* AÇÕES - PERFEITAMENTE ALINHADA */}
              {/* CORPO - td da coluna Ações (permanece igual) */}
              <td className="px-4 py-3 text-right text-sm">
                <button
                className=" inline-flex items-center gap-1 px-3 py-1.5 rounded-full 
                text-blue-600 bg-blue-50 hover:bg-blue-100
                text-xs font-medium transition-colors "
                >
                  <FaEye className="w-3 h-3" />
                  <span>Ver detalhes</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default OrdersTable;
