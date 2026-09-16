import React from "react";
import logo from "../img/logos-icon.png";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/AuthService";
import {logoutSuccess} from "../store/authSlice";

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

        <div className="flex items-center gap-5">
          <button
              type="button"
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