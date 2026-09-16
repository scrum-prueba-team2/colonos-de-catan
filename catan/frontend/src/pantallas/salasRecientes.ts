export interface SalaReciente {
  id: string;
  creadaEn: number;
}

const CLAVE = "catan_salas_recientes";
const MAX_SALAS_GUARDADAS = 5;

/**
 * Guarda el código de una sala recién creada en localStorage. No es un
 * reemplazo de un listado real del backend, pero permite que, en el mismo
 * navegador, otra pestaña vea la sala que acabas de crear sin escribir
 * el código a mano.
 */
export function guardarSalaReciente(id: string): void {
  const actuales = leerSalasRecientes();
  const sinDuplicados = actuales.filter((sala) => sala.id !== id);
  const nuevas = [{ id, creadaEn: Date.now() }, ...sinDuplicados].slice(0, MAX_SALAS_GUARDADAS);

  try {
    localStorage.setItem(CLAVE, JSON.stringify(nuevas));
  } catch {
    // localStorage puede fallar en modo incógnito estricto; no es crítico.
  }
}

export function leerSalasRecientes(): SalaReciente[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return [];
    return JSON.parse(crudo) as SalaReciente[];
  } catch {
    return [];
  }
}