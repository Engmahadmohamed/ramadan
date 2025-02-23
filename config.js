// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const database = getDatabase(app);
const auth = getAuth(app);

// Export initialized services
export { app, database, auth };