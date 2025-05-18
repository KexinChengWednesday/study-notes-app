const firebaseConfig = {
    apiKey: "AIzaSyCfHVEvMREX4XkVtSh55LS7mzrzJOb-HIQ",
    authDomain: "study-notes-webapp.firebaseapp.com",
    projectId: "study-notes-webapp",
    storageBucket: "study-notes-webapp.appspot.com",
    messagingSenderId: "160484210778",
    appId: "1:160484210778:web:6c10ca5adcfa7edf0f8063"
  };
  
  // Initialize Firebase only once
  firebase.initializeApp(firebaseConfig);
  
  // Attach to global window for use in other scripts
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  