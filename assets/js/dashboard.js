import { loadTasks } from "./manageTasks.js";
import { showNotification } from "./notification.js";

function makeResponse(body = undefined){
    if(body === undefined){
        return {
            method: 'GET'
        }
    }else {
        return {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    }
}

let titleInput = document.getElementById('title-input');
let descriptionInput = document.getElementById('description-input');
let currentIdTask = '';
let originalTitle = '';
let originalDescription = '';

//LOGIN PAGE
document.addEventListener('DOMContentLoaded', function(e) {
    checkLoginStatus();
})

async function checkLoginStatus() {
    try {
        const response = await fetch('php/checkSession.php', makeResponse());

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
        const response = await fetch('php/logout.php', makeResponse());

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
        const response = await fetch('php/sendTasks.php', makeResponse());

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
    const btnDelete = e.target.closest('.delete-btn');
    const btnEdit = e.target.closest('.edit-btn');
    const checkboxStatus = e.target.closest('.status-task-cbx');

    if(btnDelete){
        e.preventDefault();

        console.log('Button found:', btnDelete);
        console.log('Dataset:', btnDelete.dataset);
        const idTask = btnDelete.dataset['idTask'];
        console.log('ID Task:', idTask);
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            deleteTask(idTask);
        }
    }
    if(btnEdit){
        console.log('Button found:', btnEdit);
        console.log('Dataset:', btnEdit.dataset);
        const idTask = btnEdit.dataset['idTask'];
        console.log('ID Task:', idTask);
        currentIdTask = idTask;

        const cardTask = btnEdit.closest('.card-task');

        originalTitle = cardTask.querySelector('.title').textContent;
        originalDescription = cardTask.querySelector('.description').textContent;
        titleInput.value = originalTitle;
        descriptionInput.value = originalDescription;

        openAddTaskModal();
    }
    if(checkboxStatus){
        const idTask = checkboxStatus.dataset['idTask'];
        console.log('ID Task:', idTask);
        changeStatusTask(checkboxStatus, idTask);
    }
});
async function deleteTask(idTask){
    try {
        const response = await fetch('php/deleteTask.php', makeResponse({idTask: idTask}));

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

async function changeStatusTask(checkboxStatus, idTask){
    const cardTask = checkboxStatus.closest('.card-task');
    const title = cardTask.querySelector('.title');

    checkboxStatus.checked ? title.classList.add('completed') : title.classList.remove('completed');

    try {
        const response = await fetch('php/changeStatusTask.php', makeResponse({idTask: idTask, statusTask: checkboxStatus.checked}));

        if(!response.ok){
            throw new Error(`HTTP error! status ${response.status}`);
        }

        const konfirmasi = await response.json();
        if(!konfirmasi.success){
            checkboxStatus.checked = !checkboxStatus.checked;
            checkboxStatus.checked ? title.classList.add('completed') : title.classList.remove('completed');
            console.log(konfirmasi.message);
        }

    } catch (error) {
        console.error(error);
        checkboxStatus.checked = !checkboxStatus.checked;
        checkboxStatus.checked ? title.classList.add('completed') : title.classList.remove('completed');
    }
}

//ADD TASK MODAL
let addTaskContainer = document.getElementById('add-task-container');
let modalBackdrop = document.getElementById('modal-backdrop');
document.getElementById('add-task-btn').addEventListener('click', openAddTaskModal);
function openAddTaskModal(){
    if(addTaskContainer.classList.contains('hidden')){
        if(currentIdTask !== ''){
            document.getElementById('add-task-heading').textContent = 'Perbarui Tugas';
        }else {
            document.getElementById('add-task-heading').textContent = 'Buat Tugas Baru';
        }

        addTaskContainer.classList.remove('hidden');
        modalBackdrop.classList.remove('hidden');

        setTimeout(() => {
            addTaskContainer.classList.add('show');
        }, 10);
    }
}

let cancelBtn = document.getElementById('cancel-btn');
cancelBtn.addEventListener('click', function(){
    currentIdTask = '';
    addTaskContainer.classList.remove('show');
    
    setTimeout(() => {
        addTaskContainer.classList.add('hidden');
        modalBackdrop.classList.add('hidden');

        titleInput.value = '';
        descriptionInput.value = '';
    }, 200);
});

document.getElementById('add-task-form').addEventListener('submit', function(e){
    e.preventDefault();

    submitTask();
})
async function submitTask(){
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if(title === '' || description === ''){
        showNotification('Judul atau deskripsi tidak terisi', 'error');
        return;
    }

    if(title === originalTitle && description === originalDescription){
        originalTitle = '';
        originalDescription = '';
        cancelBtn.click();
        showNotification('Task berhasil diperbarui', 'success');
        return;
    }

    try {
        let response;

        if(currentIdTask !== ''){
            response = await fetch('php/editTask.php', makeResponse({idTask: currentIdTask, title: title, description: description}));
        }else {
            response = await fetch('php/addTask.php', makeResponse({title: title, description: description}));
        }

        if(!response.ok){
            throw new Error(`HTTP error!. status ${response.status}`);
        }

        const konfirmasi = await response.json();
        if(konfirmasi.success){
            await getTasks();
            cancelBtn.click();
            showNotification(konfirmasi.message, 'success');
            
            currentIdTask = '';
        }else {
            showNotification(konfirmasi.message, 'error');
        }

    } catch (error) {
        console.error(error);
    }
}