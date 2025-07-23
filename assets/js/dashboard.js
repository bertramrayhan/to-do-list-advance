document.addEventListener('DOMContentLoaded', function(e) {
    checkLoginStatus();
    loadTasks();
})

async function checkLoginStatus() {
    try {
        const response = await fetch('php/checkSession.php', {
            method: 'GET'
        });

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const confirmation = await response.json();
        if(confirmation.loggedIn){
            document.getElementById('username').textContent = confirmation.username + '!';
        }else {
            window.location.href = 'login.html';
        }

    } catch (error) {
        console.error(error);
        window.location.href = 'login.html';
    }
}

document.getElementById('logout-btn').addEventListener('click', function(){
    logout();    
})

async function logout(){
    try {
        const response = await fetch('php/logout.php', {
            method: 'GET'
        });

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const confirmation = await response.json();
        console.log(confirmation.success)
        console.log(confirmation.message);
        if(confirmation.success){
            window.location.href = 'login.html';
        }

    } catch (error) {
        console.error(error);
    }
}

async function loadTasks(){
    try {
        const response = await fetch('php/sendTasks.php', {
            method: 'GET'
        });

        const hasil = await response.json();

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if(!hasil.success){
            console.log(hasil.message);
        }else {
            for (const task of hasil.tasks) {
                console.log(task.title);
            }
        }

    } catch (error) {
        console.error(error);
    }
}