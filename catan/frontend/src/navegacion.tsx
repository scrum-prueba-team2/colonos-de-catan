import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Pantalla = 
    'login' | 
    'lobby' |
    'partida'
    ;

interface NavigationContextType {
  pantallaActual: Pantalla;
  navegarA: (pantalla: Pantalla) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('partida');

  const navegarA = (pantalla: Pantalla) => {
    setPantallaActual(pantalla);
  };

  return (
    <NavigationContext.Provider value={{ pantallaActual, navegarA }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation debe usarse dentro de NavigationProvider');
  }
  return context;
}