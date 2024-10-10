const result = document.querySelector('.task-results')

window.addEventListener('click', (event) => {
    if (event.target.closest('.result-btn') && result.classList.contains('none')) {
        result.classList.remove('none')
    }
    if (event.target.closest('.exit')) {
        result.classList.add('none')
    }
})