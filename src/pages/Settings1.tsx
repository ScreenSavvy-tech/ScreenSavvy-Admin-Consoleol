import { useEffect, useState } from 'react';

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
    return localStorage.getItem('maintenance') === 'true';
  });
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const [conversionRate, setConversionRate] = useState(1); // 1 min = X points
  const [maxDailyPoints, setMaxDailyPoints] = useState(250); // max points per day
  const [challengeCooldown, setChallengeCooldown] = useState(2); // in hours
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('maintenance', String(isMaintenanceMode));
  }, [isMaintenanceMode]);

  return (
    <div className="page-content">
      {isMaintenanceMode && (
        <div style={{
          backgroundColor: 'orange',
          padding: '0.5rem',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Maintenance Mode Active
        </div>
      )}

      <h2 style={{ marginBottom: '1rem' }}>Settings</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        {/* Theme toggle */}
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

        {/* Maintenance toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Maintenance Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isMaintenanceMode}
              onChange={() => {
                if (!isMaintenanceMode) {
                  setShowPasswordPrompt(true);
                } else {
                  setIsMaintenanceMode(false);
                }
              }}
            />
            <span className="slider"></span>
          </label>
        </div>

        {showPasswordPrompt && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <button
              onClick={() => {
                if (adminPassword === 'admin') {
                  setIsMaintenanceMode(true);
                  setShowPasswordPrompt(false);
                  setAdminPassword('');
                } else {
                  alert('Incorrect password.');
                }
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowPasswordPrompt(false);
                setAdminPassword('');
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* New settings below */}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '0.3rem' }}>
            Point Conversion Rate (1 minute = {conversionRate} points)
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={conversionRate}
            onChange={(e) => setConversionRate(parseInt(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>Max Daily Points per User</label>
          <input
            type="number"
            value={maxDailyPoints}
            onChange={(e) => setMaxDailyPoints(parseInt(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>Cooldown Between Challenges (hrs)</label>
          <input
            type="number"
            value={challengeCooldown}
            onChange={(e) => setChallengeCooldown(parseInt(e.target.value))}
            style={{ width: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Push Notifications</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Email Notifications</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Settings;