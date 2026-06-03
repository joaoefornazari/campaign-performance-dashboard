import { storage } from '../utils/storage.js';

export function initDashboard() {
    const token = storage.getToken();
    const user = storage.getUser();

    if (!token) {
        window.location.href = '/login';
        return;
    }

    const welcomeEl = document.getElementById('welcome-message');
    if (welcomeEl && user) {
        welcomeEl.textContent = `Welcome, ${user.name}!`;
    }
}
