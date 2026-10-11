// Impressão da ordem de serviço em A4, em duas vias:
//  - "entrada": termo de recebimento do equipamento (assinado pelo cliente ao deixar o aparelho);
//  - "retirada": comprovante de retirada, com peças, valores e garantia.
// Abre uma janela só com o documento e chama o diálogo de impressão do navegador.
import { statusLabel } from "../services/OrdemServicoService";
import { maskCpf, maskTelefone } from "./masks";
import { formatarData, formatarMoeda } from "./formatadores";

const escapar = (valor) =>
  String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const linha = (rotulo, valor) =>
  `<div class="campo"><span class="rotulo">${escapar(rotulo)}</span><span>${escapar(valor || "—")}</span></div>`;

const fimDaGarantia = (os) => {
  if (!os.dataConclusao || !os.garantiaDias) return null;
  const fim = new Date(os.dataConclusao);
  if (Number.isNaN(fim.getTime())) return null;
  fim.setDate(fim.getDate() + Number(os.garantiaDias));
  return fim;
};

export const montarHtmlOS = (os, pecas = [], tipo = "entrada") => {
  const pessoa = os.cliente?.pessoa || {};
  const equipamento = os.equipamento || {};
  const retirada = tipo === "retirada";

  const totalPecas = pecas.reduce((soma, p) => soma + Number(p.valorTotal || 0), 0);
  const maoDeObra = Number(os.valorMaoDeObra || 0);
  const fimGarantia = fimDaGarantia(os);

  const tabelaPecas = pecas.length
    ? `<table>
        <thead><tr><th>Material</th><th class="num">Qtd.</th><th class="num">Unitário</th><th class="num">Total</th></tr></thead>
        <tbody>${pecas
          .map(
            (p) => `<tr>
              <td>${escapar(p.material?.nome)}</td>
              <td class="num">${escapar(p.quantidade)}</td>
              <td class="num">${escapar(formatarMoeda(p.valorUnitario))}</td>
              <td class="num">${escapar(formatarMoeda(p.valorTotal))}</td>
            </tr>`,
          )
          .join("")}</tbody>
      </table>`
    : `<p class="vazio">Nenhuma peça utilizada.</p>`;

  const blocoRetirada = retirada
    ? `
      <h2>Serviço realizado</h2>
      <div class="texto">${escapar(os.descricaoTecnico || "—")}</div>

      <h2>Peças utilizadas</h2>
      ${tabelaPecas}

      <h2>Valores</h2>
      <div class="grid">
        ${linha("Peças", formatarMoeda(totalPecas))}
        ${linha("Mão de obra", formatarMoeda(maoDeObra))}
        ${linha("Valor total da OS", formatarMoeda(os.valor))}
        ${linha("Concluída em", formatarData(os.dataConclusao))}
        ${linha(
          "Garantia",
          os.garantiaDias
            ? `${os.garantiaDias} dias${fimGarantia ? ` (até ${formatarData(fimGarantia)})` : ""}`
            : "Sem garantia",
        )}
      </div>`
    : `
      <h2>Orçamento</h2>
      <div class="grid">
        ${linha("Valor estimado", os.valor != null ? formatarMoeda(os.valor) : "A definir")}
        ${linha("Prazo de conclusão", formatarData(os.prazoConclusao))}
      </div>`;

  const declaracao = retirada
    ? "Declaro que retirei o equipamento acima descrito e conferi o serviço realizado."
    : "Declaro que entreguei o equipamento acima descrito para avaliação e reparo e que as informações acima estão corretas.";

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>OS #${escapar(os.id)} - ${retirada ? "Comprovante de retirada" : "Termo de recebimento"}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12px; margin: 0; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 14px; }
  header h1 { font-size: 18px; margin: 0; color: #1e3a8a; }
  header .sub { font-size: 12px; color: #444; }
  header .os { text-align: right; font-size: 16px; font-weight: bold; }
  h2 { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: #1e3a8a; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin: 16px 0 8px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
  .campo { display: flex; flex-direction: column; }
  .rotulo { font-size: 10px; color: #666; text-transform: uppercase; }
  .texto { border: 1px solid #ddd; border-radius: 4px; padding: 8px; min-height: 40px; white-space: pre-wrap; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border-bottom: 1px solid #ddd; padding: 5px 4px; text-align: left; }
  th { font-size: 10px; text-transform: uppercase; color: #666; }
  .num { text-align: right; }
  .vazio { color: #666; font-style: italic; }
  .declaracao { margin-top: 22px; }
  .assinaturas { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; }
  .assinatura { border-top: 1px solid #111; padding-top: 4px; text-align: center; font-size: 11px; }
  footer { margin-top: 24px; font-size: 10px; color: #777; text-align: center; }
</style>
</head>
<body>
  <header>
    <div>
      <h1>Logos - Assistência Técnica</h1>
      <div class="sub">${retirada ? "Comprovante de retirada" : "Termo de recebimento de equipamento"}</div>
    </div>
    <div class="os">OS #${escapar(os.id)}<br /><span class="sub">Aberta em ${escapar(formatarData(os.dataAbertura))}</span></div>
  </header>

  <h2>Cliente</h2>
  <div class="grid">
    ${linha("Nome", pessoa.nome)}
    ${linha("CPF", pessoa.cpf ? maskCpf(pessoa.cpf) : "")}
    ${linha("Telefone", pessoa.telefone ? maskTelefone(pessoa.telefone) : "")}
    ${linha("E-mail", pessoa.email)}
  </div>

  <h2>Equipamento</h2>
  <div class="grid">
    ${linha("Equipamento", equipamento.equipamento)}
    ${linha("Marca / modelo", [equipamento.marca?.nome, equipamento.modelo?.nome].filter(Boolean).join(" / "))}
    ${linha("Técnico responsável", os.funcionarioResponsavel?.usuario?.nome)}
    ${linha("Situação", statusLabel(os.status))}
  </div>

  <h2>Defeito relatado pelo cliente</h2>
  <div class="texto">${escapar(os.descricaoCliente || "—")}</div>

  ${blocoRetirada}

  <p class="declaracao">${escapar(declaracao)}</p>

  <div class="assinaturas">
    <div class="assinatura">Assinatura do cliente</div>
    <div class="assinatura">Assinatura do atendente</div>
  </div>

  <footer>Documento gerado em ${escapar(new Date().toLocaleString("pt-BR"))}</footer>
</body>
</html>`;
};

// Abre a janela de impressão. Retorna false se o navegador bloqueou a janela.
export const imprimirOS = (os, pecas = [], tipo = "entrada") => {
  const janela = window.open("", "_blank", "width=900,height=700");
  if (!janela) return false;

  janela.document.open();
  janela.document.write(montarHtmlOS(os, pecas, tipo));
  janela.document.close();
  janela.focus();
  // pequena espera para o navegador renderizar antes de abrir o diálogo
  setTimeout(() => janela.print(), 250);
  return true;
};
