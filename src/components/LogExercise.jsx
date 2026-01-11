import { useState, useEffect } from 'react';
import { addLog, updateLog } from '../utils/storage';

const LogExercise = ({ onLogAdded, editingLog, setEditingLog }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [minutes, setMinutes] = useState('');
    const [selectedType, setType] = useState('exercise');

    useEffect(() => {
        if (editingLog) {
            setDate(editingLog.date);
            setMinutes(editingLog.minutes);
            setType(editingLog.type || 'exercise');
            // Scroll to form
            document.querySelector('.log-exercise-card')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [editingLog]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!minutes) return;

        if (editingLog) {
            updateLog({ ...editingLog, date, minutes: parseInt(minutes), type: selectedType });
            setEditingLog(null); // Clear edit mode
        } else {
            addLog({ date, minutes, type: selectedType });
        }

        setMinutes('');
        // Reset date to today only if adding new? No, keep logic simple.
        if (!editingLog) setDate(new Date().toISOString().split('T')[0]);

        onLogAdded(); // Refresh stats in parent
    };

    const handleCancel = () => {
        setEditingLog(null);
        setMinutes('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <section className="card log-exercise-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>{editingLog ? 'Edit Log' : 'Log Exercise'}</h2>
                {editingLog && (
                    <button onClick={handleCancel} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                        Cancel
                    </button>
                )}
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
                    {['exercise', 'meditation'].map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setType(type)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '6px',
                                border: 'none',
                                background: selectedType === type ? 'var(--accent)' : 'transparent',
                                color: selectedType === type ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                fontWeight: selectedType === type ? 'bold' : 'normal',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s'
                            }}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Duration (Minutes)</label>
                    <input
                        type="number"
                        placeholder="e.g. 45"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ background: editingLog ? 'var(--accent)' : '' }}>
                    {editingLog ? 'Update Log' : (selectedType === 'meditation' ? 'Log Meditation' : 'Log Exercise')}
                </button>
            </form>
        </section>
    );
};

export default LogExercise;
