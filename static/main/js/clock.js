const time_n_city = document.querySelector('.time-city') + ''
const wTime = time_n_city.split(' ')[0]
let wHours = parseInt(wTime.split(':')[0])
let wMinutes = parseInt(wTime.split(':')[1])
const wCity = time_n_city.split()[1]
while (true) {
    console.log(123)
    setTimeout(() => {
        wMinutes += 1
        if (wMinutes === 60) {
            wHours += 1
            wMinutes = 0
        }
        if (wHours === 24) {
            wHours = 0
        }
        if (wHours < 10 && wMinutes < 10) {
            time_n_city.innerText = `0${wHours}:0${wMinutes} ${wCity}`
        } else if (wMinutes < 10) {
            time_n_city.innerText = `${wHours}:0${wMinutes} ${wCity}`
        } else if (wHours < 10) {
            time_n_city.innerText = `0${wHours}:${wMinutes} ${wCity}`
        } else {
            time_n_city.innerText = `${wHours}:${wMinutes} ${wCity}`
        }
    }, 60 * 1000)
}