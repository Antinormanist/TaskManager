const input = document.querySelector('.months').querySelector('input')
const showMonth = document.querySelector('.choose-month').querySelector('p')
const notificationsFrame = document.querySelector('.notifications-frame')
const divider = document.querySelector('.comment-divider')
const commentFrame = document.querySelector('.comments-more')
const imgClosed = document.querySelector('.commentaries-btn').querySelector('img[alt="right"]')
const imgOpened = document.querySelector('.commentaries-btn').querySelector('img[alt="down"]')

window.addEventListener('click', (event) => {
    if (event.target.closest('.mbg')) {
        event.preventDefault();
        input.value = event.target.closest('.mbg').classList[0].slice(3)
        showMonth.innerText = event.target.closest('.mbg').innerText
    }
    if (event.target.closest('.notification-btn') && notificationsFrame.classList.contains('none')) {
        notificationsFrame.classList.remove('none')
    }
    if (event.target.closest('.notifications-close-btn')) {
        notificationsFrame.classList.add('none')
    }
    if (event.target.closest('.commentaries-btn') && commentFrame.classList.contains('none')) {
        imgOpened.classList.remove('none')
        imgClosed.classList.add('none')
        commentFrame.classList.remove('none')
        divider.classList.remove('none')
    } else if (event.target.closest('.commentaries-btn')) {
        imgOpened.classList.add('none')
        imgClosed.classList.remove('none')
        commentFrame.classList.add('none')
        divider.classList.add('none')
    }
})