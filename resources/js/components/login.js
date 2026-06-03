import { login } from '../services/authService.js';
import { storage } from '../utils/storage.js';

export function initLoginForm() {
    if (storage.getToken()) {
        window.location.href = '/dashboard';
        return;
    }

    const form = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('hidden');
        errorEl.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        try {
            const data = await login(email, password);
            storage.setToken(data.token);
            storage.setUser(data.user);
            window.location.href = '/dashboard';
        } catch (err) {
            errorEl.textContent = err.message || 'Invalid credentials. Please try again.';
            errorEl.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign in';
        }
    });
}
