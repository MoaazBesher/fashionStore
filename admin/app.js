// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbv5agQov4LyezPbWM_XC8qk8bkbh8EX8",
    authDomain: "market-products-d3b84.firebaseapp.com",
    databaseURL: "https://market-products-d3b84-default-rtdb.firebaseio.com",
    projectId: "market-products-d3b84",
    storageBucket: "market-products-d3b84.firebasestorage.app",
    messagingSenderId: "383604293089",
    appId: "1:383604293089:web:a59e21488df2f0bdbfe6a0",
    measurementId: "G-HK5H94NJZG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM elements
const loginContainer = document.getElementById('loginContainer');
const dashboard = document.getElementById('dashboard');
const googleSignInBtn = document.getElementById('googleSignIn');
const logoutBtn = document.getElementById('logoutBtn');
const errorMessage = document.getElementById('errorMessage');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');

// Allowed users from your database
let allowedUsers = [];

// Fetch allowed users from database
function fetchAllowedUsers() {
    database.ref('users').once('value').then((snapshot) => {
        const users = snapshot.val();
        if (users) {
            allowedUsers = Object.values(users);
        }
    }).catch((error) => {
        console.error("Error fetching allowed users:", error);
    });
}

// Check if user is allowed to login
function isUserAllowed(email) {
    return allowedUsers.some(user => user.email === email);
}

// Google Sign-In
function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            if (isUserAllowed(user.email)) {
                showDashboard(user);
            } else {
                auth.signOut();
                errorMessage.textContent = "This email is not authorized to access the dashboard.";
            }
        })
        .catch((error) => {
            console.error("Google Sign-In Error:", error);
            errorMessage.textContent = error.message;
        });
}

// Show dashboard
function showDashboard(user) {
    loginContainer.style.display = 'none';
    dashboard.style.display = 'block';
    
    userName.textContent = user.displayName || 'User';
    userEmail.textContent = user.email;
    
    if (user.photoURL) {
        userAvatar.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
    }
}

// Sign out
function signOut() {
    auth.signOut()
        .then(() => {
            dashboard.style.display = 'none';
            loginContainer.style.display = 'block';
            errorMessage.textContent = '';
        })
        .catch((error) => {
            console.error("Sign Out Error:", error);
        });
}

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        if (isUserAllowed(user.email)) {
            showDashboard(user);
        } else {
            auth.signOut();
            errorMessage.textContent = "This email is not authorized to access the dashboard.";
        }
    }
});

// Event listeners
googleSignInBtn.addEventListener('click', googleSignIn);
logoutBtn.addEventListener('click', signOut);

// Initialize
fetchAllowedUsers();