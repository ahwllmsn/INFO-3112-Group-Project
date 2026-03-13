import * as api from './src/util/api.js';

const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const loginMessage = document.getElementById('loginMessage');
const signupMessage = document.getElementById('signupMessage');

const signupPassword = document.getElementById('signupPassword');
const confirmPassword = document.getElementById('confirmPassword');

const passwordRules = {
  length: document.getElementById('rule-length'),
  uppercase: document.getElementById('rule-uppercase'),
  number: document.getElementById('rule-number'),
  special: document.getElementById('rule-special'),
};


/* =========================
   TAB SWITCHING
========================= */

function showLogin() {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');

  loginForm.classList.add('active-form');
  signupForm.classList.remove('active-form');

  clearMessages();
}

function showSignup() {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');

  signupForm.classList.add('active-form');
  loginForm.classList.remove('active-form');

  clearMessages();
}

function clearMessages() {
  loginMessage.textContent = '';
  signupMessage.textContent = '';

  loginMessage.className = 'message';
  signupMessage.className = 'message';
}


/* =========================
   PASSWORD VALIDATION
========================= */

function validatePassword(password) {

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_[\]\\/+=;'`~-]/.test(password),
  };

  Object.entries(checks).forEach(([key, passed]) => {
    passwordRules[key].classList.toggle('valid', passed);
  });

  return Object.values(checks).every(Boolean);
}


/* =========================
   USERNAME VALIDATION
========================= */

function validateUsername(username) {

  if (username.length < 3) {
    return false;
  }

  const regex = /^[a-zA-Z]+$/;

  return regex.test(username);
}


/* =========================
   EVENT LISTENERS
========================= */

loginTab.addEventListener('click', showLogin);
signupTab.addEventListener('click', showSignup);


/* =========================
   PASSWORD SHOW/HIDE
========================= */

for (const button of document.querySelectorAll('.toggle-password')) {

  button.addEventListener('click', () => {

    const target = document.getElementById(button.dataset.target);

    const showing = target.type === 'text';

    target.type = showing ? 'password' : 'text';

    button.textContent = showing ? 'Show' : 'Hide';

  });

}


/* =========================
   PASSWORD RULE CHECK
========================= */

signupPassword.addEventListener('input', () => {
  validatePassword(signupPassword.value);
});


/* =========================
   SIGNUP LOGIC
========================= */

signupForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  clearMessages();

  const firstName = document.getElementById('signupFirstName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = signupPassword.value;
  const confirmed = confirmPassword.value;

  if (!firstName || !email || !password || !confirmed) {

    signupMessage.className = 'message error';
    signupMessage.textContent = 'Please fill in all signup fields.';
    return;

  }

  if (!validateUsername(firstName)) {

    signupMessage.className = 'message error';
    signupMessage.textContent = 'Username must be at least 3 letters.';
    return;

  }

  if (!validatePassword(password)) {

    signupMessage.className = 'message error';
    signupMessage.textContent = 'Password does not meet requirements.';
    return;

  }

  if (password !== confirmed) {

    signupMessage.className = 'message error';
    signupMessage.textContent = 'Passwords do not match.';
    return;

  }

  const newUser = { firstName, email, password };

  let signUpResult = await api.users.newSignUp(newUser);


  if (signUpResult.status == 200) {

    signupMessage.className = "message success";
    signupMessage.textContent = "Account created successfully!";

  }
  else if (signUpResult.status == 409) {

    signupMessage.className = "message error";
    signupMessage.textContent = "Email already exists.";

  }
  else {

    signupMessage.className = "message error";
    signupMessage.textContent = "Server error.";

  }

});


/* =========================
   LOGIN LOGIC
========================= */

loginForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  clearMessages();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {

    loginMessage.className = 'message error';
    loginMessage.textContent = 'Please enter your email and password.';
    return;

  }

  let loginResult = await api.users.validateLogin(email, password);


  if (loginResult.status == 200) {

    loginMessage.className = "message success";
    loginMessage.textContent = "Login successful!";

    localStorage.setItem("userEmail", email);

    setTimeout(() => {

      window.location.href = "profile.html";

    }, 1000);

  }
  else if (loginResult.status == 401) {

    loginMessage.className = "message error";
    loginMessage.textContent = "Incorrect email or password.";

  }
  else {

    loginMessage.className = "message error";
    loginMessage.textContent = "Server error.";

  }

});


/* =========================
   INITIAL PAGE
========================= */

showLogin();