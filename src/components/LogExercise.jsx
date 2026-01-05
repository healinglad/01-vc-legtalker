import { useState } from 'react';
import { addLog } from '../utils/storage';

const LogExercise = ({ onLogAdded }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [minutes, setMinutes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!minutes) return;

        addLog({ date, minutes });
        setMinutes('');
        onLogAdded(); // Refresh stats in parent

        // Optional: Show success feedback?
    };

    return (
        <section className="card">
            <h2>Log Exercise</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <button type="submit" className="btn-primary">
                    Add Log
                </button>
            </form>
        </section>
    );
};

export default LogExercise;
