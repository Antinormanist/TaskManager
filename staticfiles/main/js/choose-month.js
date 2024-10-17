const monthsFrame = document.querySelector('.months')

window.addEventListener('click', (event) => {
    if (event.target.closest('.choose-month') && monthsFrame.classList.contains('none')) {
        event.preventDefault();
        monthsFrame.classList.remove('none')
    } else {
        monthsFrame.classList.add('none')
    }
})