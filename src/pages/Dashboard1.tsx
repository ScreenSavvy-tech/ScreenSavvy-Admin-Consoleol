import type { CSSProperties } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import { AppColors } from '../style/app_colors';
import { AppTextStyles } from '../style/app_text_styles';
import { AppSpacing } from '../style/app_spacing';
import { AppRadius } from '../style/app_radius';
import { AppShadows } from '../style/app_shadows';

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

  const COLORS = [AppColors.blue, AppColors.teal, AppColors.yellow, AppColors.orange];

  return (
    <div className="page-content" style={{ backgroundColor: AppColors.background, color: AppColors.textPrimary, padding: AppSpacing.screenPadding, minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ ...AppTextStyles.headingLarge, marginBottom: AppSpacing.medium, color: AppColors.textPrimary }}>Admin Dashboard</h2>

      {/* Summary stat boxes */}
      <div style={{ display: 'flex', gap: AppSpacing.large, marginBottom: AppSpacing.xlarge, flexWrap: 'wrap' }}>
        <StatBox title="Total Users" value={stats.totalUsers} />
        <StatBox title="Active Users" value={stats.activeUsers} />
        <StatBox title="Avg Screen Time" value={stats.avgScreenTime} />
        <StatBox title="Last Login Peak" value={stats.lastLoginPeak} />
      </div>

      <h3 style={{ ...AppTextStyles.headingMedium, marginBottom: AppSpacing.medium, color: AppColors.textPrimary }}>Analytics & Reporting</h3>

      {/* Chart section */}
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: AppSpacing.xlarge, maxWidth: '1000px', width: '100%' }}>
          {/* Line Chart */}
          <div style={chartContainerStyle}>
            <h4 style={{ ...AppTextStyles.headingSmall, color: AppColors.textPrimary }}>Daily Screen Time</h4>
            <ResponsiveContainer width="100%" height={300} style={{ maxWidth: '100%' }}>
              <LineChart data={screenTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={AppColors.textPrimary} />
                <YAxis stroke={AppColors.textPrimary} />
                <Tooltip contentStyle={{ backgroundColor: AppColors.surfaceLight, color: AppColors.textPrimary, border: '1px solid ' + AppColors.borderLight }} />
                <Line type="monotone" dataKey="hours" stroke={AppColors.accentPurple} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={chartContainerStyle}>
            <h4 style={{ ...AppTextStyles.headingSmall, color: AppColors.textPrimary }}>Challenge Type Distribution</h4>
            <ResponsiveContainer width="100%" height={300} style={{ maxWidth: '100%' }}>
              <PieChart>
                <Pie
                  data={challengeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill={AppColors.accentPurple}
                  label
                >
                  {challengeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: AppColors.surfaceLight, color: AppColors.textPrimary, border: '1px solid ' + AppColors.borderLight }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={chartContainerStyle}>
            <h4 style={{ ...AppTextStyles.headingSmall, color: AppColors.textPrimary }}>Weekly Reward Redemptions</h4>
            <ResponsiveContainer width="100%" height={300} style={{ maxWidth: '100%' }}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke={AppColors.textPrimary} />
                <YAxis stroke={AppColors.textPrimary} />
                <Tooltip contentStyle={{ backgroundColor: AppColors.surfaceLight, color: AppColors.textPrimary, border: '1px solid ' + AppColors.borderLight }} />
                <Bar dataKey="redemptions" fill={AppColors.green} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
  background: AppColors.surfaceLight,
  padding: AppSpacing.large,
  borderRadius: AppRadius.medium,
  minWidth: '150px',
  textAlign: 'center',
  color: AppColors.textPrimary,
  boxShadow: AppShadows.softShadowDark,
};

const statTitle: CSSProperties = {
  ...AppTextStyles.bodySmall,
  color: AppColors.textSecondary,
  marginBottom: AppSpacing.xsmall,
};

const statValue: CSSProperties = {
  ...AppTextStyles.headingMedium,
  fontWeight: 'bold',
};

const chartContainerStyle: CSSProperties = {
  background: AppColors.surfaceLight,
  padding: AppSpacing.large,
  borderRadius: AppRadius.medium,
  border: `1px solid ${AppColors.borderLight}`,
  boxShadow: AppShadows.softShadowDark,
  maxWidth: '100%',
  overflow: 'hidden',
  width: '100%',
};

export default Dashboard1;