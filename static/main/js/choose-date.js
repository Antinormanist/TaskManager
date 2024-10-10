const chooseDateFrame = document.querySelector('.choose-date')

window.addEventListener('click', (event) => {
    if (event.target.closest('.task-remind-btn') && chooseDateFrame.classList.contains('none')) {
        event.preventDefault();
        chooseDateFrame.classList.remove('none')
    } 
    if (event.target.closest('.choose-date-btn-back')) {
        event.preventDefault();
        chooseDateFrame.classList.add('none')
    }
})