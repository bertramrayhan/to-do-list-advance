import { showNotification } from "./notification.js";

let isLoginPage = true;
let loginContainer = document.getElementById('login-container');
let registerContainer = document.getElementById('register-container');
let usernameInputLogin = document.getElementById('username-input-login');
let usernameInputRegister = document.getElementById('username-input-register');
let passwordInputLogin = document.getElementById('password-input-login');
let passwordInputRegister = document.getElementById('password-input-register');
let registerForm = document.getElementById('register-form');
let loginForm = document.getElementById('login-form');

document.addEventListener('DOMContentLoaded', function() {
    usernameInputLogin.value = '';
    passwordInputLogin.value = '';
    usernameInputRegister.value = '';
    passwordInputRegister.value = '';
})

let textLoginAcc = document.getElementById('text-login-acc');
textLoginAcc.addEventListener('click', function(e){
    e.preventDefault();

    changePage();
});

let textRegisterAcc = document.getElementById('text-register-acc');
textRegisterAcc.addEventListener('click', function(e){
    e.preventDefault();

    changePage();
});

loginForm.addEventListener('submit', function(e){
    e.preventDefault();

    let usernameInput = usernameInputLogin.value.trim();
    let passwordInput = passwordInputLogin.value.trim();

    if(checkUsernameAndPassword(usernameInput, passwordInput)){
        registerAndLogin(usernameInput, passwordInput);
    }
});

registerForm.addEventListener('submit', async function(e){
    e.preventDefault();

    let usernameInput = usernameInputRegister.value.trim();
    let passwordInput = passwordInputRegister.value.trim();

    if(checkUsernameAndPassword(usernameInput, passwordInput)){
        registerAndLogin(usernameInput, passwordInput);
    }
});

async function registerAndLogin(usernameInput, passwordInput){
    const pathAuth = isLoginPage ? 'php/login.php' : 'php/register.php';

    try {
        const response = await fetch(pathAuth, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: usernameInput, password: passwordInput})
        });

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const hasil = await response.json();
        showNotification(hasil.message, hasil.success ? 'success' : 'error');

        if(!isLoginPage){
            usernameInputRegister.value = '';
            passwordInputRegister.value = '';
            if(hasil.success){
                changePage();
            }
        }else {
            usernameInputLogin.value = '';
            passwordInputLogin.value = '';
            console.log('tes');
            if(hasil.success){
                console.log('masuk');
                window.location.href = 'dashboard.html';
            }
        }

    } catch (error) {
        console.log(error);
    }
}

function checkUsernameAndPassword(username, password) {
    if (!username || !password) { // Hanya cek keberadaan dasar
        showNotification('Username dan password harus diisi', 'error');
        return false;
    }
    return true;
}

function changePage(){
    if(isLoginPage){
        loginForm.reset();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
        isLoginPage = false;
    }else{
        registerForm.reset();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        isLoginPage = true;
    }
}