const mInpUt = document.querySelector('.months2').querySelector('input')
const showMonth2 = document.querySelector('.remind-changer-month').querySelector('p')

window.addEventListener('click', (event) => {
    if (event.target.closest('.mbg2')) {
        event.preventDefault();
        mInpUt.value = event.target.closest('.mbg2').classList[0].slice(3, -1)
        showMonth2.innerText = event.target.closest('.mbg2').innerText
    }
})