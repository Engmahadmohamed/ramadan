// Import Firebase services from config
import { auth } from './config.js';

// Admin credentials
const adminEmail = 'mahadmoha178@gmail.com';
const adminPassword = '12345678';

// DOM Elements
const adminPanel = document.getElementById('adminPanel');

// Function to show error message
const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'white';
    errorDiv.style.background = '#e74c3c';
    errorDiv.style.padding = '1rem';
    errorDiv.style.borderRadius = '6px';
    errorDiv.style.marginBottom = '1rem';
    errorDiv.textContent = message;
    adminPanel.insertBefore(errorDiv, adminPanel.firstChild);
    setTimeout(() => errorDiv.remove(), 5000);
};

// Function to create admin account
const createAdminAccount = async () => {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(adminEmail, adminPassword);
        console.log('Admin account created successfully');
        return userCredential.user;
    } catch (error) {
        console.error('Error creating admin account:', error);
        if (error.code !== 'auth/email-already-in-use') {
            showError(`Failed to create admin account: ${error.message}`);
            throw error;
        }
        return null;
    }
};

// Function to sign in admin
const signInAdmin = async () => {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(adminEmail, adminPassword);
        console.log('Admin signed in successfully');
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        if (error.code === 'auth/user-not-found') {
            // If user doesn't exist, create account and try again
            await createAdminAccount();
            return signInAdmin();
        }
        showError(`Failed to sign in: ${error.message}`);
        throw error;
    }
};

// Initialize admin authentication
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        try {
            await signInAdmin();
        } catch (error) {
            console.error('Failed to initialize admin:', error);
        }
    }
});

// Export admin functions
export { createAdminAccount, signInAdmin };