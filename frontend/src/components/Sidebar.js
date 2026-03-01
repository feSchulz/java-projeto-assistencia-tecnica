import React, { useState } from "react";
import { FaChartLine, FaShoppingCart, FaUsers, FaCog } from "react-icons/fa";

const initialItems = [
  { id: 1, icon: FaChartLine, label: "Dashboard", active: true },
  { id: 2, icon: FaShoppingCart, label: "Pedidos", active: false },
  { id: 3, icon: FaUsers, label: "Clientes", active: false },
  { id: 4, icon: FaCog, label: "Configurações", active: false },
];

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState(initialItems);

  // Função para clicar em um item
  const handleClick = (clickedId) => {
    setMenuItems(
      menuItems.map((item) => ({
        ...item,
        active: item.id === clickedId,
      })),
    );
  };

  return (
    <aside className="w-60 bg-blue-100 text-blue-900 p-5 flex flex-col">
      {menuItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleClick(item.id)} // ← chama função correta
          className={`
            flex items-center w-full text-left
            px-3 py-2 rounded-md mb-2
            cursor-pointer gap-3
            text-sm font-semibold
            transition-colors duration-300
            hover:bg-blue-200 hover:text-blue-900
            ${item.active ? "bg-blue-200 text-blue-900" : ""}
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
