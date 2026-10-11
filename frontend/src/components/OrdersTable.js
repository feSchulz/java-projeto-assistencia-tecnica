import React, { useState } from "react";
import OrdemServicoDetalheModal from "./OrdemServicoDetalheModal";
import { statusLabel, statusPillClasses } from "../services/OrdemServicoService";
import {
  FaClipboard,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaMoneyBill,
  FaEye,
} from "react-icons/fa";

const formatarData = (valor) => {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
};

const formatarMoeda = (valor) =>
  valor != null
    ? Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

const QUANTIDADE = 5;

// Últimas ordens de serviço reais (mais recentes primeiro), vindas do Dashboard.
const OrdersTable = ({ ordens = [], loading = false, onChanged }) => {
  const [selecionada, setSelecionada] = useState(null);

  const ultimas = [...ordens]
    .sort((a, b) => {
      const da = new Date(a.dataAbertura).getTime() || 0;
      const db = new Date(b.dataAbertura).getTime() || 0;
      return db - da || (b.id || 0) - (a.id || 0);
    })
    .slice(0, QUANTIDADE);

  return (
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
          {loading && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                Carregando ordens de serviço...
              </td>
            </tr>
          )}
          {!loading && ultimas.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                Nenhuma ordem de serviço encontrada.
              </td>
            </tr>
          )}
          {!loading &&
            ultimas.map((os) => (
              <tr key={os.id} className="hover:bg-blue-50/60 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">#{os.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {os.cliente?.pessoa?.nome || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatarData(os.dataAbertura)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClasses(os.status)}`}
                  >
                    {statusLabel(os.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {formatarMoeda(os.valor)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <button
                    type="button"
                    onClick={() => setSelecionada(os)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-medium transition-colors"
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

    <OrdemServicoDetalheModal
      isOpen={!!selecionada}
      onClose={() => setSelecionada(null)}
      ordemServico={selecionada}
      onChanged={onChanged}
    />
  </section>
  );
};

export default OrdersTable;
