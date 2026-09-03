import { useNavigation } from '../navegacion';

function Lobby() {
  const { navegarA } = useNavigation();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pantalla Lobby</h1>
      <button onClick={() => navegarA('login')}>
        Volver a Login
      </button>
    </div>
  );
}

export default Lobby;