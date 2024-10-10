const tooManyFrame = document.querySelector('.too-many-characters-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.comment-btn-subred')) {
        event.preventDefault();
        const comment = document.querySelector('.make-comment').querySelector('textarea').value
        if (2000 < comment.length) {
            tooManyFrame.classList.remove('none')
            if (99999 < comment.length) {
                tooManyFrame.querySelector('.user-characters').innerText = '99999..'
            } else {
                tooManyFrame.querySelector('.user-characters').innerText = comment.length
            }
            setTimeout(() => {
                tooManyFrame.classList.add('none')
            }, 3000)
        }
    }
})