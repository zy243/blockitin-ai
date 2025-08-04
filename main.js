// main.js - Complete Implementation

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in on protected pages
    if (isProtectedPage()) {
        checkLoginStatus();
    }

    // Initialize wallet connection if on a page that needs it
    if (document.getElementById('connectWalletBtn')) {
        document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    }

    // Initialize timetable form if present
    if (document.getElementById('timetableForm')) {
        checkRoleForTimetable();
    }

    // Initialize login form if present
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();
            login();
        });
    }
});

/**
 * Check if current page requires authentication
 */
function isProtectedPage() {
    const protectedPages = ['dashboard.html', 'timetable.html', 'profile.html'];
    return protectedPages.some(page => window.location.pathname.endsWith(page));
}

/**
 * Verify user login status and redirect if not logged in
 */
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html';
    }
}

/**
 * Handle wallet connection
 */
async function connectWallet() {
    if (!window.ethereum) {
        alert('Please install MetaMask to use this feature.');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            document.getElementById('status').innerText = '✅ Wallet connected';
            document.getElementById('walletAddress').innerText = `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
            localStorage.setItem('walletAddress', accounts[0]);
        }
    } catch (error) {
        console.error('Wallet connection error:', error);
        document.getElementById('status').innerText = '❌ Wallet connection failed';
        if (error.code === 4001) {
            alert('Please connect your wallet to continue.');
        }
    }
}

/**
 * Handle user login
 */
function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email] && users[email].password === password) {
        localStorage.setItem('loggedInUser', email);
        localStorage.setItem('role', users[email].role);

        // Store login timestamp
        localStorage.setItem('lastLogin', new Date().toISOString());

        window.location.href = 'dashboard.html';
    } else {
        alert('❌ Invalid email or password.');
    }
}

/**
 * Check user role for timetable access
 */
function checkRoleForTimetable() {
    const role = localStorage.getItem('role');
    const form = document.getElementById('timetableForm');

    if (!form) return;

    // Disable form if not student
    if (role !== 'student') {
        const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"]');
        inputs.forEach(input => {
            input.disabled = true;
            input.classList.add('disabled-input');
        });

        const warning = document.createElement('div');
        warning.className = 'alert alert-warning';
        warning.innerHTML = '<strong>Note:</strong> Only students can edit the timetable.';
        form.prepend(warning);
    }

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const timetable = {
            monday: document.getElementById('monday').value,
            tuesday: document.getElementById('tuesday').value,
            wednesday: document.getElementById('wednesday').value,
            thursday: document.getElementById('thursday').value,
            friday: document.getElementById('friday').value,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('studentTimetable', JSON.stringify(timetable));

        // Show success message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = 'Timetable saved successfully!';
        form.prepend(alertDiv);

        // Remove message after 3 seconds
        setTimeout(() => alertDiv.remove(), 3000);
    });

    // Load existing timetable data
    const saved = JSON.parse(localStorage.getItem('studentTimetable'));
    if (saved) {
        document.getElementById('monday').value = saved.monday || '';
        document.getElementById('tuesday').value = saved.tuesday || '';
        document.getElementById('wednesday').value = saved.wednesday || '';
        document.getElementById('thursday').value = saved.thursday || '';
        document.getElementById('friday').value = saved.friday || '';
    }
}

/**
 * Redirect to signup page
 */
function goToSignup() {
    window.location.href = 'signup.html';
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('role');
    localStorage.removeItem('lastLogin');
    window.location.href = 'login.html';
}

/**
 * Register new user
 */
function register() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    if (!email || !password || !confirmPassword) {
        alert('Please fill all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email]) {
        alert('Email already registered.');
        return;
    }

    users[email] = {
        password: password,
        role: role || 'student',
        registeredAt: new Date().toISOString()
    };

    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful!');
    window.location.href = 'login.html';
}

// Add to window object for HTML onclick attributes
window.connectWallet = connectWallet;
window.login = login;
window.goToSignup = goToSignup;
window.logout = logout;
window.register = register;