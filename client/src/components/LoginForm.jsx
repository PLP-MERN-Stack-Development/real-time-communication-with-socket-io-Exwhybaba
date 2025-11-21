import { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LoginForm = () => {
  const { connect, isConnected } = useSocketContext();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [savedUsername, setSavedUsername] = useLocalStorage('chat-username', '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setSavedUsername(username);
      connect({ username: username.trim(), room });
    }
  };

  if (isConnected) {
    return null;
  }

  return (
    <div className="login-form">
      <div className="login-container">
        <h1>Join Chat</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="room">Room:</label>
            <select
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="general">General</option>
              <option value="random">Random</option>
              <option value="tech">Tech</option>
              <option value="gaming">Gaming</option>
            </select>
          </div>

          <button type="submit" className="join-button">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;