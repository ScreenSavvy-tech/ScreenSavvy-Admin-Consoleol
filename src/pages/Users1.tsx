import { useState } from 'react';
import type { CSSProperties } from 'react';

// Define the shape of a User object
type User = {
  id: number;
  name: string;
  email: string;
  signupDate: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: string;
  screenTime: string;
};

// Initial list of users (fake data)
const initialUsers: User[] = [
  { id: 1, name: 'Andrew L.', email: 'andrew@example.com', signupDate: '2023-04-12', status: 'active', role: 'admin', lastLogin: '2025-07-10', screenTime: '3.5 hrs/day' },
  { id: 2, name: 'Sarah K.', email: 'sarah@example.com', signupDate: '2023-06-01', status: 'inactive', role: 'viewer', lastLogin: '2025-06-15', screenTime: '2 hrs/day' },
  { id: 3, name: 'David R.', email: 'david@example.com', signupDate: '2023-01-30', status: 'active', role: 'editor', lastLogin: '2025-07-01', screenTime: '4 hrs/day' },
  { id: 4, name: 'Maya T.', email: 'maya@example.com', signupDate: '2023-03-17', status: 'inactive', role: 'viewer', lastLogin: '2025-06-28', screenTime: '1.8 hrs/day' },
  { id: 5, name: 'Hodayah H.', email: 'hodayah@example.com', signupDate: '2024-05-19', status: 'active', role: 'viewer', lastLogin: '2025-06-31', screenTime: '2.6 hrs/day' },
];

function Users1() {
  // Manage the users state, initialized with the fake users
  const [users, setUsers] = useState<User[]>(initialUsers);

  // State for the search input box
  const [search, setSearch] = useState('');

  // State for filtering only active users checkbox
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // State for current sorting option
  const [sortBy, setSortBy] = useState<'signupAsc' | 'signupDesc' | 'nameAsc' | 'nameDesc' | 'lastLoginAsc' | 'lastLoginDesc'>('signupAsc');

  // State for currently editing user (null if none)
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filter users based on search text and active status toggle
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = showActiveOnly ? user.status === 'active' : true;
    return matchesSearch && matchesStatus;
  });

  // Sort the filtered users according to selected sort option
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

  // Save the edits made to a user and update the users list
  const handleSaveEdit = () => {
    if (!editingUser) return;
    const updated = users.map(u => (u.id === editingUser.id ? editingUser : u));
    setUsers(updated);
    setEditingUser(null);
  };

  // Delete a user after confirmation
  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '1rem' }}>Accounts</h2>

      {/* Search, filter, and sort controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', width: '250px' }}
        />
        {/* Show active only checkbox */}
        <label>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />{' '}
          Show active only
        </label>
        {/* Sort select dropdown */}
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

      {/* Users table */}
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
                {/* Edit button triggers the edit form for that user */}
                <button onClick={() => setEditingUser(user)} style={editBtn}>Edit</button>
                {/* Delete button triggers delete confirmation */}
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ ...editBtn, marginLeft: '0.5rem', background: '#f88' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {/* If no users after filtering, show this message */}
          {sortedUsers.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: '1rem', textAlign: 'center' }}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit form, shown only when editingUser is set */}
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

// CSS styles for table headers
const th: CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem',
  borderBottom: '1px solid #ccc',
};

// CSS styles for table cells
const td: CSSProperties = {
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
};

// CSS styles for buttons
const editBtn: CSSProperties = {
  padding: '0.3rem 0.6rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

export default Users1;