
const StatCard = ({ label, value, timeframe }) => (
    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
        <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {label}
        </p>
        <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--accent)' }}>
            {value} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>min</span>
        </h3>
        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
            Daily Avg ({timeframe})
        </p>
    </div>
);

import { exportData, importData } from '../utils/storage';

const Dashboard = ({ stats, viewType, setViewType, onDataChange }) => {
    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (confirm("This will overwrite your existing logs using data from the file. Are you sure?")) {
            try {
                await importData(file);
                alert("Data imported successfully!");
                if (onDataChange) onDataChange();
            } catch (err) {
                alert("Failed to import data: " + err.message);
            }
        }
        // Reset file input
        e.target.value = null;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Your Progress</h2>
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '4px' }}>
                    {['exercise', 'meditation'].map(type => (
                        <button
                            key={type}
                            onClick={() => setViewType(type)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                background: viewType === type ? 'var(--accent)' : 'transparent',
                                color: viewType === type ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                fontWeight: viewType === type ? 'bold' : 'normal',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                    <StatCard label="Last 7 Days" value={stats.last7Days} timeframe="7d" />
                </div>
                <StatCard label="Last 30 Days" value={stats.last30Days} timeframe="30d" />
                <StatCard label="Last 3 Months" value={stats.last90Days} timeframe="90d" />
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Activity Level</h3>
                <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(stats.last7Days, 100)}%`,
                        background: 'var(--accent)',
                        boxShadow: '0 0 10px var(--accent-glow)'
                    }}></div>
                </div>
                <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    {stats.last7Days > 0 ? "You're consistently active!" : "Start logging to see your progress."}
                </p>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Data Management</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={exportData}
                        style={{ flex: 1, padding: '0.8rem', background: 'var(--surface)', border: '1px solid var(--accent)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Export Data
                    </button>
                    <label style={{ flex: 1, padding: '0.8rem', background: 'var(--accent)', color: 'var(--bg-primary)', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold' }}>
                        Import Data
                        <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
