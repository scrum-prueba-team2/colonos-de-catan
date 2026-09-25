export const LARGO_MINIMO_NOMBRE = 2;
export const LARGO_MAXIMO_NOMBRE = 20;

// Devuelve el mensaje de error, o null si el nombre es válido.
export function validarNombreJugador(nombre: string): string | null {
  const limpio = nombre.trim();

  if (!limpio) return "Escribe un nombre para continuar.";
  if (limpio.length < LARGO_MINIMO_NOMBRE) {
    return `El nombre debe tener al menos ${LARGO_MINIMO_NOMBRE} caracteres.`;
  }
  if (limpio.length > LARGO_MAXIMO_NOMBRE) {
    return `El nombre no puede superar los ${LARGO_MAXIMO_NOMBRE} caracteres.`;
  }

  return null;
}
