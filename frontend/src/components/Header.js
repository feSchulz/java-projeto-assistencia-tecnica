import React, { useEffect, useRef, useState } from "react";
import logo from "../img/logos-icon.png";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/AuthService";
import {logoutSuccess} from "../store/authSlice";
import { FiSearch } from "react-icons/fi";
import { buscarGlobal } from "../services/BuscaService";
import { useDebouncedValue } from "../utils/hooks";
import { MENU, useNavegacao } from "../context/NavegacaoContext";

// Busca global: OS (nº, cliente, aparelho), clientes e equipamentos.
// Clicar num resultado abre a lista correspondente já filtrada.
const GRUPOS = [
  { chave: "ordens", titulo: "Ordens de serviço", menu: MENU.ORDENS },
  { chave: "clientes", titulo: "Clientes", menu: MENU.CLIENTES },
  { chave: "equipamentos", titulo: "Equipamentos", menu: MENU.EQUIPAMENTOS },
];

const BuscaGlobal = () => {
  const { token } = useSelector((state) => state.auth);
  const { irPara } = useNavegacao();
  const [texto, setTexto] = useState("");
  const [aberto, setAberto] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const caixa = useRef(null);
  const termo = useDebouncedValue(texto.trim());

  useEffect(() => {
    if (termo.length < 2) {
      setResultado(null);
      return undefined;
    }
    let ativo = true;
    setCarregando(true);
    buscarGlobal(termo, token)
      .then((r) => ativo && setResultado(r))
      .catch(() => ativo && setResultado({ ordens: [], clientes: [], equipamentos: [] }))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [termo, token]);

  // fecha o dropdown ao clicar fora
  useEffect(() => {
    const fora = (e) => {
      if (caixa.current && !caixa.current.contains(e.target)) setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  const escolher = (grupo, item) => {
    // OS filtra pelo número; cliente e equipamento pelo título (nome)
    const busca = grupo.chave === "ordens" ? String(item.id) : item.titulo;
    irPara(grupo.menu, { busca });
    setAberto(false);
    setTexto("");
    setResultado(null);
  };

  const total = resultado
    ? GRUPOS.reduce((soma, g) => soma + (resultado[g.chave]?.length || 0), 0)
    : 0;

  return (
    <div className="relative w-80" ref={caixa}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-sm" />
      <input
        type="text"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        placeholder="Buscar OS, cliente ou equipamento"
        aria-label="Busca global"
        className="w-full rounded-md border border-blue-200 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {aberto && texto.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-96 overflow-y-auto rounded-md border border-gray-100 bg-white shadow-lg">
          {carregando && !resultado ? (
            <div className="px-3 py-3 text-xs text-gray-500">Buscando...</div>
          ) : total === 0 ? (
            <div className="px-3 py-3 text-xs text-gray-500">Nada encontrado.</div>
          ) : (
            GRUPOS.map((grupo) =>
              (resultado?.[grupo.chave] || []).length === 0 ? null : (
                <div key={grupo.chave}>
                  <div className="bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-900">
                    {grupo.titulo}
                  </div>
                  {resultado[grupo.chave].map((item) => (
                    <button
                      key={`${grupo.chave}-${item.id}`}
                      type="button"
                      onClick={() => escolher(grupo, item)}
                      className="block w-full px-3 py-2 text-left hover:bg-blue-50"
                    >
                      <span className="block truncate text-sm text-gray-800">
                        {item.titulo}
                      </span>
                      {item.subtitulo && (
                        <span className="block truncate text-xs text-gray-500">{item.subtitulo}</span>
                      )}
                    </button>
                  ))}
                </div>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      dispatch(logoutSuccess());
      navigate("/login", { replace: true });
    }
  };

  return (
      <header className="flex items-center justify-between bg-blue-100 text-blue-900 px-5 py-3 shadow">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-[150px] h-auto" />
        </div>

        <BuscaGlobal />

        <div className="flex items-center gap-5">
          <button
              type="button"
              onClick={() => navigate("/app/perfil")}
              className="flex items-center gap-2 text-sm font-semibold py-1.5 px-3 rounded-md hover:bg-blue-200 transition-colors"
          >
            <FaUserCircle className="text-[18px]" />
            <span>{user?.name || "Perfil"}</span>
          </button>

          <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold py-1.5 px-3 rounded-md hover:bg-blue-200 transition-colors"
          >
            <FaSignOutAlt className="text-[18px]" />
            <span>Sair</span>
          </button>
        </div>
      </header>
  );
};

export default Header;