// Auth state
let currentUser = API.getUser();

// Initialize auth UI
const initAuth = () => {
    updateAuthUI();
};

// Update auth UI
const updateAuthUI = () => {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');

    if (API.auth.isAuthenticated()) {
        currentUser = API.getUser();

        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
            const userName = document.getElementById('user-name');
            if (userName) userName.textContent = currentUser.name;
        }
    } else {
        if (authButtons) authButtons.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
};

// Show login modal
const showLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.add('active');
};

// Hide login modal
const hideLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.remove('active');
};

// Show register modal
const showRegisterModal = () => {
    const modal = document.getElementById('register-modal');
    if (modal) modal.classList.add('active');
};

// Hide register modal
const hideRegisterModal = () => {
    const modal = document.getElementById('register-modal');
    if (modal) modal.classList.remove('active');
};

// Handle login
const handleLogin = async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await API.auth.login({ email, password });

        if (response.success) {
            hideLoginModal();
            updateAuthUI();
            showNotification('Login successful!', 'success');

            const redirect = localStorage.getItem('postLoginRedirect');
            if (redirect) {
                localStorage.removeItem('postLoginRedirect');
                window.location.href = redirect;
                return;
            }

            // Reload cart with user data
            if (window.Cart) {
                await window.Cart.init();
            }
        }
    } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
    }
};

// Handle register
const handleRegister = async (event) => {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await API.auth.register({ name, email, password });

        if (response.success) {
            hideRegisterModal();
            updateAuthUI();
            showNotification('Registration successful!', 'success');

            const redirect = localStorage.getItem('postLoginRedirect');
            if (redirect) {
                localStorage.removeItem('postLoginRedirect');
                window.location.href = redirect;
                return;
            }

            // Reload cart with user data
            if (window.Cart) {
                await window.Cart.init();
            }
        }
    } catch (error) {
        showNotification(error.message || 'Registration failed', 'error');
    }
};

// Handle logout
const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
        API.auth.logout();
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();

    // Attach event listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Export auth functions
window.Auth = {
    init: initAuth,
    showLogin: showLoginModal,
    hideLogin: hideLoginModal,
    showRegister: showRegisterModal,
    hideRegister: hideRegisterModal,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: API.auth.isAuthenticated,
    getUser: API.getUser,
};
