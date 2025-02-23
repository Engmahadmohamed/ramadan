// Firebase initialization and configuration
const firebaseConfig = {
    apiKey: "AIzaSyDc6Dc8aqsFTf3ll0OZkN8Fwv2t-e4Y80w",
    authDomain: "ramadan-a7532.firebaseapp.com",
    databaseURL: "https://ramadan-a7532-default-rtdb.firebaseio.com",
    projectId: "ramadan-a7532",
    storageBucket: "ramadan-a7532.firebasestorage.app",
    messagingSenderId: "936336312827",
    appId: "1:936336312827:web:3a971eaa4895e5466be35e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const database = firebase.database();
const auth = firebase.auth();

// Set up database error handling
database.ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === true) {
        console.log('Connected to Firebase');
    } else {
        console.error('Not connected to Firebase');
    }
});

// Export initialized services
window.database = database;
window.auth = auth;