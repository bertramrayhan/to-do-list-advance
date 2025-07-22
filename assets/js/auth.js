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

    checkUsernameAndPassword(usernameInput, passwordInput);
});

registerForm.addEventListener('submit', async function(e){
    e.preventDefault();

    let usernameInput = usernameInputRegister.value.trim();
    let passwordInput = passwordInputRegister.value.trim();

    if(checkUsernameAndPassword(usernameInput, passwordInput)){
        register(usernameInput, passwordInput);
    }
});

async function register(usernameInput, passwordInput){
    try {
        const response = await fetch('php/register.php', {
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
        if(!hasil.success){
            showNotification(hasil.message, 'error');
        }else{
            usernameInputRegister.value = '';
            passwordInputRegister.value = '';
            showNotification(hasil.message, 'success');
            changePage();
        }

    } catch (error) {
        console.log(error);
    }
}

function checkUsernameAndPassword(usernameInput, passwordInput) {
    console.log(usernameInput);
    console.log(passwordInput);

    if(usernameInput.length < 4){
        showNotification('Username minimal 4 karakter', 'error');
        return false;
    }else if(usernameInput.length > 25){
        showNotification('Username maksimal 25 karakter', 'error')
        return false;
    }else if(!/^[a-zA-Z0-9_\.]+$/.test(usernameInput)){
        showNotification('Username hanya boleh menggunakan abjad (a-z), angka, garis bawah (_), dan titik (.)', 'error');
        return false;
    }
    if(passwordInput.length < 8){
        showNotification('Password minimal 8 karakter', 'error')
        return false;
    }else if(passwordInput.length > 50){
        showNotification('Password maksimal 50 karakter', 'error')
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