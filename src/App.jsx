import { useState, useEffect } from 'react';
import LogExercise from './components/LogExercise';
import Dashboard from './components/Dashboard';
import { getStats } from './utils/storage';
import './App.css';

function App() {
  const [stats, setStats] = useState({
    last7Days: 0,
    last30Days: 0,
    last90Days: 0,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setStats(getStats());
  }, [refreshKey]);

  const handleLogAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-container" style={{ padding: '20px', paddingBottom: '40px' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LegWalker
        </h1>
        <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#0f172a', fontWeight: 'bold' }}>L</span>
        </div>
      </header>

      <main>
        <Dashboard stats={stats} />

        <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', margin: '2rem 0' }}></div>

        <LogExercise onLogAdded={handleLogAdded} />

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Logs stored locally on your device.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
