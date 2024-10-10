const updateTooManyFrame = document.querySelector('.too-many-characters-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.change-comment-btn-subred')) {
        event.preventDefault();
        const comment = document.querySelector('.change-comment-form').querySelector('textarea').value
        if (2000 < comment.length) {
            updateTooManyFrame.classList.remove('none')
            if (99999 < comment.length) {
                updateTooManyFrame.querySelector('.user-characters').innerText = '99999..'
            } else {
                updateTooManyFrame.querySelector('.user-characters').innerText = comment.length
            }
            setTimeout(() => {
                updateTooManyFrame.classList.add('none')
            }, 3000)
        }
    }
})