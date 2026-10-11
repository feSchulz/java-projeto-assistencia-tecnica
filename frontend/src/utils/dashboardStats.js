// Cálculos do Dashboard a partir das listas reais (ordens, clientes, materiais).
import { statusNome, statusFinalizado } from "../services/OrdemServicoService";

const paraData = (valor) => {
  if (!valor) return null;
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? null : d;
};

const mesmoDia = (a, b) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const mesmoMes = (a, b) => a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

export const abertasHoje = (ordens, agora = new Date()) =>
  ordens.filter((os) => {
    const d = paraData(os.dataAbertura);
    return d && mesmoDia(d, agora);
  }).length;

export const emAberto = (ordens) => ordens.filter((os) => !statusFinalizado(os.status)).length;

// Prazo vencido e ainda não concluída/cancelada.
export const atrasadas = (ordens, agora = new Date()) =>
  ordens.filter((os) => {
    const prazo = paraData(os.prazoConclusao);
    return prazo && prazo < agora && !statusFinalizado(os.status);
  }).length;

export const aguardandoAprovacao = (ordens) =>
  ordens.filter((os) => statusNome(os.status) === "AGUARDANDO_APROVACAO").length;

const concluidasComData = (ordens) =>
  ordens.filter((os) => statusNome(os.status) === "CONCLUIDA" && paraData(os.dataConclusao));

export const faturamentoDoMes = (ordens, agora = new Date()) =>
  concluidasComData(ordens)
    .filter((os) => mesmoMes(paraData(os.dataConclusao), agora))
    .reduce((soma, os) => soma + Number(os.valor || 0), 0);

// Faturamento dos últimos `quantidade` meses (do mais antigo ao atual), pela data de conclusão.
export const faturamentoPorMes = (ordens, quantidade = 6, agora = new Date()) => {
  const meses = [];
  for (let i = quantidade - 1; i >= 0; i -= 1) {
    const ref = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    meses.push({
      ano: ref.getFullYear(),
      mes: ref.getMonth(),
      rotulo: ref.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      valor: 0,
    });
  }

  concluidasComData(ordens).forEach((os) => {
    const d = paraData(os.dataConclusao);
    const alvo = meses.find((m) => m.ano === d.getFullYear() && m.mes === d.getMonth());
    if (alvo) alvo.valor += Number(os.valor || 0);
  });

  return meses;
};

// Ranking genérico: agrupa as ordens pela chave e devolve os `limite` maiores.
const ranking = (ordens, chave, limite = 5) => {
  const contagem = new Map();
  ordens.forEach((os) => {
    const bruto = chave(os);
    const nome = bruto ? String(bruto).trim() : "";
    if (!nome) return;
    const id = nome.toLowerCase();
    const atual = contagem.get(id) || { nome, quantidade: 0 };
    atual.quantidade += 1;
    contagem.set(id, atual);
  });
  return [...contagem.values()].sort((a, b) => b.quantidade - a.quantidade).slice(0, limite);
};

export const rankingAparelhos = (ordens, limite) => ranking(ordens, (os) => os.equipamento?.equipamento, limite);
export const rankingMarcas = (ordens, limite) => ranking(ordens, (os) => os.equipamento?.marca?.nome, limite);
export const rankingTecnicos = (ordens, limite) =>
  ranking(ordens, (os) => os.funcionarioResponsavel?.usuario?.nome, limite);

// Material com estoque igual ou abaixo do mínimo cadastrado.
export const materiaisAbaixoDoMinimo = (materiais) =>
  materiais.filter(
    (m) => m.estoqueMinimo != null && Number(m.quantidadeEstoque) <= Number(m.estoqueMinimo),
  );
