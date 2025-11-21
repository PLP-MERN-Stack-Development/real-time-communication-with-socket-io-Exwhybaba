import { SocketProvider } from './context/SocketContext';
import LoginForm from './components/LoginForm';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  return (
    <SocketProvider>
      <div className="App">
        <LoginForm />
        <ChatRoom />
      </div>
    </SocketProvider>
  );
}

export default App;