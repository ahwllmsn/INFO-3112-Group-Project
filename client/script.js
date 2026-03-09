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

loginTab.addEventListener('click', showLogin);
signupTab.addEventListener('click', showSignup);

for (const button of document.querySelectorAll('.toggle-password')) {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    const showing = target.type === 'text';
    target.type = showing ? 'password' : 'text';
    button.textContent = showing ? 'Show' : 'Hide';
  });
}

signupPassword.addEventListener('input', () => {
  validatePassword(signupPassword.value);
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearMessages();

  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = signupPassword.value;
  const confirmed = confirmPassword.value;

  if (!username || !email || !password || !confirmed) {
    signupMessage.className = 'message error';
    signupMessage.textContent = 'Please fill in all signup fields.';
    return;
  }

  if (!validatePassword(password)) {
    signupMessage.className = 'message error';
    signupMessage.textContent = 'Password does not meet all requirements.';
    return;
  }

  if (password !== confirmed) {
    signupMessage.className = 'message error';
    signupMessage.textContent = 'Passwords do not match.';
    return;
  }

  signupMessage.className = 'message success';
  signupMessage.textContent = 'Signup form is valid and ready for backend connection.';

  // Replace this later with your teammate's API endpoint.
  // Example:
  // fetch('http://localhost:9000/api/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, email, password }),
  // });
});

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

  loginMessage.className = 'message success';
  loginMessage.textContent = 'Login form is ready for backend connection.';

  // Validate login info (email + password) exists in the database.
  let loginResult = await api.users.validateLogin(email, password);
  if (loginResult.status == 200) {
    // Successful login...
    console.log("Successful login!"); // Temporary

  } else if (loginResult.status == 401) {
    // No email / password combination found in database...
    console.log("Incorrect username or password."); // Temporary
  } else {
    // Server-side error...
      console.log("Server-side error."); // Temporary
  }
});

showLogin();
