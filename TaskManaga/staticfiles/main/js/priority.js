const priorityFrame = document.querySelector('.choose-priority')

window.addEventListener('click', (event) => {
    if (event.target.closest('.task-priority-btn') && priorityFrame.classList.contains('none')) {
        event.preventDefault();
        priorityFrame.classList.remove('none')
    } else {
        priorityFrame.classList.add('none')
    }
})