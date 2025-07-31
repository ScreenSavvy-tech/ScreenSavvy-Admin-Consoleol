import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AppColors } from '../style/app_colors';
import { AppTextStyles } from '../style/app_text_styles';
import { AppSpacing } from '../style/app_spacing';
import { AppRadius } from '../style/app_radius';
import { AppShadows } from '../style/app_shadows';

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

const initialUsers: User[] = [
  { id: 1, name: 'Andrew L.', email: 'andrew@example.com', signupDate: '2023-04-12', status: 'active', role: 'admin', lastLogin: '2025-07-10', screenTime: '3.5 hrs/day' },
  { id: 2, name: 'Sarah K.', email: 'sarah@example.com', signupDate: '2023-06-01', status: 'inactive', role: 'viewer', lastLogin: '2025-06-15', screenTime: '2 hrs/day' },
  { id: 3, name: 'David R.', email: 'david@example.com', signupDate: '2023-01-30', status: 'active', role: 'editor', lastLogin: '2025-07-01', screenTime: '4 hrs/day' },
  { id: 4, name: 'Maya T.', email: 'maya@example.com', signupDate: '2023-03-17', status: 'inactive', role: 'viewer', lastLogin: '2025-06-28', screenTime: '1.8 hrs/day' },
  { id: 5, name: 'Hodayah H.', email: 'hodayah@example.com', signupDate: '2024-05-19', status: 'active', role: 'viewer', lastLogin: '2025-06-30', screenTime: '2.6 hrs/day' },
];

function Users1() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'signupAsc' | 'signupDesc' | 'nameAsc' | 'nameDesc' | 'lastLoginAsc' | 'lastLoginDesc'>('signupAsc');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = showActiveOnly ? user.status === 'active' : true;
    return matchesSearch && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'signupAsc': return new Date(a.signupDate).getTime() - new Date(b.signupDate).getTime();
      case 'signupDesc': return new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime();
      case 'nameAsc': return a.name.localeCompare(b.name);
      case 'nameDesc': return b.name.localeCompare(a.name);
      case 'lastLoginAsc': return new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
      case 'lastLoginDesc': return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      default: return 0;
    }
  });

  const handleSaveEdit = () => {
    if (!editingUser) return;
    const updated = users.map(u => (u.id === editingUser.id ? editingUser : u));
    setUsers(updated);
    setEditingUser(null);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="page-content" style={{ padding: AppSpacing.screenPadding, background: AppColors.backgroundDark }}>
      <h2 style={{ ...AppTextStyles.headingLarge, marginBottom: AppSpacing.medium, color: AppColors.textPrimary }}>Accounts</h2>

      <div style={{ marginBottom: AppSpacing.large, display: 'flex', gap: AppSpacing.medium, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: AppSpacing.small, width: '250px', borderRadius: AppRadius.small }}
        />
        <label style={{ ...AppTextStyles.bodySmall, color: AppColors.textSecondary }}>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />{' '}
          Show active only
        </label>
        <label style={{ ...AppTextStyles.bodySmall, color: AppColors.textSecondary }}>
          Sort by:{' '}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ borderRadius: AppRadius.small, padding: AppSpacing.xsmall }}
          >
            <option value="signupAsc">Signup Date (Oldest → Newest)</option>
            <option value="signupDesc">Signup Date (Newest → Oldest)</option>
            <option value="nameAsc">Name (A → Z)</option>
            <option value="nameDesc">Name (Z → A)</option>
            <option value="lastLoginAsc">Last Login (Oldest → Newest)</option>
            <option value="lastLoginDesc">Last Login (Newest → Oldest)</option>
          </select>
        </label>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: AppColors.surfaceLight, borderRadius: AppRadius.medium, boxShadow: AppShadows.softShadowDark }}>
        <thead style={{ background: AppColors.surfaceDark }}>
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
                <button onClick={() => handleDelete(user.id)} style={{ ...editBtn, marginLeft: AppSpacing.xsmall, background: AppColors.error }}>Delete</button>
              </td>
            </tr>
          ))}
          {sortedUsers.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: AppSpacing.large, textAlign: 'center', color: AppColors.textSecondary }}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div style={{ marginTop: AppSpacing.xlarge, padding: AppSpacing.large, border: `1px solid ${AppColors.borderLight}`, borderRadius: AppRadius.medium }}>
          <h3 style={{ ...AppTextStyles.headingSmall, marginBottom: AppSpacing.small }}>Edit User: {editingUser.name}</h3>
          <label style={AppTextStyles.bodySmall}>
            Name:{' '}
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              style={{ marginLeft: AppSpacing.xsmall, padding: AppSpacing.xsmall, borderRadius: AppRadius.small }}
            />
          </label>
          <br />
          <label style={{ ...AppTextStyles.bodySmall, marginTop: AppSpacing.small }}>
            Status:{' '}
            <select
              value={editingUser.status}
              onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as User['status'] })}
              style={{ marginLeft: AppSpacing.xsmall, borderRadius: AppRadius.small, padding: AppSpacing.xsmall }}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </label>
          <br />
          <button onClick={handleSaveEdit} style={{ marginTop: AppSpacing.small, padding: AppSpacing.small, borderRadius: AppRadius.small, background: AppColors.accentOrange, color: AppColors.textOnPrimary }}>Save</button>
          <button onClick={() => setEditingUser(null)} style={{ marginLeft: AppSpacing.small, padding: AppSpacing.small, borderRadius: AppRadius.small, background: AppColors.surfaceDark, color: AppColors.textOnPrimary }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

const th: CSSProperties = {
  ...AppTextStyles.bodySmall,
  textAlign: 'left',
  padding: AppSpacing.small,
  borderBottom: `1px solid ${AppColors.borderLight}`,
  color: AppColors.textPrimary,
};

const td: CSSProperties = {
  ...AppTextStyles.bodySmall,
  padding: AppSpacing.small,
  borderBottom: `1px solid ${AppColors.borderLight}`,
  color: AppColors.textSecondary,
};

const editBtn: CSSProperties = {
  padding: `${AppSpacing.xsmall} ${AppSpacing.small}`,
  fontSize: '0.9rem',
  cursor: 'pointer',
  borderRadius: AppRadius.small,
  background: AppColors.accentOrange,
  color: AppColors.textOnPrimary,
};

export default Users1;