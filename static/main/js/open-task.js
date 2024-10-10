const taskFramik = document.querySelector('.task-detail-info')

window.addEventListener('click', (event) => {
    if (event.target.closest('.task-nade') && taskFramik.classList.contains('none')) {
        const task = event.target.closest('.task-nade').closest('.task')
        const id = task.querySelector('input[name="id"]').value
        taskFramik.classList.remove('none')
        taskFramik.querySelector('input[name="id"]').value = id
        // WE NEED SEND API REQUEST TO BACKEND TO GET OTHER INFOS
    }
    if (event.target.closest('.detail-btn-back')) {
        event.preventDefault();
        taskFramik.classList.add('none')
    }
})