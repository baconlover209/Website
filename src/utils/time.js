export function getRelativeTime(input) {
    if (!input) return '';

    // Convert to Date object
    let date;
    // If it's a number (likely seconds if small, ms if large)
    // But our existing logic assumes seconds for the 'posts' table which stores seconds as string?
    // Let's check if it's numeric
    if (!isNaN(input) && !isNaN(parseFloat(input))) {
        const num = parseFloat(input);
        // Heuristic: if < 1e11, it's seconds (valid until year 5138)
        // If > 1e11, it's milliseconds
        if (num < 100000000000) {
            date = new Date(num * 1000);
        } else {
            date = new Date(num);
        }
    } else {
        // Try parsing string/date
        date = new Date(input);
    }

    if (isNaN(date.getTime())) return 'Invalid Date';

    const nowSec = Math.floor(Date.now() / 1000);
    const dateSec = Math.floor(date.getTime() / 1000);
    const diff = nowSec - dateSec;

    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2 * 86400) return `1 day ago`;
    if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} days ago`;

    return date.toDateString();
}
