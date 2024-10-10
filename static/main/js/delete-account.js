const delAcFr = document.querySelector('.account-delete-sumbit-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.delete-account') && delAcFr.classList.contains('none')) {
        delAcFr.classList.remove('none')
    }
    if (event.target.closest('.account-delete-sumbit-close-btn')) {
        event.preventDefault();
        delAcFr.classList.add('none')
    }
})