const delCommentFramik = document.querySelector('.delete-comment')

window.addEventListener('click', (event) => {
    if (event.target.closest('.comment-delete-btn') && delCommentFramik.classList.contains('none')) {
        const curComFrame = event.target.closest('.comment-delete-btn').closest('.comment')
        const id = curComFrame.querySelector('input[name="id"]').value
        delCommentFramik.querySelector('input[name="id"]').value = id
        delCommentFramik.classList.remove('none')
    }
    if (event.target.closest('.delete-comment-btn-back')) {
        event.preventDefault();
        delCommentFramik.classList.add('none')
    }
})