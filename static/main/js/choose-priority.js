const priority = document.querySelector('.add-task-frame').querySelector('input[name=priority]')
const priorityPrint = document.querySelector('.task-priority-btn').querySelector('p')

window.addEventListener('click', (event) => {
    if (event.target.closest('.pcb1')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(обычный)'
        priority.setAttribute('value', 'common')
    }
    if (event.target.closest('.pcb2')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(простой)'
        priority.setAttribute('value', 'simple')
    }
    if (event.target.closest('.pcb3')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(важный)'
        priority.setAttribute('value', 'important')
    }
    if (event.target.closest('.pcb4')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(сильный)'
        priority.setAttribute('value', 'strong')
    }
})