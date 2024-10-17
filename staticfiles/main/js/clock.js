const clockd = document.querySelector('.time-city')
const time_n_city = document.querySelector('.time-city').innerText + ''
const wTime = time_n_city.split(' ')[0]
let wHours = parseInt(wTime.split(':')[0])
let wMinutes = parseInt(wTime.split(':')[1])
const wCity = time_n_city.split()[1]
setInterval(() => {
    wMinutes += 1
    if (wMinutes === 60) {
        wHours += 1
        wMinutes = 0
    }
    if (wHours === 24) {
        wHours = 0
    }
    if (wHours < 10 && wMinutes < 10) {
        clockd.innerText = `0${wHours}:0${wMinutes} ${wCity}`
    } else if (wMinutes < 10) {
        clockd.innerText = `${wHours}:0${wMinutes} ${wCity}`
    } else if (wHours < 10) {
        clockd.innerText = `0${wHours}:${wMinutes} ${wCity}`
    } else {
        clockd.innerText = `${wHours}:${wMinutes} ${wCity}`
    }
}, 60 * 1000)