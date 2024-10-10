const date2 = document.querySelector('.task-detail-info').querySelector('input[name=remind]')

window.addEventListener('click', (event) => {
    if (event.target.closest('.remind-changer-btn-submit')) {
        event.preventDefault();
        const day = parseInt(document.querySelector('.remind-changer').querySelector('input[name="day"]').value)
        const month = parseInt(document.querySelector('.months2').querySelector('input[name="month"]').value)
        const year = parseInt(document.querySelector('.remind-changer').querySelector('input[name="year"]').value)
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
            date2.value = testDate
            document.querySelector('.remind-changer').classList.add('none')
            document.querySelector('.detail-remind-btn').querySelector('p').innerText = `${day} ${monthsMap[month]} ${year} год`
        }
    }
})