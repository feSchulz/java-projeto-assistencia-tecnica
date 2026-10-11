import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import React from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard/Dashboard";
import OrdemServico from "./pages/OrdemServico/OrdemServico";
import Clientes from "./pages/Clientes/Clientes";
import Equipamentos from "./pages/Equipamentos/Equipamentos";
import Marcas from "./pages/Marcas/Marcas";
import Materiais from "./pages/Materiais/Materiais";
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import Perfil from "./pages/Perfil/Perfil";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import { NavegacaoContext } from "./context/NavegacaoContext";

// Layout comum (Header + Sidebar) usado tanto pela tela principal (menus por
// activeMenuId) quanto pela tela de Perfil, que é uma rota de verdade
// (/app/perfil), acessada pelo botão de usuário no Header.
const AppLayout = ({ activeMenuId, onMenuChange, children }) => (
    <>
        <Header />
        <div className="flex min-h-screen">
            <Sidebar activeMenuId={activeMenuId} onMenuChange={onMenuChange} />
            <main className="flex-1 p-6 overflow-y-auto bg-gray-50">{children}</main>
        </div>
    </>
);

const AppShell = () => {
    const [activeMenuId, setActiveMenuId] = React.useState(1);
    // Filtro que uma tela manda para outra (ex.: card "Ordens atrasadas" -> lista de OS)
    const [parametros, setParametros] = React.useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Clicar em um item do menu sempre volta para a tela principal (/app),
    // mesmo que o usuário esteja em uma rota separada como /app/perfil.
    const handleMenuChange = (id) => {
        setActiveMenuId(id);
        if (location.pathname !== "/app") {
            navigate("/app");
        }
    };

    const irPara = React.useCallback(
        (id, params = null) => {
            setParametros(params);
            setActiveMenuId(id);
            if (location.pathname !== "/app") {
                navigate("/app");
            }
        },
        [location.pathname, navigate],
    );
    const limpar = React.useCallback(() => setParametros(null), []);
    const navegacao = React.useMemo(() => ({ irPara, parametros, limpar }), [irPara, parametros, limpar]);

    return (
        <NavegacaoContext.Provider value={navegacao}>
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route
                path="/app"
                element={
                    <PrivateRoute>
                        <AppLayout activeMenuId={activeMenuId} onMenuChange={handleMenuChange}>
                            {activeMenuId === 1 && <Dashboard />}
                            {activeMenuId === 2 && <OrdemServico />}
                            {activeMenuId === 3 && <Clientes />}
                            {/* Funcionários e Papéis agora são submenus dentro de Configurações */}
                            {activeMenuId === 4 && <Configuracoes />}
                            {activeMenuId === 6 && <Equipamentos />}
                            {activeMenuId === 7 && <Marcas />}
                            {activeMenuId === 8 && <Materiais />}
                        </AppLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/app/perfil"
                element={
                    <PrivateRoute>
                        <AppLayout activeMenuId={activeMenuId} onMenuChange={handleMenuChange}>
                            <Perfil />
                        </AppLayout>
                    </PrivateRoute>
                }
            />
        </Routes>
        </NavegacaoContext.Provider>
    );
};

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AppShell />
            </BrowserRouter>
        </div>
    );
}

export default App;
