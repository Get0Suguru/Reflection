// Dashboard JavaScript for Reflection App

// Global variables
let currentEntries = [];
let currentEditingId = null;
let currentView = 'grid';

// API Base URL
const API_BASE_URL = '/api';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadEntries();
    updateStats();
});

function initializeDashboard() {
    // Check authentication
    const credentials = localStorage.getItem('authCredentials');
    const username = localStorage.getItem('username');
    
    if (!credentials || !username) {
        window.location.href = '/index.html';
        return;
    }
    
    // Display username
    document.getElementById('username-display').textContent = username;
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entryDate').value = today;
}

function setupEventListeners() {
    // Entry form submission
    document.getElementById('entryForm').addEventListener('submit', handleEntrySubmit);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const entryModal = document.getElementById('entryModal');
        const viewModal = document.getElementById('viewModal');
        
        if (event.target === entryModal) {
            closeEntryModal();
        }
        if (event.target === viewModal) {
            closeViewModal();
        }
    });
    
    // Close user dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        
        if (!userMenu.contains(event.target)) {
            userDropdown.classList.remove('show');
        }
    });
}

// API Functions
async function makeAuthenticatedRequest(url, options = {}) {
    const credentials = localStorage.getItem('authCredentials');
    
    if (!credentials) {
        window.location.href = '/index.html';
        return;
    }
    
    const defaultOptions = {
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    const response = await fetch(url, { ...options, ...defaultOptions });
    
    if (response.status === 401) {
        localStorage.removeItem('authCredentials');
        localStorage.removeItem('username');
        window.location.href = '/index.html';
        return;
    }
    
    return response;
}

async function loadEntries() {
    showLoading();
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/journals/all`);
        
        if (response && response.ok) {
            currentEntries = await response.json();
            displayEntries(currentEntries);
            updateStats();
        } else {
            throw new Error('Failed to load entries');
        }
    } catch (error) {
        console.error('Error loading entries:', error);
        showErrorToast('Failed to load entries. Please try again.');
    } finally {
        hideLoading();
    }
}

async function createEntry(entryData) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/journals/create`, {
            method: 'POST',
            body: JSON.stringify(entryData)
        });
        
        if (response && response.ok) {
            showSuccessToast('Entry created successfully!');
            loadEntries(); // Reload entries
            closeEntryModal();
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create entry');
        }
    } catch (error) {
        console.error('Error creating entry:', error);
        showErrorToast(error.message || 'Failed to create entry. Please try again.');
    }
}

async function updateEntry(entryId, entryData) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/journals/update/${entryId}`, {
            method: 'PUT',
            body: JSON.stringify(entryData)
        });
        
        if (response && response.ok) {
            showSuccessToast('Entry updated successfully!');
            loadEntries(); // Reload entries
            closeEntryModal();
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update entry');
        }
    } catch (error) {
        console.error('Error updating entry:', error);
        showErrorToast(error.message || 'Failed to update entry. Please try again.');
    }
}

async function deleteEntryById(entryId) {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/journals/delete/${entryId}`, {
            method: 'DELETE'
        });
        
        if (response && response.ok) {
            showSuccessToast('Entry deleted successfully!');
            loadEntries(); // Reload entries
            closeViewModal();
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to delete entry');
        }
    } catch (error) {
        console.error('Error deleting entry:', error);
        showErrorToast(error.message || 'Failed to delete entry. Please try again.');
    }
}

// Display Functions
function displayEntries(entries) {
    const entriesGrid = document.getElementById('entriesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!entries || entries.length === 0) {
        entriesGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    entriesGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    entriesGrid.innerHTML = sortedEntries.map(entry => createEntryCard(entry)).join('');
}

function createEntryCard(entry) {
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const preview = entry.content.length > 150 
        ? entry.content.substring(0, 150) + '...'
        : entry.content;
    
    return `
        <div class="entry-card" onclick="viewEntry('${entry.id}')">
            <div class="entry-header">
                <div>
                    <h3 class="entry-title">${escapeHtml(entry.title)}</h3>
                    <div class="entry-date">${formattedDate}</div>
                </div>
                <div class="entry-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="editEntryById('${entry.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteEntryById('${entry.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="entry-preview">${escapeHtml(preview)}</div>
        </div>
    `;
}

function updateStats() {
    const totalEntries = currentEntries.length;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonthEntries = currentEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate streak (simplified - consecutive days with entries)
    let streak = 0;
    const today = new Date();
    const sortedEntries = [...currentEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let i = 0; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].date);
        const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
            streak++;
        } else {
            break;
        }
    }
    
    document.getElementById('totalEntries').textContent = totalEntries;
    document.getElementById('thisMonth').textContent = thisMonthEntries;
    document.getElementById('streak').textContent = streak;
}

