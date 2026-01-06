import React from "react";
import "./Header.css";
import logo from "../img/logos-icon.png";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <div className="header-right">
        <FaUserCircle className="icon profile-icon" />
        <FaSignOutAlt className="icon logout-btn" />
      </div>
    </header>
  );
};

export default Header;
