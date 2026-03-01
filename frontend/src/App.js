import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout comum (Header + Navbar + Footer)
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// NOVA DASHBOARD (substitui a antiga Dashboard page)
import Sidebar from './components/Sidebar';
import MetricsGrid from './components/MetricsGrid';
import OrdersTable from './components/OrdersTable';

// Telas
import Login from "./pages/Auth/Login";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* TELA 1: Login (SEM layout) */}
                    <Route path="/login" element={<Login />} />

                    {/* TELA 2: NOVA DASHBOARD HOME (COM layout completo) */}
                    <Route path="/" element={
                        <>
                            <Header/>
                            <div className="flex min-h-screen"> {/* Container flex para sidebar + main */}
                                <Sidebar />
                                <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                                    <MetricsGrid />
                                    <OrdersTable />
                                </main>
                            </div>                           
                        </>
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
