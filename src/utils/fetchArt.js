export async function fetchArt(tag) {
    try {
        // fetch the JSON data
        const response = await fetch('/art.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch art.json. HTTP status: ${response.status}`);
        }

        const data = await response.json();
        const pieces = data.data.pieces;
        const tags = data.data.tags;

        // if no tag is provided, return all pieces and the tags mapping
        if (!tag) {
            return { pieces, tags };
        }

        // find the tag object that matches the provided tag
        const tagObject = tags.find(item => Object.keys(item)[0] === tag);
        if (!tagObject) {
            throw new Error(`Tag "${tag}" not found in tags.`);
        }

        // get the list of IDs associated with the tag
        const tagIds = tagObject[tag];

        // filter pieces based on the tag IDs
        const filteredPieces = pieces.filter(piece => tagIds.includes(parseInt(piece.id, 10)));

        return { pieces: filteredPieces };
    } catch (error) {
        console.error('Error in fetchArt:', error);
        throw error;
    }
}