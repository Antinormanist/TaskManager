const accountExitFrame = document.querySelector('.account-exit')

window.addEventListener('click', (event) => {
    if (event.target.closest('.exit-btn') && accountExitFrame.classList.contains('none')) {
        accountExitFrame.classList.remove('none')
    } 
    if (event.target.closest('.account-close-btn')) {
        accountExitFrame.classList.add('none')
    }
})