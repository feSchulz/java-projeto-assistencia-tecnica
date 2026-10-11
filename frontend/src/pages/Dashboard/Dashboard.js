import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Dashboard.module.css";
import MetricsGrid from "../../components/MetricsGrid";
import OrdersTable from "../../components/OrdersTable";
import DashboardInsights from "../../components/DashboardInsights";
import { listarOrdensServico } from "../../services/OrdemServicoService";
import { listarClientes } from "../../services/ClienteService";
import { listarMateriais } from "../../services/MaterialEstoqueService";

// Dados reais vindos da API. Lista vazia (ou falha pontual) não é erro:
// os cards mostram 0 e a tabela mostra a mensagem de "nenhuma ordem".
const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);

  const [ordens, setOrdens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let ativo = true;
    setLoading(true);

    Promise.all([
      listarOrdensServico(token).catch((err) => {
        console.error("Erro ao carregar ordens de serviço:", err);
        return [];
      }),
      listarClientes(token).catch((err) => {
        console.error("Erro ao carregar clientes:", err);
        return [];
      }),
      listarMateriais(token).catch((err) => {
        console.error("Erro ao carregar materiais:", err);
        return [];
      }),
    ]).then(([os, cli, mat]) => {
      if (!ativo) return;
      setOrdens(Array.isArray(os) ? os : []);
      setClientes(Array.isArray(cli) ? cli : []);
      setMateriais(Array.isArray(mat) ? mat : []);
      setLoading(false);
    });

    return () => {
      ativo = false;
    };
  }, [token, recarga]);

  return (
    <div>
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <MetricsGrid ordens={ordens} clientes={clientes} materiais={materiais} loading={loading} />
        <DashboardInsights ordens={ordens} loading={loading} />
        <OrdersTable
          ordens={ordens}
          loading={loading}
          onChanged={() => setRecarga((n) => n + 1)}
        />
      </main>
    </div>
  );
};

export default Dashboard;
