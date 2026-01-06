import React from 'react'
import logo from "../img/logos-icon.png";
import './Navbar.css';

// Importando ícones
import {
  FaTachometerAlt,
  FaClipboardList,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="sidebar">
      <ul className="nav-list">
        <li>
          <div className="nav-item">
            <a href="#">
              <FaTachometerAlt className="icon" /> Dashboard
            </a>
          </div>
        </li>
        <li>
          <div className="nav-item">
            <a href="#">
              <FaClipboardList className="icon" /> Orders
            </a>
          </div>
        </li>
        <li>
          <div className="nav-item">
            <a href="#">
              <FaUsers className="icon" /> Clients
            </a>
          </div>
        </li>
        <li>
          <div className="nav-item">
            <a href="#">
              <FaCog className="icon" /> Settings
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar