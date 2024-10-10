const pOJNJHhgf = document.querySelector('.template-change-delete-task-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-change-task-delete-btn2') && pOJNJHhgf.classList.contains('none')) {
        event.preventDefault()
        const id = event.target.closest('.template-change-task-delete-btn2').closest('.template-change-task').querySelector('input[name="id"]').value
        pOJNJHhgf.querySelector('input[name="id"]').value = id
        pOJNJHhgf.classList.remove('none')
    }
    if (event.target.closest('.bbq')) {
        event.preventDefault();
        pOJNJHhgf.classList.add('none')
    }
})