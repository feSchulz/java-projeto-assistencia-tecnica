import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Rodapé de paginação das listas. `page` começa em 0 (igual ao backend).
const Paginacao = ({ page, totalPages, totalElements, size, onChange }) => {
  if (!totalElements) return null;

  const inicio = page * size + 1;
  const fim = Math.min((page + 1) * size, totalElements);

  const botao =
    "inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500">
      <span>
        Mostrando {inicio}–{fim} de {totalElements}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={botao}
          disabled={page <= 0}
          onClick={() => onChange(page - 1)}
        >
          <FiChevronLeft /> Anterior
        </button>
        <span>
          Página {page + 1} de {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          className={botao}
          disabled={page + 1 >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Próxima <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Paginacao;
