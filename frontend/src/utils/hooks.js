import { useEffect, useState } from "react";

// Devolve o valor só depois de ele parar de mudar por `delay` ms (usado nas buscas,
// para não consultar o servidor a cada tecla).
export const useDebouncedValue = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
