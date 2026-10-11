import { useSelector } from "react-redux";

// O papel do usuário vem do login (state.auth.user.papel). Depois de recarregar a
// página só o token fica salvo, então o papel também é lido do próprio token JWT
// (claim "papel"). Isto só controla o que aparece na tela; quem realmente bloqueia
// o acesso é o backend (SecurityFilterChain).
export const papelDoToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json).papel || null;
  } catch {
    return null;
  }
};

export const ehAdmin = (papel) => String(papel || "").toLowerCase() === "adm";

// Hook: { papel, isAdmin } do usuário logado.
export const usePermissoes = () => {
  const { user, token } = useSelector((state) => state.auth);
  const papel = user?.papel || papelDoToken(token);
  return { papel, isAdmin: ehAdmin(papel) };
};
