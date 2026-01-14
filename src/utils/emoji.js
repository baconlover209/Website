import emojiMap from '../assets/emojis.js';

// Utility to parse text and replace emojis with Twemoji images
export const parseEmoji = (text) => {
    // Regex matches common emoji patterns including ZWJ sequences and skin tones
    return text.replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu, (match) => {
        let codepoints = Array.from(match).map(c => c.codePointAt(0).toString(16)).join('-');

        // Cleanup: Twemoji URLs usually strip variation selectors (fe0f) unless part of a ZWJ sequence
        if (!match.includes('\u200D')) {
            codepoints = codepoints.replace(/-fe0f/g, '').replace(/fe0f-?/g, '');
        }

        return `<img class="emoji" draggable="false" alt="${match}" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoints}.svg">`;
    });
};

export const replaceShortcodes = (text) => {
    return text.replace(/:[a-zA-Z0-9_+-]+:/g, (match) => {
        const shortcode = match.slice(1, -1);
        return emojiMap[shortcode] || match;
    });
};

export const getEmojiHtml = (text) => {
    let content = replaceShortcodes(text);
    return parseEmoji(content);
}

const decodeHtml = (html) => {
    if (typeof document === 'undefined') return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

export const parseMessage = (text) => {
    if (!text) return [];
    let content = text;

    // Decode HTML entities from backend
    content = decodeHtml(content);

    // Replace shortcodes first
    content = replaceShortcodes(content);

    // Get Twemoji HTML string
    const twemojiHtml = parseEmoji(content);

    const tokens = [];
    let lastIndex = 0;
    const tagRegex =
        /<img class="emoji"[^>]*?alt="([^"]+)"[^>]*?src="([^"]+)"[^>]*?>/g;

    let match;
    while ((match = tagRegex.exec(twemojiHtml)) !== null) {
        const [fullTag, alt, src] = match;
        const textBefore = twemojiHtml.slice(lastIndex, match.index);

        if (textBefore) {
            tokens.push({ type: "text", content: textBefore });
        }

        tokens.push({ type: "emoji", src, alt });
        lastIndex = tagRegex.lastIndex;
    }

    const textAfter = twemojiHtml.slice(lastIndex);
    if (textAfter) {
        tokens.push({ type: "text", content: textAfter });
    }

    return tokens;
};
