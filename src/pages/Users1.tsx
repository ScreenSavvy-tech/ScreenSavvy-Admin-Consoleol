import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

// Define the shape of a User object (make sure it matches your backend data shape)
type User = {
  id: number;           // or string, depending on your backend — adjust if needed
  name: string;
  email: string;
  signupDate: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: string;
  screenTime: string;
};

// Remove initialUsers constant since you'll load data dynamically

function Users1() {
  // Start with empty user list, fetch will fill it
  const [users, setUsers] = useState<User[]>([]);

  // Add loading and error states (optional but recommended)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search/filter/sort states unchanged
  const [search, setSearch] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'signupAsc' | 'signupDesc' | 'nameAsc' | 'nameDesc' | 'lastLoginAsc' | 'lastLoginDesc'>('signupAsc');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users from backend once on component mount
  useEffect(() => {
    fetch('http://localhost:5173/api/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter users based on search and active toggle
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = showActiveOnly ? user.status === 'active' : true;
    return matchesSearch && matchesStatus;
  });

  // Sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'signupAsc':
        return new Date(a.signupDate).getTime() - new Date(b.signupDate).getTime();
      case 'signupDesc':
        return new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime();
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'lastLoginAsc':
        return new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
      case 'lastLoginDesc':
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      default:
        return 0;
    }
  });

  // Save edits (same as before)
  const handleSaveEdit = () => {
    if (!editingUser) return;
    const updated = users.map(u => (u.id === editingUser.id ? editingUser : u));
    setUsers(updated);
    setEditingUser(null);
  };

  // Delete user (same as before)
  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;
    setUsers(users.filter(u => u.id !== id));
  };

  // Show loading or error states before UI
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error}</div>;

  // Your existing UI below, unchanged (except users data comes from backend)
  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '1rem' }}>Accounts</h2>

      {/* Search, filter, and sort controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', width: '250px' }}
        />
        <label>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />{' '}
          Show active only
        </label>
        <label>
          Sort by:{' '}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="signupAsc">Signup Date (Oldest → Newest)</option>
            <option value="signupDesc">Signup Date (Newest → Oldest)</option>
            <option value="nameAsc">Name (A → Z)</option>
            <option value="nameDesc">Name (Z → A)</option>
            <option value="lastLoginAsc">Last Login (Oldest → Newest)</option>
            <option value="lastLoginDesc">Last Login (Newest → Oldest)</option>
          </select>
        </label>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#ddd' }}>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Signup Date</th>
            <th style={th}>Status</th>
            <th style={th}>Role</th>
            <th style={th}>Last Login</th>
            <th style={th}>Screen Time</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.id}>
              <td style={td}>{user.name}</td>
              <td style={td}>{user.email}</td>
              <td style={td}>{user.signupDate}</td>
              <td style={td}>{user.status}</td>
              <td style={td}>{user.role}</td>
              <td style={td}>{user.lastLogin}</td>
              <td style={td}>{user.screenTime}</td>
              <td style={td}>
                <button onClick={() => setEditingUser(user)} style={editBtn}>Edit</button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ ...editBtn, marginLeft: '0.5rem', background: '#f88' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {sortedUsers.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: '1rem', textAlign: 'center' }}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h3>Edit User: {editingUser.name}</h3>
          <label>
            Name:{' '}
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            />
          </label>
          <br />
          <label>
            Status:{' '}
            <select
              value={editingUser.status}
              onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as User['status'] })}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </label>
          <br />
          <button onClick={handleSaveEdit} style={{ marginTop: '0.5rem' }}>Save</button>
          <button onClick={() => setEditingUser(null)} style={{ marginLeft: '1rem' }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

const th: CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem',
  borderBottom: '1px solid #ccc',
};

const td: CSSProperties = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
};

const editBtn: CSSProperties = {
  padding: '0.3rem 0.6rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

export default Users1;