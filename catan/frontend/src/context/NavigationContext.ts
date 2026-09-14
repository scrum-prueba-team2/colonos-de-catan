import { createContext } from 'react';

type Pantalla =
  | 'home'
  | 'elegirModo'
  | 'lobby'
  | 'salaEspera'
  | 'partida';

interface NavigationContextType {
  pantallaActual: Pantalla;
  navegarA: (pantalla: Pantalla) => void;
}

export const NavigationContext =
  createContext<NavigationContextType | undefined>(undefined);