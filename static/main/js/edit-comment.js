window.addEventListener('click', (event) => {
    if (event.target.closest('.comment-edit-btn')) {
        const frame = event.target.closest('.comment')
        const fform = frame.querySelector('.change-comment-form')
        const area = fform.querySelector('textarea')
        area.innerText = frame.querySelector('.comment-comment').innerText
        if (fform.classList.contains('none')) {
            frame.querySelector('.comment-comment').classList.add('none')
            // ADD COMM TO TEXTAREA
            fform.classList.remove('none')
        }
    }
    if (event.target.closest('.change-comment-btn-back')) {
        event.preventDefault();
        const btn = event.target.closest('.change-comment-btn-back')
        const frame = btn.closest('.comment')
        frame.querySelector('.comment-comment').classList.remove('none')
        frame.querySelector('.change-comment-form').classList.add('none')
    }
})