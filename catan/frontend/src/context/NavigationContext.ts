import { createContext } from 'react';

type Pantalla = 'home' | 'login' | 'lobby' | 'partida';

interface NavigationContextType {
  pantallaActual: Pantalla;
  navegarA: (pantalla: Pantalla) => void;
}

export const NavigationContext =
  createContext<NavigationContextType | undefined>(undefined);