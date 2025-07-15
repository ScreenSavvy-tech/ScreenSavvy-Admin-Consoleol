import type { CSSProperties } from 'react';

function Dashboard1() {
  const stats = {
    totalUsers: 5,
    activeUsers: 3,
    avgScreenTime: '2.8 hrs/day',
    lastLoginPeak: '2025-07-10',
  };

  const screenTimeTrends = [
    { day: 'Mon', hours: 2.1 },
    { day: 'Tue', hours: 2.6 },
    { day: 'Wed', hours: 3.4 },
    { day: 'Thu', hours: 3.9 },
    { day: 'Fri', hours: 4.2 },
    { day: 'Sat', hours: 2.8 },
    { day: 'Sun', hours: 1.7 },
  ];

  return (
    <div className="page-content">
      {/* Dashboard Header */}
      <h2 style={{ marginBottom: '1rem' }}>Admin Dashboard</h2>

      {/* Stat Widgets */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <StatBox title="Total Users" value={stats.totalUsers} />
        <StatBox title="Active Users" value={stats.activeUsers} />
        <StatBox title="Avg Screen Time" value={stats.avgScreenTime} />
        <StatBox title="Last Login Peak" value={stats.lastLoginPeak} />
      </div>

      {/* Chart Section */}
      <h3 style={{ marginBottom: '1rem' }}>Daily Screen Time Trends</h3>
      <div style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        maxWidth: '600px',
        color: 'black'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          {/* Y-axis */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '150px',
            marginRight: '1rem',
            fontSize: '0.8rem',
            color: '#666'
          }}>
            {[5, 4, 3, 2, 1, 0].map(h => (
              <div key={h}>{h}h</div>
            ))}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '150px' }}>
            {screenTimeTrends.map((day, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#61dafb',
                  height: `${day.hours * 25}px`,
                  width: '30px',
                  borderRadius: '4px',
                }} />
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{day.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value }: { title: string, value: string | number }) {
  return (
    <div style={statBox}>
      <div style={statTitle}>{title}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

const statBox: CSSProperties = {
  background: '#f0f0f0',
  padding: '1rem',
  borderRadius: '8px',
  minWidth: '150px',
  textAlign: 'center',
  color: 'black', // ← force black text
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

export default Dashboard1;