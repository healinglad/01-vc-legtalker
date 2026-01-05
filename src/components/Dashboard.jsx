
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

const Dashboard = ({ stats }) => {
    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Your Progress</h2>
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
        </div>
    );
};

export default Dashboard;
