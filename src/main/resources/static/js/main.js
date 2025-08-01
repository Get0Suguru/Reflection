// Main JavaScript for Reflection App

// DOM Elements
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const closeModal = document.querySelector('.close');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// API Base URL
const API_BASE_URL = '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    animateJournalPages();
    setupSmoothScrolling();
});

function initializeApp() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Redirect to dashboard if already logged in
        window.location.href = '/dashboard.html';
    }
}

function setupEventListeners() {
    // Modal close events
    closeModal.addEventListener('click', closeAuthModal);
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            closeAuthModal();
        }
    });

    // Form submissions
    const loginFormElement = loginForm.querySelector('form');
    const registerFormElement = registerForm.querySelector('form');
    
    loginFormElement.addEventListener('submit', handleLogin);
    registerFormElement.addEventListener('submit', handleRegister);

    // Navigation
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Scroll effects
    window.addEventListener('scroll', handleScroll);
}

function setupSmoothScrolling() {
    // Add smooth scrolling behavior to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    // Add/remove navbar background on scroll
    if (scrolled > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }

    // Update active navigation link based on scroll position
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

        if (scrollPos >= top && scrollPos <= bottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Modal Functions
function showLogin() {
    authModal.style.display = 'block';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function showRegister() {
    authModal.style.display = 'block';
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    clearFormErrors();
}

function switchToLogin() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    clearFormErrors();
}

function switchToRegister() {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    clearFormErrors();
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());
    
    const inputElements = document.querySelectorAll('.form-group input');
    inputElements.forEach(input => {
        input.classList.remove('error');
        input.value = '';
    });
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!validateLoginForm(username, password)) {
        return;
    }
    
    const loginButton = e.target.querySelector('button[type="submit"]');
    const originalText = loginButton.textContent;
    
    try {
        loginButton.textContent = 'Signing In...';
        loginButton.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/public/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        if (response.ok) {
            const isValidLogin = await response.json();
            
            if (isValidLogin) {
                // Store credentials for Basic Auth
                const credentials = btoa(`${username}:${password}`);
                localStorage.setItem('authCredentials', credentials);
                localStorage.setItem('username', username);
                
                showSuccessMessage('Login successful! Redirecting to dashboard...');
                
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            } else {
                throw new Error('Invalid username or password');
            }
        } else {
            throw new Error('Login failed');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showErrorMessage(loginForm, error.message || 'Login failed. Please try again.');
    } finally {
        loginButton.textContent = originalText;
        loginButton.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!validateRegisterForm(username, password, confirmPassword)) {
        return;
    }
    
    const registerButton = e.target.querySelector('button[type="submit"]');
    const originalText = registerButton.textContent;
    
    try {
        registerButton.textContent = 'Creating Account...';
        registerButton.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/public/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                role: ['ROLE_USER'] // Default role
            })
        });
        
        if (response.ok) {
            showSuccessMessage('Account created successfully! Please sign in.');
            
            // Switch to login form after successful registration
            setTimeout(() => {
                switchToLogin();
                document.getElementById('loginUsername').value = username;
            }, 2000);
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Registration failed');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showErrorMessage(registerForm, error.message || 'Registration failed. Please try again.');
    } finally {
        registerButton.textContent = originalText;
        registerButton.disabled = false;
    }
}

// Validation Functions
function validateLoginForm(username, password) {
    clearFormErrors();
    let isValid = true;
    
    if (!username) {
        showFieldError('loginUsername', 'Username is required');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('loginPassword', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm(username, password, confirmPassword) {
    clearFormErrors();
    let isValid = true;
    
    if (!username) {
        showFieldError('registerUsername', 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showFieldError('registerUsername', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('registerPassword', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('registerPassword', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.parentElement;
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    formGroup.appendChild(errorElement);
}

function showErrorMessage(container, message) {
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.textAlign = 'center';
    errorElement.style.marginBottom = '1rem';
    errorElement.style.padding = '0.75rem';
    errorElement.style.backgroundColor = '#fef2f2';
    errorElement.style.border = '1px solid #fecaca';
    errorElement.style.borderRadius = '0.5rem';
    
    container.insertBefore(errorElement, container.querySelector('form'));
}

function showSuccessMessage(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.position = 'fixed';
    successElement.style.top = '20px';
    successElement.style.right = '20px';
    successElement.style.backgroundColor = '#10b981';
    successElement.style.color = 'white';
    successElement.style.padding = '1rem 1.5rem';
    successElement.style.borderRadius = '0.5rem';
    successElement.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    successElement.style.zIndex = '9999';
    successElement.style.animation = 'slideInRight 0.3s ease';
    
    document.body.appendChild(successElement);
    
    setTimeout(() => {
        successElement.remove();
    }, 3000);
}

// Animation Functions
function animateJournalPages() {
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;
    
    setInterval(() => {
        pages[currentPage].classList.remove('active');
        currentPage = (currentPage + 1) % pages.length;
        pages[currentPage].classList.add('active');
    }, 4000);
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .form-group input.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border-top: 1px solid var(--border-color);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Global functions for button clicks
window.showLogin = showLogin;
window.showRegister = showRegister;
window.scrollToFeatures = scrollToFeatures;
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
