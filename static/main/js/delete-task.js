const delTask = document.querySelector('.task-delete-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.task-delete') && delTask.classList.contains('none')) {
        event.preventDefault();
        const dataFrame = event.target.closest('.task-delete').closest('.done-task')
        const id = dataFrame.querySelector('input[name="id"]').value
        delTask.querySelector('input[name="id"]').value = id
        delTask.querySelector('input[name="is-completed-task"]').value = 'true'
        delTask.classList.remove('none')
    }
    if (event.target.closest('.task-delete-btn-back')) {
        event.preventDefault();
        delTask.querySelector('input[name="is-completed-task"]').value = 'no'
        delTask.classList.add('none')
    }
})