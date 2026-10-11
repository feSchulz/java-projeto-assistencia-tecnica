import React from "react";
import {
  faturamentoPorMes,
  rankingAparelhos,
  rankingMarcas,
  rankingTecnicos,
} from "../utils/dashboardStats";
import { formatarMoeda } from "../utils/formatadores";

const Ranking = ({ titulo, itens, vazio = "Sem dados ainda." }) => {
  const maior = Math.max(1, ...itens.map((i) => i.quantidade));
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-blue-900">{titulo}</h3>
      {itens.length === 0 ? (
        <p className="text-xs text-gray-500">{vazio}</p>
      ) : (
        <ul className="space-y-2">
          {itens.map((i) => (
            <li key={i.nome} className="text-xs text-gray-700">
              <div className="flex justify-between">
                <span className="truncate pr-2">{i.nome}</span>
                <span className="font-semibold">{i.quantidade}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-blue-50">
                <div
                  className="h-1.5 rounded-full bg-blue-500"
                  style={{ width: `${(i.quantidade / maior) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Faturamento dos últimos 6 meses (pela data de conclusão) + rankings.
const DashboardInsights = ({ ordens = [], loading = false }) => {
  if (loading) return null;

  const meses = faturamentoPorMes(ordens, 6);
  const maior = Math.max(1, ...meses.map((m) => m.valor));

  return (
    <div className="mb-8 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-blue-900">
          Faturamento dos últimos 6 meses
        </h3>
        <div className="flex h-44 items-end gap-4" data-testid="grafico-faturamento">
          {meses.map((m) => (
            <div key={`${m.ano}-${m.mes}`} className="flex flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-[11px] text-gray-500">{formatarMoeda(m.valor)}</span>
              <div
                className="w-full rounded-t bg-blue-500"
                style={{ height: `${Math.max(Math.round((m.valor / maior) * 110), m.valor > 0 ? 4 : 1)}px` }}
                title={`${m.rotulo}/${m.ano}: ${formatarMoeda(m.valor)}`}
              />
              <span className="mt-1 text-xs font-medium text-gray-600">{m.rotulo}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Ranking titulo="Aparelhos mais atendidos" itens={rankingAparelhos(ordens, 5)} />
        <Ranking titulo="Marcas mais atendidas" itens={rankingMarcas(ordens, 5)} />
        <Ranking titulo="Ordens por técnico" itens={rankingTecnicos(ordens, 5)} />
      </div>
    </div>
  );
};

export default DashboardInsights;
