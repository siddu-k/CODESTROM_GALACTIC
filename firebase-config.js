// =============================================
// Galactic AI — Firebase Configuration
// Shared across all pages (login, aiarea, research, etc.)
// =============================================

const firebaseConfig = {
    apiKey: "AIzaSyBMb1MvyVWLgDaOZaNcP8MuXwoCY9YiDL8",
    authDomain: "galactic-92d99.firebaseapp.com",
    projectId: "galactic-92d99",
    storageBucket: "galactic-92d99.firebasestorage.app",
    messagingSenderId: "330128906376",
    appId: "1:330128906376:web:52c91ddbc528c3331a673d",
    measurementId: "G-50FS0HCZ1B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =============================================
// User Settings Helpers (Firestore-backed)
// =============================================

// Save user settings (API key, model) to Firestore
async function saveUserSettings(settings) {
    const user = auth.currentUser;
    if (!user) {
        console.warn('No user logged in, cannot save settings to Firestore');
        return false;
    }
    try {
        await db.collection('users').doc(user.uid).set(settings, { merge: true });
        console.log('Settings saved to Firestore');
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Load user settings from Firestore
async function loadUserSettings() {
    const user = auth.currentUser;
    if (!user) {
        console.warn('No user logged in, cannot load settings from Firestore');
        return null;
    }
    try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
}

// Check if user is logged in, redirect to login if not
function requireAuth(redirectUrl = 'login.html') {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                window.location.href = redirectUrl;
            } else {
                resolve(user);
            }
        });
    });
}
