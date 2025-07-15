import { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard1 from './pages/Dashboard1';
import Users1 from './pages/Users1';
import Settings1 from './pages/Settings1';
import Challengesandpoints from './pages/Challengesandrewards.tsx';
import Login from './pages/Login';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // ✅ Apply saved theme on load
  useLayoutEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
  }, []);

  // Always start on login
  useEffect(() => {
    setLoggedIn(false);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="nav-bar">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/users" className="nav-link">Users</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
          <Link to="/challengesandrewards" className="nav-link">Challenges & Rewards</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard1 />} />
          <Route path="/users" element={<Users1 />} />
          <Route path="/settings" element={<Settings1 />} />
          <Route path="/challengesandrewards" element={<Challengesandpoints />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;