import { useState } from 'react';
import Login from './components/Login/Login';
import MainApp from './components/MainApp/MainApp';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <MainApp user={user} />;
}

export default App;
