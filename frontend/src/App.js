import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import UserGreeting from './components/UserGreeting';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.message === 'Logged out successfully') {
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/check-auth', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.isAuthenticated) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Authentication check error:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="App">
      <h1>Login</h1>
      {user ? (
        <UserGreeting user={user} handleLogout={handleLogout} />
      ) : (
        <LoginForm handleLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
