const bgfgfdgfd = document.querySelector('.template-change')
const ddgrthreth = document.querySelector('.add-task-frame')
const dfgdgdfgregergqweqweqweqwwe = document.querySelector('.template-create-task-delete-frame')
const dtmpDow = document.querySelector('.template-download')
const ddgfreger = document.querySelector('.template-create')
const updateTooManyFrame = document.querySelector('.too-many-characters-frame')
const tooManyFrame = document.querySelector('.too-many-characters-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-btn-change') && bgfgfdgfd.classList.contains('none')) {
        bgfgfdgfd.classList.remove('none')
    }
    else if (event.target.closest('.template-change-btn-back')) {
        bgfgfdgfd.classList.add('none')
    }
    else if (event.target.closest('.template-create-subred2') && ddgrthreth.classList.contains('none')) {
        ddgrthreth.querySelector('input[name="is-template"]').value = 'true'
        ddgrthreth.classList.remove('none')
    }
    else if (event.target.closest('.task-close-btn')) {
        event.preventDefault();
        ddgrthreth.querySelector('input[name="is-template"]').value = 'no'
        ddgrthreth.classList.add('none')
    }
    else if (event.target.closest('.template-btn-create') && ddgfreger.classList.contains('none')) {
        ddgfreger.classList.remove('none')
    }
    else if (event.target.closest('.template-create-back')) {
        // TO EMPTY ALL TASKS INSIDE IT
        const tasks = ddgfreger.querySelector('.template-create-tasks').querySelectorAll('.template-create-task')
        tasks.forEach((elem) => {
            elem.remove()
        })
        document.querySelector('.template-create-no-task-message').classList.remove('none')
        ddgfreger.classList.add('none')
    }
    else if (event.target.closest('.done-task-return')) {
        const id = event.target.closest('.done-task-return').closest('.done-task').querySelector('input[name="id"]').value
        // GET INFO AND ADD  THIS TASK TO TASKS FOR COMPLITING
    }
    else if (event.target.closest('.change-comment-btn-subred')) {
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
    else if (event.target.closest('.comment-btn-subred')) {
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
    else if (event.target.closest('.template-btn-open') && dtmpDow.classList.contains('none')) {
        dtmpDow.classList.remove('none')
    }
    else if (event.target.closest('.template-download2-back')) {
        dtmpDow.classList.add('none')
    }
    else if (event.target.closest('.template-create-delete-btn') && dfgdgdfgregergqweqweqweqwwe.classList.contains('none')) {
        const id = event.target.closest('.template-create-delete-btn').closest('.template-create-task').querySelector('input[name="id"]').value
        dfgdgdfgregergqweqweqweqwwe.querySelector('input[name="id"]').value = id
        dfgdgdfgregergqweqweqweqwwe.classList.remove('none')
    }
    else if (event.target.closest('.task-delete-btn-back-template')) {
        event.preventDefault();
        dfgdgdfgregergqweqweqweqwwe.classList.add('none')
    }
})

window.addEventListener('mouseover', (event) => {
    if (event.target.closest('.template-select')) {
        const frame = event.target.closest('.template-select').closest('.template-download-template')
        if (frame.classList.contains('selected')) {
            frame.classList.add('mouse-selected')
        } else {
            frame.classList.add('mouse-not-selected')
        }
    }
})

window.addEventListener('mouseout', (event) => {
    if (event.target.closest('.template-select')) {
        const frame = event.target.closest('.template-select').closest('.template-download-template')
        if (frame.classList.contains('selected')) {
            frame.classList.remove('mouse-selected')
        } else {
            frame.classList.remove('mouse-not-selected')
        }
    }
})