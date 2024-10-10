const notificationsFrame = document.querySelector('.notifications-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.notification-btn') && notificationsFrame.classList.contains('none')) {
        notificationsFrame.classList.remove('none')
    }
    if (event.target.closest('.notifications-close-btn')) {
        notificationsFrame.classList.add('none')
    }
})