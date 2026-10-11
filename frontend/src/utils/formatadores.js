// Formatadores compartilhados pelas telas.

export const formatarData = (valor) => {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
};

export const formatarDataHora = (valor) => {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? "—"
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export const formatarMoeda = (valor) =>
  valor != null && valor !== ""
    ? Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";
