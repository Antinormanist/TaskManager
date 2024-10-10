const filterFrame = document.querySelector('.filter-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.filter-btn') && filterFrame.classList.contains('none')) {
        filterFrame.classList.remove('none')
    } 
    if (event.target.closest('.filter-btn-back')) {
        event.preventDefault()
        filterFrame.classList.add('none')
    }
})