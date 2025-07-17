import { useState } from 'react';

// Login component takes an onLogin callback to call on successful login
function Login({ onLogin }: { onLogin: () => void }) {
  // States to store the entered username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // State to show error messages
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submit reload
    // Check if username and password match "admin"
    if (username === 'admin' && password === 'admin') {
      onLogin(); // call the passed-in callback to indicate successful login
    } else {
      setError('Invalid credentials'); // show error if wrong
    }
  };

  return (
    <div
      style={{
        height: '100vh', // full viewport height
        width: '100vw',  // full viewport width
        display: 'flex', // use flexbox to center form
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ffffffff', // white background; can change for dark mode
      }}
    >
      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',       // white background for form
          color: 'black',            // force black text for readability
          padding: '2rem',           // spacing inside form
          borderRadius: '8px',       // rounded corners
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)', // subtle shadow for depth
          minWidth: '300px',         // minimum width so form doesn't shrink too much
        }}
      >
        {/* Form title */}
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Admin Console</h2>

        {/* Username input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />

        {/* Error message shown only if error state is set */}
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        {/* Submit button */}
        <button type="submit" style={{ width: '100%' }}>
          Enter
        </button>
      </form>
    </div>
  );
}

export default Login;