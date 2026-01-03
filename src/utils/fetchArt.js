export async function fetchArt(tag) {
    try {
        // Fetch the JSON data
        const response = await fetch('/src/art.json'); // Ensure the path is correct
        if (!response.ok) {
            throw new Error(`Failed to fetch art.json. HTTP status: ${response.status}`);
        }

        const data = await response.json();
        const pieces = data.data.pieces; // Extract pieces
        const tags = data.data.tags; // Extract tags

        // If no tag is provided, return all pieces
        if (!tag) {
            return { pieces };
        }

        // Find the tag object that matches the provided tag
        const tagObject = tags.find(item => Object.keys(item)[0] === tag);
        if (!tagObject) {
            throw new Error(`Tag "${tag}" not found in tags.`);
        }

        // Get the list of IDs associated with the tag
        const tagIds = tagObject[tag];

        // Filter pieces based on the tag IDs
        const filteredPieces = pieces.filter(piece => tagIds.includes(parseInt(piece.id, 10)));

        return { pieces: filteredPieces };
    } catch (error) {
        console.error('Error in fetchArt:', error);
        throw error;
    }
}