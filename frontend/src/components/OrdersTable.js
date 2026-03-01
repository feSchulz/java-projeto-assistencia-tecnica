import React from "react";
import {
  FaClipboard,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaMoneyBill, // 💰 total
  FaEye, // 👁️ ação
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
  entregue: "bg-green-100 text-green-800",
  pendente: "bg-yellow-100 text-yellow-800",
};

const OrdersTable = () => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
      <FaClipboard className="mr-2 text-blue-600" size={24} /> Últimos pedidos
    </h2>
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <FaClipboard className="inline mr-1 w-4 h-4" /> Nº
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <FaUser className="inline mr-1 w-4 h-4" /> Cliente
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <FaCalendar className="inline mr-1 w-4 h-4" /> Data
            </th>
            {/* Ícone de status */}
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center">
                <FaCheckCircle className="mr-1 w-4 h-4" /> Status
              </span>
            </th>
            {/* Ícone de total */}
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center">
                <FaMoneyBill className="mr-1 w-4 h-4" /> Total
              </span>
            </th>
            {/* Ícone de ação */}
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="flex items-center">
                <FaEye className="mr-1 w-4 h-4" /> Ação
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {order.client}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status === "entregue" ? (
                    <FaCheckCircle className="mr-1 w-4 h-4" />
                  ) : (
                    <FaClock className="mr-1 w-4 h-4" />
                  )}
                  {order.status === "entregue" ? "Entregue" : "Pendente"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {order.total}
              </td>
              <td className="px-6 py-4">
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  <FaEye className="mr-2 w-4 h-4" /> Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersTable;
