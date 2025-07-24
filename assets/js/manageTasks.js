let containerCardsTask = document.getElementById('main-container-cards-task');
const cardTaskTemplate = document.getElementById('card-task-template');

export function loadTasks(tasks){
    if(tasks.length === 0){
        document.getElementById('main-container-cards-task-text').style.display = 'block';
    }else{
        document.getElementById('main-container-cards-task-text').style.display = 'none';
    }

    containerCardsTask.innerHTML = '';

    for (const task of tasks) {
        const cardTaskClone = cardTaskTemplate.content.cloneNode(true);

        const checkbox = cardTaskClone.querySelector('.status-task-cbx');
        checkbox.checked = task.status === 1;

        const title = cardTaskClone.querySelector('.title');
        title.textContent = task.title;
        if(task.status === 1) {
            title.classList.add('completed');
        }

        const description = cardTaskClone.querySelector('.description');
        description.textContent = task.description;
        if(task.status === 1) {
            description.classList.add('completed');
        }
        
        const deleteBtn = cardTaskClone.querySelector('.delete-btn');
        deleteBtn.setAttribute('data-id-task', task['id_task']);

        containerCardsTask.appendChild(cardTaskClone);
    }
}