const frame = document.querySelector('.settings')

window.addEventListener('click', (event) => {
    if (event.target.closest('.down-btn') && frame.classList.contains('none')) {
        frame.classList.remove('none')
    } else {
        frame.classList.add('none')
    }
})