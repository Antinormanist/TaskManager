const dtmpDow = document.querySelector('.template-download')
window.addEventListener('click', (event) => {
    if (event.target.closest('.template-btn-open') && dtmpDow.classList.contains('none')) {
        dtmpDow.classList.remove('none')
    }
    if (event.target.closest('.template-download2-back')) {
        dtmpDow.classList.add('none')
    }
    
})