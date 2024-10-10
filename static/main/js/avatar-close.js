const avaFr = document.querySelector('.avatar-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.change-pfp-btn') && avaFr.classList.contains('none')) {
        avaFr.classList.remove('none')
    } 
    if (event.target.closest('.avatar-close-btn')) {
        event.preventDefault()
        avaFr.classList.add('none')
    }
})