import React from "react";
import { useNavegacao, MENU } from "../context/NavegacaoContext";
import {
  abertasHoje,
  emAberto,
  atrasadas,
  aguardandoAprovacao,
  faturamentoDoMes,
  materiaisAbaixoDoMinimo,
} from "../utils/dashboardStats";
import { formatarMoeda } from "../utils/formatadores";

const cores = {
  green: "text-green-600",
  orange: "text-orange-600",
  blue: "text-blue-600",
  red: "text-red-600",
};

// Todos os números são calculados a partir das listas reais carregadas pelo Dashboard.
// Os cards da segunda linha são clicáveis e abrem a lista já filtrada.
const MetricsGrid = ({ ordens = [], clientes = [], materiais = [], loading = false }) => {
  const { irPara } = useNavegacao();
  const hoje = new Date();
  const nomeMes = hoje.toLocaleDateString("pt-BR", { month: "long" });

  const qtdAtrasadas = atrasadas(ordens, hoje);
  const qtdAguardando = aguardandoAprovacao(ordens);
  const qtdMateriais = materiaisAbaixoDoMinimo(materiais).length;

  const primeiraLinha = [
    { title: "Ordens abertas hoje", value: String(abertasHoje(ordens, hoje)), note: "registradas hoje", color: "blue" },
    { title: "Faturamento do mês", value: formatarMoeda(faturamentoDoMes(ordens, hoje)), note: `concluídas em ${nomeMes}`, color: "green" },
    { title: "Clientes cadastrados", value: String(clientes.length), note: "total", color: "blue" },
    { title: "Ordens em aberto", value: String(emAberto(ordens)), note: "ainda não finalizadas", color: "orange" },
  ];

  const segundaLinha = [
    {
      title: "Ordens atrasadas",
      value: String(qtdAtrasadas),
      note: "prazo vencido — ver lista",
      color: qtdAtrasadas > 0 ? "red" : "green",
      onClick: () => irPara(MENU.ORDENS, { atrasadas: true }),
    },
    {
      title: "Aguardando aprovação",
      value: String(qtdAguardando),
      note: "orçamentos com o cliente",
      color: "orange",
      onClick: () => irPara(MENU.ORDENS, { status: "AGUARDANDO_APROVACAO" }),
    },
    {
      title: "Materiais acabando",
      value: String(qtdMateriais),
      note: "abaixo do estoque mínimo",
      color: qtdMateriais > 0 ? "red" : "green",
      onClick: () => irPara(MENU.MATERIAIS, { abaixoMinimo: true }),
    },
  ];

  const Cartao = ({ metric }) => {
    const conteudo = (
      <>
        <h3 className="text-gray-500 text-sm font-medium mb-2">{metric.title}</h3>
        <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? "…" : metric.value}</div>
        <div className={`text-sm ${cores[metric.color]}`}>{metric.note}</div>
      </>
    );
    const base = "bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left";
    return metric.onClick ? (
      <button type="button" onClick={metric.onClick} className={`${base} cursor-pointer`}>
        {conteudo}
      </button>
    ) : (
      <div className={base}>{conteudo}</div>
    );
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {primeiraLinha.map((m) => (
          <Cartao key={m.title} metric={m} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        {segundaLinha.map((m) => (
          <Cartao key={m.title} metric={m} />
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;
