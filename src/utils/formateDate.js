const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const formatTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
    return `${Math.floor(diff / 1440)} days ago`;
};

export const getDurationInDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Agar date invalid ho
    if (isNaN(startDate) || isNaN(endDate)) return "Invalid date";

    // Always positive difference
    const diffMs = Math.abs(endDate - startDate);

    // Convert milliseconds → days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return `${diffDays} days`;
}



export default formatDate;