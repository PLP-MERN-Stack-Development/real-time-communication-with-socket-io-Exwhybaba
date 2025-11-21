import { useState, useEffect, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';


const ChatRoom = () => {
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    sendMessage,
    sendPrivateMessage,
    setTyping
  } = useSocketContext();

  const [message, setMessage] = useState('');
  const [privateRecipient, setPrivateRecipient] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      if (privateRecipient) {
        sendPrivateMessage(privateRecipient, message);
        setPrivateRecipient('');
      } else {
        sendMessage(message);
      }
      setMessage('');
      setTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      setTyping(true);
    } else {
      setTyping(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Chat Room</h2>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      <div className="chat-container">
        {/* Users List */}
        <div className="users-panel">
          <h3>Online Users ({users.length})</h3>
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-item">
                <span className="user-status">🟢</span>
                <span className="username">{user.username}</span>
                <button
                  onClick={() => setPrivateRecipient(user.username)}
                  className="private-chat-btn"
                  title="Start private chat"
                >
                  💬
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-panel">
          <div className="messages-container">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message ${msg.type === 'private' ? 'private' : ''} ${msg.system ? 'system' : ''}`}
              >
                {msg.type === 'private' && (
                  <div className="private-indicator">🔒 Private</div>
                )}
                <div className="message-header">
                  <strong>{msg.sender}</strong>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">{msg.message}</div>
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="message-form">
            {privateRecipient && (
              <div className="private-chat-indicator">
                Private chat with: {privateRecipient}
                <button
                  type="button"
                  onClick={() => setPrivateRecipient('')}
                  className="cancel-private"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="input-group">
              <input
                type="text"
                value={message}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="message-input"
              />
              <button type="submit" disabled={!message.trim()} className="send-button">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;