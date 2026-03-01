import React from "react";
import logo from "../img/logos-icon.png";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slice/authSlice";
import * as authService from "../services/AuthService";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await authService.logout(token);
      }
      dispatch(logout());
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro no logout:", error);
      dispatch(logout());
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="flex items-center justify-between bg-blue-100 text-blue-900 px-5 py-3 shadow">
      {/* Esquerda (logo) */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-[150px] h-auto" />
      </div>

      {/* Direita (ícones) */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold py-1.5 px-3 rounded-md hover:bg-blue-200 transition-colors"
        >
          <FaUserCircle className="text-[18px]" />
          <span>Perfil</span>
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
