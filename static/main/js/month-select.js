const input = document.querySelector('.months').querySelector('input')
const showMonth = document.querySelector('.choose-month').querySelector('p')

window.addEventListener('click', (event) => {
    if (event.target.closest('.mbg')) {
        event.preventDefault();
        input.value = event.target.closest('.mbg').classList[0].slice(3)
        showMonth.innerText = event.target.closest('.mbg').innerText
    }
})