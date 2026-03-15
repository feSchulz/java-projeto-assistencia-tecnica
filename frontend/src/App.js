// App.js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Telas que você vai criar
import Dashboard from "./pages/Dashboard/Dashboard.js";
import OrdemServico from "./pages/OrdemServico/OrdemServico.js";
import Clientes from "./pages/Clientes/Clientes.js";
import Configuracoes from "./pages/Configuracoes/Configuracoes.js";

import Login from "./pages/Auth/Login";

function App() {
  // Estado do menu ativo
  const [activeMenuId, setActiveMenuId] = React.useState(1); // padrão: Dashboard

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Tela de login sem layout */}
          <Route path="/login" element={<Login />} />

          {/* Layout principal (com Header + Sidebar + Main) */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <div className="flex min-h-screen">
                  <Sidebar
                    activeMenuId={activeMenuId}
                    onMenuChange={setActiveMenuId}
                  />
                  <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    {/* Renderiza o componente baseado no menu ativo */}
                    {activeMenuId === 1 && <Dashboard />}
                    {activeMenuId === 2 && <OrdemServico />}
                    {activeMenuId === 3 && <Clientes />}
                    {activeMenuId === 4 && <Configuracoes />}
                  </main>
                </div>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
