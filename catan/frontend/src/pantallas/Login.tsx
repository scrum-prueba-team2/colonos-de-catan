import { useNavigation } from '../context/useNavigation';

function Login() {
  const { navegarA } = useNavigation();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pantalla Login</h1>
      <button onClick={() => navegarA('lobby')}>
        Ir a Lobby
      </button>
    </div>
  );
}

export default Login;