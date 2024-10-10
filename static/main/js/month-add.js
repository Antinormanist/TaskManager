const date = document.querySelector('.add-task-frame').querySelector('input[name=remind]')
const btn = document.querySelector('.choose-date-btn-submit')

window.addEventListener('click', (event) => {
    if (event.target.closest('.choose-date-btn-submit')) {
        event.preventDefault();
        const day = parseInt(document.querySelector('.choose-date').querySelector('input[name="day"]').value)
        const month = parseInt(document.querySelector('.months').querySelector('input[name="month"]').value)
        const year = parseInt(document.querySelector('.choose-date').querySelector('input[name="year"]').value)
        const monthsMap = {
            1: 'января',
            2: 'февраля',
            3: 'марта',
            4: 'апреля',
            5: 'мая',
            6: 'июня',
            7: 'июля',
            8: 'августа',
            9: 'сентября',
            10: 'октября',
            11: 'ноября',
            12: 'декабря',
        }
        const testDate = `${month}/${day}/${year}`
        if (!isNaN(new Date(testDate))) {
            date.value = testDate
            document.querySelector('.choose-date').classList.add('none')
            document.querySelector('.prta').innerText = `${day} ${monthsMap[month]} ${year} год`
        }
    }
})