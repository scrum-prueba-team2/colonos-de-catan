import { NavigationProvider, useNavigation } from './navegacion';
import Login from './pantallas/Login';
import Lobby from './pantallas/Lobby';
import Partida from './pantallas/Partida';

const pantallasMap = {
  login: Login,
  lobby: Lobby,
  partida: Partida,
} as const;

function AppContent() {
  const { pantallaActual } = useNavigation();
  const PantallaActual = pantallasMap[pantallaActual as keyof typeof pantallasMap];
  return <PantallaActual />;
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;