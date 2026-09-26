// Sidebar.jsx
import React from "react";
import {
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaLaptop,
  FaTags,
  FaBoxes,
} from "react-icons/fa";

// Funcionários e Papéis não aparecem mais aqui: viraram submenus dentro de
// Configurações (id 4).
const initialItems = [
  { id: 1, icon: FaChartLine, label: "Dashboard" },
  { id: 2, icon: FaShoppingCart, label: "Ordem Servico" },
  { id: 3, icon: FaUsers, label: "Clientes" },
  { id: 6, icon: FaLaptop, label: "Equipamentos" },
  { id: 7, icon: FaTags, label: "Marcas e Modelos" },
  { id: 8, icon: FaBoxes, label: "Materiais" },
  { id: 4, icon: FaCog, label: "Configurações" },
];

const Sidebar = ({ activeMenuId, onMenuChange }) => {
  return (
    <aside className="w-60 bg-blue-100 text-blue-900 p-5 flex flex-col">
      {initialItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onMenuChange(item.id)}
          className={`
            flex items-center w-full text-left
            px-3 py-2 rounded-md mb-2
            cursor-pointer gap-3
            text-sm font-semibold
            transition-colors duration-300
            hover:bg-blue-200 hover:text-blue-900
            ${activeMenuId === item.id ? "bg-blue-200 text-blue-900" : ""}
          `}
        >
          <item.icon className="text-[18px]" />
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
