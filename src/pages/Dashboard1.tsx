import type { CSSProperties } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';

// Main dashboard component
function Dashboard1() {
  const stats = {
    totalUsers: 5,
    activeUsers: 3,
    avgScreenTime: '2.8 hrs/day',
    lastLoginPeak: '2025-07-10',
  };

  // Data for charts
  const screenTimeData = [
    { day: 'Mon', hours: 2.1 },
    { day: 'Tue', hours: 2.6 },
    { day: 'Wed', hours: 3.4 },
    { day: 'Thu', hours: 3.9 },
    { day: 'Fri', hours: 4.2 },
    { day: 'Sat', hours: 2.8 },
    { day: 'Sun', hours: 1.7 },
  ];

  const challengeData = [
    { name: 'Focus', value: 40 },
    { name: 'Health', value: 30 },
    { name: 'Social', value: 20 },
    { name: 'Other', value: 10 },
  ];

  const barData = [
    { week: 'Week 1', redemptions: 12 },
    { week: 'Week 2', redemptions: 18 },
    { week: 'Week 3', redemptions: 9 },
    { week: 'Week 4', redemptions: 15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '1rem' }}>Admin Dashboard</h2>

      {/* Summary stat boxes */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <StatBox title="Total Users" value={stats.totalUsers} />
        <StatBox title="Active Users" value={stats.activeUsers} />
        <StatBox title="Avg Screen Time" value={stats.avgScreenTime} />
        <StatBox title="Last Login Peak" value={stats.lastLoginPeak} />
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Analytics & Reporting</h3>

      {/* Chart section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', width: '100%' }}>
        {/* Line Chart */}
        <div style={chartContainerStyle}>
          <h4 style={{ color: '#333' }}>Daily Screen Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={screenTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={chartContainerStyle}>
          <h4 style={{ color: '#333' }}>Challenge Type Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={challengeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              >
                {challengeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={chartContainerStyle}>
          <h4 style={{ color: '#333' }}>Weekly Reward Redemptions</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="redemptions" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Box component for displaying a single stat
function StatBox({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={statBox}>
      <div style={statTitle}>{title}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

// Style objects
const statBox: CSSProperties = {
  background: '#f0f0f0',
  padding: '1rem',
  borderRadius: '8px',
  minWidth: '150px',
  textAlign: 'center',
  color: 'black',
};

const statTitle: CSSProperties = {
  fontSize: '0.9rem',
  color: '#555',
  marginBottom: '0.3rem',
};

const statValue: CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
};

const chartContainerStyle: CSSProperties = {
  background: 'white',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
};

export default Dashboard1;