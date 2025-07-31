import { useState, useEffect, useRef } from 'react';

// Challenge type
type Challenge = {
  id: number;
  title: string;
  rules: string;
  goal: string;
  duration: string;
  points: number;
  expiresAt: number; // timestamp when challenge expires
};

// Reward type
type Reward = {
  id: number;
  name: string;
  points: number;
};

// Utility to format remaining time as human-readable string
const formatTimeLeft = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

function Challengesandrewards() {
  // Challenge-related state
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [title, setTitle] = useState('');
  const [rules, setRules] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [challengePoints, setChallengePoints] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Reward-related state
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardName, setRewardName] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [rewardEditId, setRewardEditId] = useState<number | null>(null);

  // Timer + notification
  const [now, setNow] = useState(Date.now());
  const notifiedIdsRef = useRef<number[]>([]); // prevent duplicate notifications

  // Load challenges + setup ticking timer + check expired challenges
  useEffect(() => {
    const saved = localStorage.getItem('challenges');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setChallenges(parsed);
      } catch {}
    }

    // Request push notification permission
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      setNow(Date.now());

      // Remove expired challenges + show notifications
      setChallenges(prev => {
        const nowTime = Date.now();
        const active: Challenge[] = [];
        const expired: Challenge[] = [];

        for (let ch of prev) {
          if (ch.expiresAt > nowTime) {
            active.push(ch);
          } else {
            expired.push(ch);
          }
        }

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

  // Send notification for expired challenge
  const showNotification = (challengeTitle: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Challenge expired: ${challengeTitle}`);
    }
  };

  // Add new challenge or update existing
  const handleAddOrUpdate = () => {
    const points = parseInt(challengePoints);
    if (!title.trim() || isNaN(points)) return;
    const durationMs = parseDurationToMs(duration);

    if (editingId !== null) {
      // Update mode
      setChallenges(prev => {
        const updated = prev.map(ch =>
          ch.id === editingId
            ? { ...ch, title, rules, goal, duration, points, expiresAt: Date.now() + durationMs }
            : ch
        );
        localStorage.setItem('challenges', JSON.stringify(updated));
        return updated;
      });
      setEditingId(null);
    } else {
      // Add mode
      const newChallenge: Challenge = {
        id: Date.now(),
        title,
        rules,
        goal,
        duration,
        points,
        expiresAt: Date.now() + durationMs,
      };
      const updatedChallenges = [...challenges, newChallenge];
      setChallenges(updatedChallenges);
      localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    }

    // Clear inputs
    setTitle('');
    setRules('');
    setGoal('');
    setDuration('');
    setChallengePoints('');
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
      setRewards(prev =>
        prev.map(r =>
          r.id === rewardEditId ? { ...r, name: rewardName, points } : r
        )
      );
      setRewardEditId(null);
    } else {
      const newReward: Reward = {
        id: Date.now(),
        name: rewardName,
        points,
      };
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

  // Parses durations like "1d 3h 20m" into milliseconds
  const parseDurationToMs = (durationStr: string): number => {
    const regex = /(\d+)([dhms])/g;
    let match;
    let ms = 0;
    while ((match = regex.exec(durationStr)) !== null) {
      const value = parseInt(match[1]);
      const unit = match[2];
      switch (unit) {
        case 'd': ms += value * 86400000; break;
        case 'h': ms += value * 3600000; break;
        case 'm': ms += value * 60000; break;
        case 's': ms += value * 1000; break;
      }
    }
    return ms;
  };

  // Main JSX layout
  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '1rem' }}>Challenges & Rewards</h2>

      <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Challenge Form + List */}
        <section style={{ marginBottom: '2rem', maxWidth: '600px' }}>
          <h3>{editingId ? 'Edit Challenge' : 'Create New Challenge'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Challenge Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Rules" value={rules} onChange={(e) => setRules(e.target.value)} />
            <input type="text" placeholder="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
            <input type="text" placeholder="Duration (e.g. 1d 3h 20m)" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <input type="number" placeholder="Points" value={challengePoints} onChange={(e) => setChallengePoints(e.target.value)} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={btn} onClick={handleAddOrUpdate}>
                {editingId ? 'Update Challenge' : 'Add Challenge'}
              </button>
              {editingId && <button style={cancelBtn} onClick={handleCancel}>Cancel</button>}
            </div>
          </div>

          {/* Challenge List */}
          {challenges.length > 0 && (
            <section style={{ marginTop: '3rem' }}>
              <h3>Existing Challenges</h3>
              <ul style={{ marginTop: '1rem' }}>
                {challenges.map(ch => (
                  <li key={ch.id} style={{ marginBottom: '1rem' }}>
                    <strong>{ch.title}</strong> – {ch.points} pts – Goal: {ch.goal}, Duration: {ch.duration}
                    <br />
                    <span style={{ fontStyle: 'italic', color: '#555' }}>
                      Time Left: {formatTimeLeft(ch.expiresAt - now)}
                    </span>
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

        {/* Reward Form + List */}
        <section style={{ maxWidth: '600px' }}>
          <h3>{rewardEditId ? 'Edit Reward' : 'Add Reward'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Reward Name" value={rewardName} onChange={(e) => setRewardName(e.target.value)} />
            <input type="number" placeholder="Points Required" value={rewardPoints} onChange={(e) => setRewardPoints(e.target.value)} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={btn} onClick={handleAddOrUpdateReward}>
                {rewardEditId ? 'Update Reward' : 'Add Reward'}
              </button>
              {rewardEditId && (
                <button style={cancelBtn} onClick={() => {
                  setRewardEditId(null);
                  setRewardName('');
                  setRewardPoints('');
                }}>Cancel</button>
              )}
            </div>
          </div>

          {/* Reward List */}
          {rewards.length > 0 && (
            <ul style={{ marginTop: '2rem' }}>
              {rewards.map(r => (
                <li key={r.id} style={{ marginBottom: '1rem' }}>
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

// Shared button styles
const btn = {
  padding: '0.5rem 1rem',
  background: '#61dafb',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const cancelBtn = {
  padding: '0.5rem 1rem',
  background: '#ccc',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const editBtn = {
  padding: '0.3rem 0.6rem',
  marginTop: '0.5rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const deleteBtn = {
  padding: '0.3rem 0.6rem',
  marginTop: '0.5rem',
  marginLeft: '0.5rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  background: '#f66',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
};

export default Challengesandrewards;