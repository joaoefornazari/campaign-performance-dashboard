export async function login(email, password) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Login failed');
    }
    return data;
}

export async function logout(token) {
    const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Logout failed');
    }
    return data;
}
