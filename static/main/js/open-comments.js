const divider = document.querySelector('.comment-divider')
const commentFrame = document.querySelector('.comments-more')
const imgClosed = document.querySelector('.commentaries-btn').querySelector('img[alt="right"]')
const imgOpened = document.querySelector('.commentaries-btn').querySelector('img[alt="down"]')

window.addEventListener('click', (event) => {
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