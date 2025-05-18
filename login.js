const auth = window.auth;

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

loginBtn.onclick = async () => {
  try {
    await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
    localStorage.setItem("userEmail", emailInput.value);
    window.location.href = "notes.html";
  } catch (error) {
    alert(error.message);
  }
};

signupBtn.onclick = async () => {
  try {
    await auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value);
    alert("Account created. You can now log in.");
  } catch (error) {
    alert(error.message);
  }
};
