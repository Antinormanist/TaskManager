const settingsFrame = document.querySelector('.account-settings')

window.addEventListener('click', (event) => {
    if (event.target.closest('.settings-btn') && settingsFrame.classList.contains('none')) {
        settingsFrame.classList.remove('none')
    }
    if (event.target.closest('.account-settings-close-btn')) {
        settingsFrame.classList.add('none')
    }
})