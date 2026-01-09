import { ref } from 'vue';

const API_BASE = 'https://dart.blueberry.coffee';
export const isUserAdmin = ref(false);
if (typeof window !== 'undefined') {
    isUserAdmin.value = !!localStorage.getItem('auth_key');
}

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (typeof window === 'undefined') return headers;

    const key = localStorage.getItem('auth_key');
    if (key) {
        headers['Authorization'] = `Bearer ${key}`;
        isUserAdmin.value = true;
    } else {
        isUserAdmin.value = false;
    }

    const commKeysList = [];
    const legacyKeys = localStorage.getItem('commission_keys');
    if (legacyKeys) {
        commKeysList.push(...legacyKeys.split(','));
    }

    const mapStr = localStorage.getItem('commission_key_map');
    if (mapStr) {
        try {
            const map = JSON.parse(mapStr);
            commKeysList.push(...Object.values(map));
        } catch (e) {
            console.error("Failed to parse commission key map", e);
        }
    }

    if (commKeysList.length > 0) {
        const uniqueKeys = [...new Set(commKeysList)].filter(Boolean);
        headers['X-Commission-Keys'] = uniqueKeys.join(',');
    }

    return headers;
};

export async function addCommissionComment(id, text, username = 'Me') {
    const headers = getHeaders();

    if (!headers['Authorization'] && typeof window !== 'undefined') {
        const storedMap = JSON.parse(localStorage.getItem('commission_key_map') || '{}');
        const specificKey = storedMap[id];
        if (specificKey) {
            headers['X-Commission-Key'] = specificKey;
        }
    }

    const res = await fetch(`${API_BASE}/commissions/${id}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, user: username })
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
}

export async function fetchProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}

export async function fetchCommissions() {
    const headers = getHeaders();
    const res = await fetch(`${API_BASE}/commissions`, { headers });
    if (!res.ok) throw new Error('Failed to fetch commissions');
    return res.json();
}

export async function createCommission(data) {
    const res = await fetch(`${API_BASE}/commissions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create commission');
    return res.json();
}

export async function updateCommission(id, data) {
    const res = await fetch(`${API_BASE}/commissions/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update commission');
    return res.json();
}

export async function deleteCommission(id) {
    const res = await fetch(`${API_BASE}/commissions/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete commission');
    return res.json();
}



export async function deleteCommissionLog(logId) {
    const res = await fetch(`${API_BASE}/commissions/logs/${logId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete log');
    return res.json();
}

export async function createProject(projectData) {
    const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
}

export async function deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
}

export async function fetchPosts() {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
}

export async function likePost(id) {
    const res = await fetch(`${API_BASE}/posts/${id}/like`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to like post');
    return res.json();
}
