import { useEffect, useState } from 'react';

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '1rem' }}>Settings</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Light/Dark Theme</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <label>Placeholder</label>
        <label>Placeholder</label>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Placeholder</span>
          <input type="range" disabled style={{ width: '60%' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Placeholder</span>
          <select disabled>
            <option>Option 1</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;