import React, { useState } from "react";
// import './Login.css';  ← COMENTE ou DELETE esta linha
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../slice/authSlice";
import * as authService from "../../services/AuthService";

const Login = () => {
    const dispatch = useDispatch();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        navigate("/", { replace: true }); // <- vai pro dashboard
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <img
                    src="/img/logos-icon.png"
                    alt="Logos ERP"
                    className="mx-auto h-32 w-auto mb-6"
                />
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Bem-vindo ao Logos
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Usuário ou E-mail"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <footer className="mt-6 pt-4 border-t border-gray-200">
                    <small className="text-xs text-gray-500 text-center block">
                        © 2025 Logos - Assistência Técnica
                    </small>
                </footer>
            </div>
        </div>
    );
};

export default Login;
