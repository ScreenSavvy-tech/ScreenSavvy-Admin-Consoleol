// React and router imports
import { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Page components
import Dashboard1 from './pages/Dashboard1';
import Users1 from './pages/Users1';
import Settings1 from './pages/Settings1';
import Challengesandpoints from './pages/Challengesandrewards.tsx';
import Login from './pages/Login';

// Global CSS
import './App.css';

function App() {
  // Track whether the admin is logged in
  const [loggedIn, setLoggedIn] = useState(false);

  // Apply saved theme on load before paint
  useLayoutEffect(() => {
    const saved = localStorage.getItem('theme');         // Get stored theme
    const isDark = saved === 'dark';                     // Check if dark mode is selected
    document.body.classList.toggle('dark-mode', isDark); // Apply dark mode
    document.body.classList.toggle('light-mode', !isDark); // Apply light mode otherwise
  }, []);

  // Force app to start on login screen on every refresh
  useEffect(() => {
    setLoggedIn(false);
  }, []);

  // Called when login is successful
  const handleLogin = () => {
    setLoggedIn(true);
  };

  // If not logged in, show the Login screen only
  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Once logged in, render the full app with routing
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="nav-bar">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/users" className="nav-link">Users</Link>
          <Link to="/settings" className="nav-link">Settings</Link>
          <Link to="/challengesandrewards" className="nav-link">Challenges & Rewards</Link>
        </nav>

        {/* Route Definitions */}
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