// Modal Functions
function showNewEntryModal() {
    document.getElementById('modalTitle').textContent = 'New Journal Entry';
    document.getElementById('entryForm').reset();
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('entryModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    currentEditingId = null;
    
    // Focus on title input
    setTimeout(() => {
        document.getElementById('entryTitle').focus();
    }, 100);
}

function closeEntryModal() {
    document.getElementById('entryModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentEditingId = null;
}

function viewEntry(entryId) {
    const entry = currentEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('viewTitle').textContent = entry.title;
    document.getElementById('viewDate').textContent = formattedDate;
    document.getElementById('viewContent').textContent = entry.content;
    
    // Set up edit and delete buttons
    document.getElementById('editBtn').onclick = () => editEntryById(entryId);
    document.getElementById('deleteBtn').onclick = () => deleteEntryById(entryId);
    
    document.getElementById('viewModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function editEntryById(entryId) {
    const entry = currentEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    // Close view modal if open
    closeViewModal();
    
    // Populate form with entry data
    document.getElementById('modalTitle').textContent = 'Edit Journal Entry';
    document.getElementById('entryTitle').value = entry.title;
    document.getElementById('entryContent').value = entry.content;
    document.getElementById('entryDate').value = entry.date;
    
    currentEditingId = entryId;
    document.getElementById('entryModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Event Handlers
async function handleEntrySubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('entryTitle').value.trim();
    const content = document.getElementById('entryContent').value.trim();
    const date = document.getElementById('entryDate').value;
    
    if (!title || !content || !date) {
        showErrorToast('Please fill in all fields.');
        return;
    }
    
    const entryData = {
        title: title,
        content: content,
        date: date
    };
    
    if (currentEditingId) {
        await updateEntry(currentEditingId, entryData);
    } else {
        await createEntry(entryData);
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayEntries(currentEntries);
        return;
    }
    
    const filteredEntries = currentEntries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm) ||
        entry.content.toLowerCase().includes(searchTerm)
    );
    
    displayEntries(filteredEntries);
}

// View Functions
function setView(view) {
    currentView = view;
    const entriesGrid = document.getElementById('entriesGrid');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Update button states
    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Update grid class
    if (view === 'list') {
        entriesGrid.classList.add('list-view');
    } else {
        entriesGrid.classList.remove('list-view');
    }
}

// Sidebar Functions
function showAllEntries() {
    displayEntries(currentEntries);
    updateSidebarActive('showAllEntries');
}

function showRecentEntries() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEntries = currentEntries.filter(entry => 
        new Date(entry.date) >= oneWeekAgo
    );
    
    displayEntries(recentEntries);
    updateSidebarActive('showRecentEntries');
}

function showFavorites() {
    // For now, show all entries (favorites feature can be added later)
    displayEntries(currentEntries);
    updateSidebarActive('showFavorites');
}

function updateSidebarActive(activeFunction) {
    const sidebarButtons = document.querySelectorAll('.sidebar-btn');
    sidebarButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to the clicked button
    const activeButton = Array.from(sidebarButtons).find(btn => 
        btn.onclick && btn.onclick.toString().includes(activeFunction)
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// User Menu Functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function showProfile() {
    showInfoToast('Profile feature coming soon!');
}

function showSettings() {
    showInfoToast('Settings feature coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('authCredentials');
        localStorage.removeItem('username');
        window.location.href = '/index.html';
    }
}

// Utility Functions
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showSuccessToast(message) {
    showToast(message, 'success');
}

function showErrorToast(message) {
    showToast(message, 'error');
}

function showInfoToast(message) {
    showToast(message, 'info');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

// Global functions for onclick handlers
window.showNewEntryModal = showNewEntryModal;
window.closeEntryModal = closeEntryModal;
window.viewEntry = viewEntry;
window.closeViewModal = closeViewModal;
window.editEntry = editEntryById;
window.deleteEntry = deleteEntryById;
window.editEntryById = editEntryById;
window.deleteEntryById = deleteEntryById;
window.setView = setView;
window.showAllEntries = showAllEntries;
window.showRecentEntries = showRecentEntries;
window.showFavorites = showFavorites;
window.toggleUserMenu = toggleUserMenu;
window.showProfile = showProfile;
window.showSettings = showSettings;
window.logout = logout;

// Add CSS animations for toasts
const toastStyle = document.createElement('style');
toastStyle.textContent = `
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyle);
