const addTaskFrame = document.querySelector('.add-task-frame')

window.addEventListener('click', (event) => {
    if ((event.target.closest('.add-btn2') || event.target.closest('.add-btn')) && addTaskFrame.classList.contains('none')) {
        addTaskFrame.classList.remove('none')
    } 
    if (event.target.closest('.task-close-btn')) {
        event.preventDefault()
        addTaskFrame.classList.add('none')
    }
})