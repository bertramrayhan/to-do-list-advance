import { loadTasks } from "./manageTasks.js";
import { showNotification } from "./notification.js";

document.addEventListener('DOMContentLoaded', function(e) {
    checkLoginStatus();
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
            getTasks();

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

export async function getTasks(){
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
            loadTasks(hasil.tasks);
        }

    } catch (error) {
        console.error(error);
    }
}

document.getElementById('main-container-cards-task').addEventListener('click', function(e){
    e.preventDefault();

    const btnDelete = e.target.closest('.delete-btn');

    if(btnDelete){
        console.log('Button found:', btnDelete);
        console.log('Dataset:', btnDelete.dataset);
        const idTask = btnDelete.dataset['idTask'];
        console.log('ID Task:', idTask);
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            deleteTask(idTask);
        }
    }
});
async function deleteTask(idTask){
    try {
        const response = await fetch('php/deleteTask.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({idTask: idTask})
        });

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const confirmation = await response.json();
        if(confirmation.success){
            await getTasks();
            showNotification('Task berhasil dihapus!', 'success');
        }else {
            showNotification('Task gagal dihapus', 'error');
        }

    } catch (error) {
        console.error(error);
    }
}