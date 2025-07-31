import { useEffect, useState } from 'react';
import { AppColors } from '../style/app_colors';
import { AppSpacing } from '../style/app_spacing';
import { AppRadius } from '../style/app_radius';
import { AppTextStyles } from '../style/app_text_styles';
import { AppShadows } from '../style/app_shadows';

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => localStorage.getItem('maintenance') === 'true');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const [conversionRate, setConversionRate] = useState(1);
  const [maxDailyPoints, setMaxDailyPoints] = useState(250);
  const [challengeCooldown, setChallengeCooldown] = useState(2);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [challengesEnabled, setChallengesEnabled] = useState(true);
  const [minAppVersion, setMinAppVersion] = useState('1.0.0');
  const [selectedCohort, setSelectedCohort] = useState('All Users');

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('maintenance', String(isMaintenanceMode));
  }, [isMaintenanceMode]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const handleClosePreview = () => setPreviewIndex(null);

  return (
    <div className="page-content">
      {isMaintenanceMode && (
        <div
          style={{
            backgroundColor: AppColors.warning,
            padding: AppSpacing.small,
            marginBottom: AppSpacing.medium,
            textAlign: 'center',
            fontWeight: 'bold',
            borderRadius: AppRadius.small
          }}
        >
          Maintenance Mode Active
        </div>
      )}

      <h2 style={{ ...AppTextStyles.headingLarge, marginBottom: AppSpacing.medium }}>Settings</h2>

      <div style={{ display: 'flex', flexDirection: 'row', gap: AppSpacing.large, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: AppSpacing.medium, maxWidth: 500 }}>
          <SettingToggle label="Light/Dark Theme" value={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
          <SettingToggle
            label="Maintenance Mode"
            value={isMaintenanceMode}
            onChange={() => {
              if (!isMaintenanceMode) setShowPasswordPrompt(true);
              else setIsMaintenanceMode(false);
            }}
          />

          {showPasswordPrompt && (
            <div style={{ display: 'flex', gap: AppSpacing.xsmall, alignItems: 'center' }}>
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
              <button onClick={() => { setShowPasswordPrompt(false); setAdminPassword(''); }}>Cancel</button>
            </div>
          )}

          <SettingSlider label={`Point Conversion Rate (1 min = ${conversionRate} pts)`} value={conversionRate} onChange={setConversionRate} />
          <SettingInput label="Max Daily Points per User" value={maxDailyPoints} onChange={setMaxDailyPoints} />
          <SettingInput label="Cooldown Between Challenges (hrs)" value={challengeCooldown} onChange={setChallengeCooldown} />
          <SettingToggle label="Push Notifications" value={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
          <SettingToggle label="Email Notifications" value={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />

          <hr />
          <h3 style={AppTextStyles.headingMedium}>Feature Flags & Version Control</h3>
          <SettingToggle label="Enable Rewards Feature" value={rewardsEnabled} onChange={() => setRewardsEnabled(!rewardsEnabled)} />
          <SettingToggle label="Enable Challenges Feature" value={challengesEnabled} onChange={() => setChallengesEnabled(!challengesEnabled)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Min App Version Required</label>
            <input type="text" value={minAppVersion} onChange={(e) => setMinAppVersion(e.target.value)} style={{ width: 100 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Target Cohort</label>
            <select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)} style={{ width: 150 }}>
              <option>All Users</option>
              <option>Admins</option>
              <option>Beta Testers</option>
              <option>Group A</option>
            </select>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 300 }}>
          <h3 style={AppTextStyles.headingMedium}>Media Uploads</h3>
          <div
            style={{
              border: `2px dashed ${AppColors.borderLight}`,
              padding: AppSpacing.medium,
              borderRadius: AppRadius.medium,
              backgroundColor: AppColors.backgroundLight,
              boxShadow: AppShadows.light,
            }}
          >
            <label style={{ fontWeight: 'bold', color: AppColors.textPrimary }}>Upload Icons / Banners / Assets</label>
            <input type="file" accept="image/*" multiple onChange={handleUpload} style={{ marginTop: AppSpacing.xsmall }} />

            {mediaFiles.length > 0 && (
              <div
                style={{
                  marginTop: AppSpacing.medium,
                  display: 'flex',
                  gap: AppSpacing.medium,
                  overflowX: 'auto',
                  paddingBottom: AppSpacing.xsmall
                }}
              >
                {mediaFiles.map((file, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`upload-${idx}`}
                      style={{ height: 80, borderRadius: AppRadius.small, cursor: 'pointer', border: `1px solid ${AppColors.borderLight}` }}
                      onClick={() => setPreviewIndex(idx)}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMediaFiles(prev => prev.filter((_, i) => i !== idx));
                      }}
                      title="Delete"
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        backgroundColor: AppColors.error,
                        color: AppColors.textOnError,
                        border: 'none',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        fontSize: 14,
                        textAlign: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {previewIndex !== null && (
        <div
          onClick={handleClosePreview}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <img
            src={URL.createObjectURL(mediaFiles[previewIndex])}
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: AppRadius.medium }}
            alt="Full preview"
          />
        </div>
      )}
    </div>
  );
}

function SettingToggle({ label, value, onChange }: { label: string, value: boolean, onChange: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>{label}</span>
      <label className="switch">
        <input type="checkbox" checked={value} onChange={onChange} />
        <span className="slider"></span>
      </label>
    </div>
  );
}

function SettingSlider({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={{ marginBottom: AppSpacing.xsmall }}>{label}</label>
      <input type="range" min={1} max={100} value={value} onChange={(e) => onChange(parseInt(e.target.value))} />
    </div>
  );
}

function SettingInput({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: 100 }}
      />
    </div>
  );
}

export default Settings;