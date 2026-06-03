import { initLoginForm } from './components/login.js';
import { initDashboard } from './components/dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login-form')) {
        initLoginForm();
    }
    if (document.getElementById('dashboard-page')) {
        initDashboard();
    }
});
