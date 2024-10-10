const emailFrame = document.querySelector('.change-email-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.change-email-btn') && emailFrame.classList.contains('none')) {
        emailFrame.classList.remove('none')
    }
    if (event.target.closest('.change-email-close-btn')) {
        event.preventDefault();
        emailFrame.classList.add('none')
    }
})