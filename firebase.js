import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    TwitterAuthProvider,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
 
 apiKey: "AIzaSyBI0HJ18hdUJFtHJZqXZAFXTFOZZ0gOXbA",
  authDomain: "bit-code-converter.firebaseapp.com",
  projectId: "bit-code-converter",
  storageBucket: "bit-code-converter.firebasestorage.app",
  messagingSenderId: "324385088905",
  appId: "1:324385088905:web:8af1c57536fc1eb1862d58",
  measurementId: "G-RQLTS0PSYB"
   
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function redirectToIndex(user) {
    const username = user.displayName || user.email;
    localStorage.setItem('username', username);

    // ✅ Store flag to trigger toast
    localStorage.setItem('showLoginToast', 'true');

    window.location.href = "index.html";
}


// Login handler
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            setTimeout(() => redirectToIndex(userCredential.user), 500);
        })
        .catch(error => alert(`Error: ${error.message}`));
});

// Signup handler
document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;

            updateProfile(user, { displayName: name })
                .then(() => {
                    localStorage.setItem('username', name);
                    alert('Signup Successful');
                    setTimeout(() => redirectToIndex(user), 500);
                })
                .catch(error => {
                    console.error("Error updating profile:", error);
                    alert(`Signup successful, but failed to update name: ${error.message}`);
                    setTimeout(() => redirectToIndex(user), 500);
                });
        })
        .catch(error => alert(`Error: ${error.message}`));
});

// Social login handler
window.socialLogin = function (provider) {
    let selectedProvider;

    switch (provider) {
        case 'Google':
            selectedProvider = new GoogleAuthProvider();
            selectedProvider.setCustomParameters({ prompt: 'select_account' });
            break;
        case 'GitHub':
            selectedProvider = new GithubAuthProvider();
            break;
        case 'Twitter':
            selectedProvider = new TwitterAuthProvider();
            break;
        default:
            alert("Unsupported provider");
            return;
    }

    signInWithPopup(auth, selectedProvider)
        .then(result => {
            alert(`Logged in with ${provider} successfully!`);
            setTimeout(() => redirectToIndex(result.user), 500);
        })
        .catch(error => alert(`Error: ${error.message}`));
};

import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

function logout() {
    signOut(auth).then(() => {
        localStorage.clear();
        window.location.href = "login.html";
    });
}
