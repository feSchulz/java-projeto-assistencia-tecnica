import { createContext, useContext } from "react";

// Permite que qualquer tela mande o usuário para outra tela do menu, já com um filtro
// (ex.: o card "Ordens atrasadas" do Dashboard abre a lista de OS só com as atrasadas).
//   irPara(menuId, parametros)  -> troca de tela e guarda os parâmetros
//   parametros                  -> o que a tela de destino deve aplicar ao abrir
//   limpar()                    -> a tela de destino chama depois de aplicar
export const NavegacaoContext = createContext({
  irPara: () => {},
  parametros: null,
  limpar: () => {},
});

export const useNavegacao = () => useContext(NavegacaoContext);

// ids do menu (ver Sidebar.js / App.js)
export const MENU = {
  DASHBOARD: 1,
  ORDENS: 2,
  CLIENTES: 3,
  CONFIGURACOES: 4,
  EQUIPAMENTOS: 6,
  MARCAS: 7,
  MATERIAIS: 8,
};
