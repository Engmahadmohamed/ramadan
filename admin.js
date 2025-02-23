// Initialize Firebase Database
const database = firebase.database();

// DOM Elements
const userTableBody = document.getElementById('userTableBody');
const totalUsersElement = document.getElementById('totalUsers');
const totalRevealsElement = document.getElementById('totalReveals');
const totalSharesElement = document.getElementById('totalShares');

// Load and display users with real-time updates
function loadUsers() {
    showLoading();
    const usersRef = database.ref('users');
    
    // Listen for initial data and subsequent changes
    usersRef.on('value', (snapshot) => {
        const users = snapshot.val() || {};
        updateUserTable(users);
        updateStats(users);
        hideLoading();
    }, (error) => {
        console.error('Error loading users:', error);
        hideLoading();
        alert('Error loading user data. Please try refreshing the page.');
    });

    // Listen for specific changes
    usersRef.on('child_added', (snapshot) => {
        showSuccessMessage('New user registered');
    });

    usersRef.on('child_removed', (snapshot) => {
        showSuccessMessage('User removed');
    });
}

// Update user table
function updateUserTable(users) {
    userTableBody.innerHTML = '';
    Object.entries(users).forEach(([phoneNumber, userData]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${phoneNumber}</td>
            <td>${new Date(userData.registrationDate).toLocaleString()}</td>
            <td>${userData.shares || 0}</td>
            <td>
                <button class="delete-btn" onclick="deleteUser('${phoneNumber}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Update statistics
function updateStats(users) {
    const userCount = Object.keys(users).length;
    const totalReveals = Object.values(users).reduce((sum, user) => sum + (user.reveals || 0), 0);
    const totalShares = Object.values(users).reduce((sum, user) => sum + (user.shares || 0), 0);

    totalUsersElement.textContent = userCount;
    totalRevealsElement.textContent = totalReveals;
    totalSharesElement.textContent = totalShares;
}

// Delete user
function deleteUser(phoneNumber) {
    if (confirm('Are you sure you want to delete this user?')) {
        database.ref(`users/${phoneNumber}`).remove()
            .then(() => {
                showSuccessMessage('User deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            });
    }
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const rows = userTableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const phoneNumber = row.cells[0].textContent.toLowerCase();
        row.style.display = phoneNumber.includes(searchTerm) ? '' : 'none';
    });
}

// Show success message
function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    document.body.appendChild(successMessage);
    successMessage.style.display = 'block';

    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Initialize admin panel
loadUsers();