import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard/Dashboard";
import OrdemServico from "./pages/OrdemServico/OrdemServico";
import Clientes from "./pages/Clientes/Clientes";
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    const [activeMenuId, setActiveMenuId] = React.useState(1);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/app"
                        element={
                            <PrivateRoute>
                                <>
                                    <Header />
                                    <div className="flex min-h-screen">
                                        <Sidebar
                                            activeMenuId={activeMenuId}
                                            onMenuChange={setActiveMenuId}
                                        />
                                        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                                            {activeMenuId === 1 && <Dashboard />}
                                            {activeMenuId === 2 && <OrdemServico />}
                                            {activeMenuId === 3 && <Clientes />}
                                            {activeMenuId === 4 && <Configuracoes />}
                                        </main>
                                    </div>
                                </>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;