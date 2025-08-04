import React, { useState } from 'react';
import { login } from '../../services/apiService';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(username, password);
      onLoginSuccess(user);  
    } catch (err) {
      console.error('Error while connecting:', err);
      setError('Incorrect username or password');
    }
  };

  return (
    <div className="login-wrapper">
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="submit-wrapper">
        <button type="submit">Log in</button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
    </div>
  );
};

export default Login;
