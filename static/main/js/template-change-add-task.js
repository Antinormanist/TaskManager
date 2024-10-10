const doujoifureg8 = document.querySelector('.add-task-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.tcobadd') && doujoifureg8.classList.contains('none')) {
        event.preventDefault()
        doujoifureg8.querySelector('input[name="is-template"]').value = 'true'
        doujoifureg8.classList.remove('none')
    }
    if (event.target.closest('.task-close-btn')) {
        event.preventDefault();
        doujoifureg8.querySelector('input[name="is-template"]').value = 'no'
        doujoifureg8.classList.add('none')
    }
})