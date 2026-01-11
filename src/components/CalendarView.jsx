import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getLogs, deleteLog } from '../utils/storage';

const CalendarView = ({ viewType, setEditingLog, onLogChange }) => {
    const [date, setDate] = useState(new Date());
    const [logs, setLogs] = useState(getLogs());

    useEffect(() => {
        setLogs(getLogs());
    }, [onLogChange]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this log?')) {
            deleteLog(id);
            if (onLogChange) onLogChange();
        }
    };

    const filteredLogs = logs.filter(log => {
        const type = log.type || 'exercise';
        return type === viewType;
    });

    // Helper to get YYYY-MM-DD in Local Time
    const getLocalDateStr = (date) => {
        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - (offset * 60 * 1000));
        return local.toISOString().split('T')[0];
    };

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = getLocalDateStr(date);
            const hasLog = filteredLogs.some(log => log.date === dateStr);
            if (hasLog) {
                return 'highlight-day';
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = getLocalDateStr(date);
            const dayLogs = filteredLogs.filter(log => log.date === dateStr);
            if (dayLogs.length > 0) {
                const total = dayLogs.reduce((sum, log) => sum + log.minutes, 0);
                return <div style={{ fontSize: '0.6rem', marginTop: '2px' }}>{total}m</div>
            }
        }
    };

    const selectedDayLogs = filteredLogs.filter(log =>
        log.date === getLocalDateStr(date)
    );

    return (
        <div className="card calendar-container">
            <h3 style={{ marginBottom: '1rem' }}>History</h3>
            <Calendar
                onChange={setDate}
                value={date}
                tileClassName={getTileClassName}
                tileContent={tileContent}
                className="custom-calendar"
            />

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4>Details for {date.toDateString()}</h4>
                {selectedDayLogs.length === 0 ? (
                    <p className="text-muted">No {viewType} logged.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {selectedDayLogs.map(log => (
                            <li key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{log.minutes}m</span>
                                    <span className="text-muted" style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setEditingLog(log)}
                                        style={{ padding: '6px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }}
                                        title="Edit"
                                        aria-label="Edit"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        style={{ padding: '6px', background: 'rgba(255,0,0,0.1)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#ff6b6b' }}
                                        title="Delete"
                                        aria-label="Delete"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <style>{`
                .react-calendar {
                    background: transparent;
                    border: none;
                    width: 100%;
                    font-family: inherit;
                }
                .react-calendar__tile {
                    color: var(--text-primary);
                    padding: 10px 4px;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background: var(--bg-secondary);
                    border-radius: 8px;
                }
                .react-calendar__tile--now {
                    background: transparent;
                    color: var(--accent);
                    font-weight: bold;
                }
                .react-calendar__tile--active {
                    background: var(--accent) !important;
                    color: var(--bg-primary) !important;
                    border-radius: 8px;
                }
                .highlight-day {
                    position: relative;
                }
                .highlight-day::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    background: var(--accent);
                    border-radius: 50%;
                }
                .react-calendar__navigation button {
                    color: var(--text-primary);
                    font-size: 1.2rem;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background: var(--bg-secondary);
                    border-radius: 8px;
                }
                .react-calendar__month-view__days__day--weekend {
                    color: var(--text-secondary);
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                    color: var(--text-muted) !important;
                }
            `}</style>
        </div>
    );
};

export default CalendarView;
