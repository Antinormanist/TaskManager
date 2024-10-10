const bgfgfdgfd = document.querySelector('.template-change')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-btn-change') && bgfgfdgfd.classList.contains('none')) {
        bgfgfdgfd.classList.remove('none')
    }
    if (event.target.closest('.template-change-btn-back')) {
        bgfgfdgfd.classList.add('none')
    }
})