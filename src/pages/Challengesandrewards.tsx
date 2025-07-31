import { useState, useEffect, useRef } from 'react';
import { AppColors } from '../style/app_colors';
import { AppSpacing } from '../style/app_spacing';
import { AppRadius } from '../style/app_radius';
import { AppShadows } from '../style/app_shadows';
import { AppTextStyles } from '../style/app_text_styles';

// Challenge & Reward types
type Challenge = { id: number; title: string; rules: string; goal: string; duration: string; points: number; expiresAt: number };
type Reward = { id: number; name: string; points: number };

const formatTimeLeft = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

function Challengesandrewards() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [title, setTitle] = useState('');
  const [rules, setRules] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [challengePoints, setChallengePoints] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardName, setRewardName] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [rewardEditId, setRewardEditId] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const notifiedIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('challenges');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed)) setChallenges(parsed); 
      } catch {}
    }
    if ('Notification' in window && Notification.permission !== 'granted') Notification.requestPermission();
    const interval = setInterval(() => {
      setNow(Date.now());
      setChallenges(prev => {
        const nowTime = Date.now();
        const active: Challenge[] = [];
        const expired: Challenge[] = [];
        for (let ch of prev) { ch.expiresAt > nowTime ? active.push(ch) : expired.push(ch); }
        expired.forEach(ch => { 
          if (!notifiedIdsRef.current.includes(ch.id)) { 
            showNotification(ch.title); 
            notifiedIdsRef.current.push(ch.id); 
          } 
        });
        localStorage.setItem('challenges', JSON.stringify(active));
        return active;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (title: string) => { 
    if ('Notification' in window && Notification.permission === 'granted') 
      new Notification(`Challenge expired: ${title}`); 
  };

  const parseDurationToMs = (durationStr: string): number => {
    const regex = /(\d+)([dhms])/g; let match; let ms = 0;
    while ((match = regex.exec(durationStr)) !== null) {
      const value = parseInt(match[1]); const unit = match[2];
      switch (unit) { 
        case 'd': ms += value * 86400000; break; 
        case 'h': ms += value * 3600000; break; 
        case 'm': ms += value * 60000; break; 
        case 's': ms += value * 1000; break; 
      }
    }
    return ms;
  };

  const handleAddOrUpdate = () => {
    const points = parseInt(challengePoints); 
    if (!title.trim() || isNaN(points)) return; 
    const durationMs = parseDurationToMs(duration);
    if (editingId !== null) {
      setChallenges(prev => { 
        const updated = prev.map(ch => ch.id === editingId ? { ...ch, title, rules, goal, duration, points, expiresAt: Date.now() + durationMs } : ch); 
        localStorage.setItem('challenges', JSON.stringify(updated)); 
        return updated; 
      }); 
      setEditingId(null);
    } else {
      const newChallenge: Challenge = { id: Date.now(), title, rules, goal, duration, points, expiresAt: Date.now() + durationMs };
      const updatedChallenges = [...challenges, newChallenge]; 
      setChallenges(updatedChallenges); 
      localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    }
    setTitle(''); setRules(''); setGoal(''); setDuration(''); setChallengePoints('');
  };

  const handleEdit = (ch: Challenge) => { 
    setEditingId(ch.id); 
    setTitle(ch.title); 
    setRules(ch.rules); 
    setGoal(ch.goal); 
    setDuration(ch.duration); 
    setChallengePoints(ch.points.toString()); 
  };
  const handleCancel = () => { 
    setEditingId(null); 
    setTitle(''); 
    setRules(''); 
    setGoal(''); 
    setDuration(''); 
    setChallengePoints(''); 
  };
  const handleDelete = (id: number) => { 
    setChallenges(prev => { 
      const updated = prev.filter(ch => ch.id !== id); 
      localStorage.setItem('challenges', JSON.stringify(updated)); 
      return updated; 
    }); 
    if (editingId === id) handleCancel(); 
  };

  const handleAddOrUpdateReward = () => {
    const points = parseInt(rewardPoints); 
    if (!rewardName.trim() || isNaN(points)) return;
    if (rewardEditId !== null) { 
      setRewards(prev => prev.map(r => r.id === rewardEditId ? { ...r, name: rewardName, points } : r)); 
      setRewardEditId(null); 
    } else { 
      const newReward: Reward = { id: Date.now(), name: rewardName, points }; 
      setRewards([...rewards, newReward]); 
    }
    setRewardName(''); 
    setRewardPoints('');
  };

  const handleEditReward = (r: Reward) => { 
    setRewardEditId(r.id); 
    setRewardName(r.name); 
    setRewardPoints(r.points.toString()); 
  };
  const handleDeleteReward = (id: number) => { 
    setRewards(prev => prev.filter(r => r.id !== id)); 
    if (rewardEditId === id) { 
      setRewardEditId(null); 
      setRewardName(''); 
      setRewardPoints(''); 
    } 
  };

  return (
    <div className="page-content" style={{ color: AppColors.textPrimary }}>
      <h2 style={{ ...AppTextStyles.headingLarge, marginBottom: AppSpacing.medium }}>Challenges & Rewards</h2>
      <div style={{ display: 'flex', gap: AppSpacing.xlarge, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <section style={{ marginBottom: AppSpacing.large, maxWidth: '600px' }}>
          <h3 style={AppTextStyles.headingMedium}>{editingId ? 'Edit Challenge' : 'Create New Challenge'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: AppSpacing.medium, marginTop: AppSpacing.medium }}>
            <input type="text" placeholder="Challenge Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Rules" value={rules} onChange={(e) => setRules(e.target.value)} />
            <input type="text" placeholder="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
            <input type="text" placeholder="Duration (e.g. 1d 3h 20m)" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <input type="number" placeholder="Points" value={challengePoints} onChange={(e) => setChallengePoints(e.target.value)} />
            <div style={{ display: 'flex', gap: AppSpacing.medium }}>
              <button style={btn} onClick={handleAddOrUpdate}>{editingId ? 'Update Challenge' : 'Add Challenge'}</button>
              {editingId && <button style={cancelBtn} onClick={handleCancel}>Cancel</button>}
            </div>
          </div>
          {challenges.length > 0 && (
            <section style={{ marginTop: AppSpacing.large }}>
              <h3 style={AppTextStyles.headingMedium}>Existing Challenges</h3>
              <ul style={{ marginTop: AppSpacing.medium }}>
                {challenges.map(ch => (
                  <li key={ch.id} style={{ marginBottom: AppSpacing.medium }}>
                    <strong>{ch.title}</strong> – {ch.points} pts – Goal: {ch.goal}, Duration: {ch.duration}
                    <br />
                    <span style={{ fontStyle: 'italic', color: AppColors.textSecondary }}>Time Left: {formatTimeLeft(ch.expiresAt - now)}</span>
                    <br />
                    Rules: {ch.rules}
                    <div>
                      <button style={editBtn} onClick={() => handleEdit(ch)}>Edit</button>
                      <button style={deleteBtn} onClick={() => handleDelete(ch.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
        <section style={{ maxWidth: '600px' }}>
          <h3 style={AppTextStyles.headingMedium}>{rewardEditId ? 'Edit Reward' : 'Add Reward'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: AppSpacing.medium, marginTop: AppSpacing.medium }}>
            <input type="text" placeholder="Reward Name" value={rewardName} onChange={(e) => setRewardName(e.target.value)} />
            <input type="number" placeholder="Points Required" value={rewardPoints} onChange={(e) => setRewardPoints(e.target.value)} />
            <div style={{ display: 'flex', gap: AppSpacing.medium }}>
              <button style={btn} onClick={handleAddOrUpdateReward}>{rewardEditId ? 'Update Reward' : 'Add Reward'}</button>
              {rewardEditId && (
                <button style={cancelBtn} onClick={() => { setRewardEditId(null); setRewardName(''); setRewardPoints(''); }}>Cancel</button>
              )}
            </div>
          </div>
          {rewards.length > 0 && (
            <ul style={{ marginTop: AppSpacing.large }}>
              {rewards.map(r => (
                <li key={r.id} style={{ marginBottom: AppSpacing.medium }}>
                  <strong>{r.name}</strong> – {r.points} pts
                  <div>
                    <button style={editBtn} onClick={() => handleEditReward(r)}>Edit</button>
                    <button style={deleteBtn} onClick={() => handleDeleteReward(r.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

const btn = { 
  padding: AppSpacing.small, 
  background: AppColors.primary, 
  border: 'none', 
  borderRadius: AppRadius.small, 
  cursor: 'pointer', 
  fontWeight: 'bold', 
  boxShadow: AppShadows.softShadowDark 
};
const cancelBtn = { 
  padding: AppSpacing.small, 
  background: AppColors.surfaceDark, 
  border: 'none', 
  borderRadius: AppRadius.small, 
  cursor: 'pointer', 
  fontWeight: 'bold' 
};
const editBtn = { 
  padding: '0.3rem 0.6rem', 
  marginTop: AppSpacing.small, 
  fontSize: '0.9rem', 
  cursor: 'pointer' 
};
const deleteBtn = { 
  padding: '0.3rem 0.6rem', 
  marginTop: AppSpacing.small, 
  marginLeft: AppSpacing.small, 
  fontSize: '0.9rem', 
  cursor: 'pointer', 
  background: AppColors.error, 
  color: AppColors.textOnPrimary, 
  border: 'none', 
  borderRadius: AppRadius.small 
};

export default Challengesandrewards;
