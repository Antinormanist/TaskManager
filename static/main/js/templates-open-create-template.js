const ddgfreger = document.querySelector('.template-create')
window.addEventListener('click', (event) => {
    if (event.target.closest('.template-btn-create') && ddgfreger.classList.contains('none')) {
        ddgfreger.classList.remove('none')
    }
    if (event.target.closest('.template-create-back')) {
        // TO EMPTY ALL TASKS INSIDE IT
        const tasks = ddgfreger.querySelector('.template-create-tasks').querySelectorAll('.template-create-task')
        tasks.forEach((elem) => {
            elem.remove()
        })
        document.querySelector('.template-create-no-task-message').classList.remove('none')
        ddgfreger.classList.add('none')
    }
    
})