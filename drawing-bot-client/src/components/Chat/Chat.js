import { useState, useRef, useEffect } from 'react';
import './Chat.css';

const Chat = ({ messages, onSubmit }) => {
  const [input, setInput] = useState('');
  const endRef = useRef();

  const handleSend = () => {
    if (!input.trim()) return;
    onSubmit(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message"
        />
        <button className="send" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
