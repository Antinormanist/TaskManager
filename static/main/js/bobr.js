const accountExitFrame = document.querySelector('.account-exit')
const addTaskFrame = document.querySelector('.add-task-frame')
const avaFr = document.querySelector('.avatar-frame')
const chooseDateFrame = document.querySelector('.choose-date')
const priority = document.querySelector('.add-task-frame').querySelector('input[name=priority]')
const priorityPrint = document.querySelector('.task-priority-btn').querySelector('p')
const delAcFr = document.querySelector('.account-delete-sumbit-frame')
const delCommentFramik = document.querySelector('.delete-comment')

window.addEventListener('click', (event) => {
    if (event.target.closest('.exit-btn') && accountExitFrame.classList.contains('none')) {
        accountExitFrame.classList.remove('none')
    }
    else if (event.target.closest('.account-exit-btn')) {
        $.ajax({
            url: document.querySelector('input[name="urlLogout"]').value,
            success: function(data) {
                window.location = data.url
            }
        })
    }
    else if (event.target.closest('.account-close-btn')) {
        accountExitFrame.classList.add('none')
    }
    else if ((event.target.closest('.add-btn2') || event.target.closest('.add-btn')) && addTaskFrame.classList.contains('none')) {
        addTaskFrame.classList.remove('none')
    }
    else if (event.target.closest('.task-close-btn')) {
        event.preventDefault()
        addTaskFrame.classList.add('none')
    }
    else if (event.target.closest('.change-pfp-btn') && avaFr.classList.contains('none')) {
        avaFr.classList.remove('none')
    }
    else if (event.target.closest('.avatar-close-btn')) {
        event.preventDefault()
        avaFr.classList.add('none')
    }
    else if (event.target.closest('.task-remind-btn') && chooseDateFrame.classList.contains('none')) {
        event.preventDefault();
        chooseDateFrame.classList.remove('none')
    }
    else if (event.target.closest('.choose-date-btn-back')) {
        event.preventDefault();
        chooseDateFrame.classList.add('none')
    }
    else if (event.target.closest('.pcb1')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(обычный)'
        priority.setAttribute('value', 'common')
    }
    else if (event.target.closest('.pcb2')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(простой)'
        priority.setAttribute('value', 'simple')
    }
    else if (event.target.closest('.pcb3')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(важный)'
        priority.setAttribute('value', 'important')
    }
    else if (event.target.closest('.pcb4')) {
        event.preventDefault();
        priorityPrint.innerText = 'приоритет(сильный)'
        priority.setAttribute('value', 'strong')
    }
    else if (event.target.closest('.delete-account') && delAcFr.classList.contains('none')) {
        delAcFr.classList.remove('none')
    }
    else if (event.target.closest('.account-delete-sumbit-close-btn')) {
        event.preventDefault();
        delAcFr.classList.add('none')
    }
    else if (event.target.closest('.comment-delete-btn') && delCommentFramik.classList.contains('none')) {
        const curComFrame = event.target.closest('.comment-delete-btn').closest('.comment')
        const id = curComFrame.querySelector('input[name="id"]').value
        delCommentFramik.querySelector('input[name="id"]').value = id
        delCommentFramik.classList.remove('none')
    }
    else if (event.target.closest('.delete-comment-btn-back')) {
        event.preventDefault();
        delCommentFramik.classList.add('none')
    }
})