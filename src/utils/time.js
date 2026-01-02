export function getRelativeTime(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    const date = new Date(timestamp * 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2 * 86400) return `1 day ago`;
    if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} days ago`;
    return date.toDateString();
}
