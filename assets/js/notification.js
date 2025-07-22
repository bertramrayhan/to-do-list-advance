export function showNotification(message, type = 'success'){
    let notification = document.getElementById('notification');
    let notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    notification.classList.add(type);
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.remove('hide');

        setTimeout(() => {
            notification.classList.remove(type);
        }, 400);
    }, 2000);
}