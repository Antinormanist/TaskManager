const templateFrame = document.querySelector('.template-choose')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-btn') && templateFrame.classList.contains('none')) {
        templateFrame.classList.remove('none')
    } else {
        templateFrame.classList.add('none')
    }
})