const STORAGE_KEY = 'legwalker_logs';

export const getLogs = () => {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
};

export const addLog = (log) => {
    const logs = getLogs();
    const newLog = {
        id: Date.now().toString(),
        date: log.date, // format 'YYYY-MM-DD'
        minutes: parseInt(log.minutes, 10),
        timestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...logs];
    // Sort by date descending
    updatedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    return updatedLogs;
};

export const calculateAverage = (logs, days) => {
    if (!logs.length) return 0;

    const today = new Date();
    // Reset time to end of day for accurate comparison
    today.setHours(23, 59, 59, 999);

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - (days - 1));
    pastDate.setHours(0, 0, 0, 0);

    // Filter logs within the range
    const relevantLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= pastDate && logDate <= today;
    });

    if (!relevantLogs.length) return 0;

    const totalMinutes = relevantLogs.reduce((sum, log) => sum + log.minutes, 0);

    // Average per day over the period? Or average of the logs?
    // Request says: "average exercise in minutes per day for different time periods"
    // So usually Total Minutes / Days in Period (e.g., 7, 30, 90)
    // However, if they only logged 1 day in the last 7 days, is the average 
    // calculated over 7 days or just the days they logged?
    // "minutes per day for different time periods" implies over the period duration.
    // So if I did 70 mins in 1 day of the week, my daily average is 10 mins.

    return Math.round(totalMinutes / days);
};

export const getStats = () => {
    const logs = getLogs();

    return {
        last7Days: calculateAverage(logs, 7),
        last30Days: calculateAverage(logs, 30),
        last90Days: calculateAverage(logs, 90),
        totalLogs: logs.length
    };
};
