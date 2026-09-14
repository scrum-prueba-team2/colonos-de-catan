import { NavigationProvider } from './context/navegacion';
import { useNavigation } from './context/useNavigation';

import Login from './pantallas/Login';
import Lobby from './pantallas/Lobby/Lobby';
import Partida from './pantallas/Partida';
import Home from './pantallas/Home/Home';

function AppContent() {
  const { pantallaActual, navegarA } = useNavigation();

  switch (pantallaActual) {
    case 'home':
      return (
        <Home
          onAbrirMenu={() => navegarA('lobby')}
        />
      );

    case 'login':
      return <Login />;

    case 'lobby':
      return (
        <Lobby
          onCrearSala={() => navegarA('partida')}
          onUnirseASala={(codigo) => {
            console.log('Uniéndose a sala', codigo);
            navegarA('partida');
          }}
        />
      );

    case 'partida':
      return <Partida />;

    default:
      return null;
  }
}
function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;