const fkrgji = document.querySelector('.remind-changer')
const aas = document.querySelector('.months2')

window.addEventListener('click', (event) => {
    if (event.target.closest('.detail-remind-btn') && fkrgji.classList.contains('none')) {
        fkrgji.classList.remove('none')
    } 
    if (event.target.closest('.remind-changer-btn-back')) {
        fkrgji.classList.add('none')
    }
    if (event.target.closest('.remind-changer-month') && aas.classList.contains('none')) {
        aas.classList.remove('none')
    } else if (!aas.classList.contains('none')) {
        aas.classList.add('none')
    }
})