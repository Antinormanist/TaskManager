const loginFrame = document.querySelector('.change-login-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.change-username-btn') && loginFrame.classList.contains('none')) {
        loginFrame.classList.remove('none')
    }
    if (event.target.closest('.change-login-close-btn')) {
        event.preventDefault();
        loginFrame.classList.add('none')
    }
})