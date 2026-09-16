import { useState } from 'react';
import type { ReactNode } from 'react';
import { NavigationContext } from './NavigationContext';

type Pantalla =
  | 'home'
  | 'elegirModo'
  | 'lobby'
  | 'salaEspera'
  | 'partida';

export function NavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pantallaActual, setPantallaActual] =
    useState<Pantalla>('home');

  const navegarA = (pantalla: Pantalla) => {
    setPantallaActual(pantalla);
  };

  return (
    <NavigationContext.Provider
      value={{ pantallaActual, navegarA }}
    >
      {children}
    </NavigationContext.Provider>
  );
}