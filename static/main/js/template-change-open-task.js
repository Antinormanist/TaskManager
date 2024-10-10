const openTa = document.querySelector('.task-detail-info')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-change-task-btn') && openTa.classList.contains('none')) {
        event.preventDefault();
        const id = event.target.closest('.template-change-task-btn').closest('.template-change-task').querySelector('input[name="id"]').value
        openTa.querySelector('input[name="is-template"]').value = 'true'
        openTa.querySelector('input[name="id"]').value = id
        openTa.classList.remove('none')
    } 
    if (event.target.closest('.detail-btn-back')) {
        openTa.querySelector('input[name="is-template"]').value = 'no'
        openTa.classList.add('none')
    }
})