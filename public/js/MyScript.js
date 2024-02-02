
var firebase = require('./firebase');
document.addEventListener('DOMContentLoaded', function() {
  
  const loginLink = document.getElementById('login-item');
  const logoutLink = document.getElementById('logout-item');
  const registerLink = document.getElementById('register-item');
  firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'block'; 
    registerLink.style.display = 'none';
    const userEmail = user.email;
  const userEmailLink = document.getElementById('user-item');
  const emailLink = document.getElementById('user-link-email');
  emailLink.innerText = userEmail;
  userEmailLink.style.display = 'block';
  } else {
    loginLink.style.display = 'block';
    registerLink.style.display ='block';
    logoutLink.style.display = 'none';
    userEmailLink.style.display = 'none'; 
  }
  });
  logoutLink.addEventListener('click', (event) => {
  event.preventDefault();
  firebase.auth().signOut();
  });
  });