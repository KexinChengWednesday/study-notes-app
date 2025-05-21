const firebaseConfig = {
  apiKey: ,
  authDomain:
  projectId: "study-notes-webapp",
  storageBucket: "study-notes-webapp.appspot.com",
  messagingSenderId: 
  appId: 
};

// Initialize Firebase only once
firebase.initializeApp(firebaseConfig);

// Attach to global window for use in other scripts
window.db = firebase.firestore();
window.auth = firebase.auth();
