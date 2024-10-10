const ddKJFIDJFIOJDS = document.querySelector('.template-change-delete-template-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.tcobdel') && ddKJFIDJFIOJDS.classList.contains('none')) {
        event.preventDefault();
        const id = event.target.closest('.tcobdel').closest('.template-change-template-one').querySelector('input[name="id"]').value
        ddKJFIDJFIOJDS.querySelector('input[name="id"]').value = id
        ddKJFIDJFIOJDS.classList.remove('none')
    }
    if (event.target.closest('.template-change-delete-btn-back')) {
        event.preventDefault();
        ddKJFIDJFIOJDS.classList.add('none')
    }
})