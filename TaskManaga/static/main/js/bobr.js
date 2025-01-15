const accountExitFrame = document.querySelector('.account-exit')
const addTaskFrame = document.querySelector('.add-task-frame')
const avaFr = document.querySelector('.avatar-frame')
const chooseDateFrame = document.querySelector('.choose-date')
const priority = document.querySelector('.add-task-frame').querySelector('input[name=priority]')
const priorityPrint = document.querySelector('.task-priority-btn').querySelector('p')
const delAcFr = document.querySelector('.account-delete-sumbit-frame')
const delCommentFramik = document.querySelector('.delete-comment')

const trashIconLink = document.querySelector('input[name="trashUrl"]').value
const changeIconLink = document.querySelector('input[name="changeIconLinkUrl"]').value

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
    else if (event.target.closest('.delete-comment-btn-subred')){
        event.preventDefault()
        const id = event.target.closest('.delete-comment-btn-subred').closest('.delete-comment').querySelector('input[name="id"]').value
        const task = event.target.closest('.delete-comment-btn-subred')


        if (id){
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {deleteCommentO: 1, id: id},
                success: function(data){
                    if (data.status === 204){
                        const kids = document.querySelector('.comments-more').children
                        for (const elem of kids){
                            if (elem.querySelector('input[name="id"]') && elem.querySelector('input[name="id"]').value === id){
                                elem.remove()
                                const p = document.querySelector('.task-detail-info').querySelector('.commentaries-btn').querySelector('.weak-p')
                                if (p.innerHTML[p.innerHTML.length - 1] === '+'){

                                } else {
                                    p.innerHTML = parseInt(p.innerHTML) - 1
                                }
                                // REMOVE ONE AMOUNT OF COMMENTARIES FROM GENERAL AMOUNT
                                break
                            }
                        }
                        document.querySelector('.delete-comment').classList.add('none')
                    }
                }
            })
        }
    }
    else if (event.target.closest('.comment-btn-subred')){
        event.preventDefault()
        const comm = event.target.closest('.comment-btn-subred').closest('.make-comment').querySelector('textarea').value
        const taskId = event.target.closest('.task-detail-info').querySelector('input[name="id"]').value
        if (357 < comm.length) {
            updateTooManyFrame.classList.remove('none')
            updateTooManyFrame.querySelector('.max-characters').innerHTML = "Максимум можно 357 символов"
            setTimeout(() => {
                updateTooManyFrame.classList.add('none')
                updateTooManyFrame.querySelector('.max-characters').innerHTML = "Максимум можно 2000 символов"
            }, 3000)
        } else if (comm){
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {createComment: 1, comment: comm, id: taskId},
                success: function(data){
                    if (data.status === 201){
                        // increase comments amount by 1
                        const p = document.querySelector('.task-detail-info').querySelector('.commentaries-btn').querySelector('.weak-p')
                        if (p.innerHTML[p.innerHTML.length - 1] === '+'){

                        } else if (p.innerHTML === '99'){
                            p.innerHTML = '99+'
                        } else {
                            p.innerHTML = parseInt(p.innerHTML) + 1
                        }

                        const ert = JSON.parse(data.info)
                        let username = ert.username
                        if (20 < username){
                            username = username.slice(0, 20) + '...'
                        }
                        const day = ert.day
                        const month = ert.month
                        const year = ert.year
                        const d = day + '.' + month + '.' + year

                        let imga
                        if (ert.img){
                            imga = ert.img
                        } else {
                            imga = document.querySelector('.qpla').value
                        }

                        const comment = `<div class="comment">
                            <input type="hidden" name="id" value="${ert.id}">
                            <img class="comment-avatar" src="${imga}" alt="ava">
                            <div class="comment-head">
                                <h3 class="comment-login">${username}</h3>
                                <p class="comment-time">${d}</p>
                                <button class="comment-edit-btn"><img src=${changeIconLink} alt="edit"></button>
                                <button class="comment-delete-btn"><img src=${trashIconLink} alt="del"></button>
                            </div>
                            <div class="change-comment-form none">
                                <textarea name="new-comment" placeholder="комментарий"></textarea>
                                <button class="change-comment-btn-back btn-back">отмена</button>
                                <button class="change-comment-btn-subred btn-subred">изменить</button>
                            </div>
                            <p class="comment-comment">${comm}</p>
                        </div>`

                        const addComm = document.querySelector('.make-comment')

                        const parser = new DOMParser()
                        let node = parser.parseFromString(comment, 'text/html')
                        node = node.body.firstChild
                        document.querySelector('.comments-more').insertBefore(node, addComm.nextSibling)
                    }
                }
            })
        }
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
    else if (event.target.closest('.account-delete-sumbit-delete-btn')) {
        event.preventDefault();
        password = event.target.closest('.account-delete-sumbit-frame').querySelector('input[name="password"]').value
        if (password) {
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {deleteAccount: 1, password: password},
                success: function(data) {
                    if (data.status === 200) {
                        window.location = data.url
                    }
                    else if (data.status === 400) {
                        wrongFrameMsg.querySelector('h2').innerText = 'Неверный пароль';
                        wrongFrameMsg.classList.remove('none');
                        setTimeout(() => {
                            wrongFrameMsg.classList.add('none');
                        }, 1500);
                    }
                }
            })
        }
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