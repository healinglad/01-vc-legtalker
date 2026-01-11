import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const STORAGE_KEY = 'legwalker_logs';

export const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - (offset * 60 * 1000));
    return local.toISOString().split('T')[0];
};

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
        type: log.type || 'exercise', // Default to 'exercise'
        timestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...logs];
    // Sort by date descending
    updatedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    return updatedLogs;
};

export const calculateAverage = (logs, days, type = 'exercise') => {
    if (!logs.length) return 0;

    const today = new Date();
    // Reset time to end of day for accurate comparison
    today.setHours(23, 59, 59, 999);

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - (days - 1));
    pastDate.setHours(0, 0, 0, 0);

    // Filter logs within the range AND type
    const relevantLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        const logType = log.type || 'exercise'; // Handle legacy data
        return logDate >= pastDate && logDate <= today && logType === type;
    });

    if (!relevantLogs.length) return 0;

    const totalMinutes = relevantLogs.reduce((sum, log) => sum + log.minutes, 0);

    return Math.round(totalMinutes / days);
};

export const getStats = (type = 'exercise') => {
    const logs = getLogs();

    return {
        last7Days: calculateAverage(logs, 7, type),
        last30Days: calculateAverage(logs, 30, type),
        last90Days: calculateAverage(logs, 90, type),
        totalLogs: logs.filter(log => (log.type || 'exercise') === type).length
    };
};

export const updateLog = (updatedLog) => {
    const logs = getLogs();
    const index = logs.findIndex(l => l.id === updatedLog.id);
    if (index === -1) return logs;

    logs[index] = { ...logs[index], ...updatedLog, type: updatedLog.type || 'exercise' };

    // Re-sort
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return logs;
};

export const deleteLog = (id) => {
    const logs = getLogs();
    const updatedLogs = logs.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    return updatedLogs;
};

export const exportData = async () => {
    const logs = getLogs();
    const jsonString = JSON.stringify(logs, null, 2);
    const fileName = "legtalker_backup.json";

    try {
        // 1. Write file to cache
        const result = await Filesystem.writeFile({
            path: fileName,
            data: jsonString,
            directory: Directory.Cache,
            encoding: Encoding.UTF8,
        });

        // 2. Share via native sheet
        await Share.share({
            title: 'LegTalker Backup',
            text: 'Backup of LegTalker data',
            url: result.uri,
            dialogTitle: 'Save Backup',
        });

    } catch (e) {
        console.error("Native export failed", e);
        // Fallback or Alert?
        alert("Export failed: " + e.message);
    }
};

export const importData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedLogs = JSON.parse(event.target.result);
                if (!Array.isArray(importedLogs)) {
                    throw new Error("Invalid format: Root must be an array.");
                }
                const isValid = importedLogs.every(log => log.date && log.minutes);
                if (!isValid) throw new Error("Invalid format: Missing required fields.");

                localStorage.setItem(STORAGE_KEY, JSON.stringify(importedLogs));
                resolve(importedLogs);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
};
