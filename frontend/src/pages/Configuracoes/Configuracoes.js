import React, { useState } from "react";
import { FiUserCheck, FiShield, FiSettings, FiList } from "react-icons/fi";
import Funcionarios from "../Funcionarios/Funcionarios";
import Papeis from "../Papeis/Papeis";
import Auditoria from "../Auditoria/Auditoria";
import { usePermissoes } from "../../utils/permissoes";

const abas = [
  { id: "funcionarios", label: "Funcionários", icon: FiUserCheck, Componente: Funcionarios },
  { id: "papeis", label: "Papéis", icon: FiShield, Componente: Papeis },
  { id: "auditoria", label: "Auditoria", icon: FiList, Componente: Auditoria },
];

const Configuracoes = () => {
  const { isAdmin } = usePermissoes();
  const [abaAtiva, setAbaAtiva] = useState("funcionarios");

  // Configurações inteira é para administrador; o backend também bloqueia.
  if (!isAdmin) {
    return (
      <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        Apenas administradores podem acessar as configurações.
      </div>
    );
  }

  const AbaAtivaComponente = abas.find((a) => a.id === abaAtiva)?.Componente;

  return (
    <div>
      <main className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiSettings className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Configurações</h2>
            <p className="text-xs text-gray-500">
              Gerencie funcionários, papéis/perfis de acesso e acompanhe o log de auditoria.
            </p>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex gap-1">
            {abas.map((aba) => {
              const Icon = aba.icon;
              const ativa = aba.id === abaAtiva;
              return (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2
                    text-sm font-medium border-b-2 -mb-px
                    transition-colors
                    ${
                      ativa
                        ? "border-blue-600 text-blue-900"
                        : "border-transparent text-gray-500 hover:text-blue-700 hover:border-blue-200"
                    }
                  `}
                >
                  <Icon className="text-base" />
                  <span>{aba.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>{AbaAtivaComponente && <AbaAtivaComponente />}</div>
      </main>
    </div>
  );
};

export default Configuracoes;
