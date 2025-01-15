const settingsFrame = document.querySelector('.account-settings')
const doujoifureg8 = document.querySelector('.add-task-frame')
const ddKJFIDJFIOJDS = document.querySelector('.template-change-delete-template-frame')
const pOJNJHhgf = document.querySelector('.template-change-delete-task-frame')
const dqwrytrhgrhrhrt = document.querySelector('.template-change-delete-frame')
const yahz = document.querySelector('.template-change-template-one')
const openTa = document.querySelector('.task-detail-info')

window.addEventListener('click', (event) => {
    if (event.target.closest('.settings-btn') && settingsFrame.classList.contains('none')) {
        settingsFrame.classList.remove('none')
    }
    else if (event.target.closest('.change-name-btn')) {
        event.preventDefault()
        let name = event.target.closest('.account-settings').querySelector('.name-input').value
        if (name) {
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {changeName: 1, name: name},
                success: function(data) {
                    if (data.status === 200) {
                        if (name.length >= 7) {
                            name = name.slice(0, 6) + '...'
                        }
                        document.querySelector('nav').querySelector('.btns').querySelector('.username').innerText = name
                    }
                }
            })
        }
    }
    else if (event.target.closest('.avatar-change-btn')) {
        event.preventDefault()
        avatar = event.target.closest('.avatar-frame').querySelector('input[name="file"]').files[0]
        const sendAva = new FormData()
        sendAva.append('image', avatar)
        sendAva.append('sendAva', 1)
        if (avatar) {
            $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: sendAva,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.status == 200) {
                    document.querySelector('.avatar-frame').classList.add("none")
                    document.querySelector('.avatar-frame').querySelector('input[name="file"]').value = null

                    document.querySelector('.ava').src = data.url
                    document.querySelector('.avatar-img').src = data.url
                }
            }
            })
        }
    }
    else if (event.target.closest('.account-settings-close-btn')) {
        settingsFrame.classList.add('none')
    }
    else if (event.target.closest('.tcobadd') && doujoifureg8.classList.contains('none')) {
        event.preventDefault()
        doujoifureg8.querySelector('input[name="is-template"]').value = 'true'
        doujoifureg8.querySelector('input[name="is-template-extr"]').value = 'true'
        doujoifureg8.classList.remove('none')
    }
    else if (event.target.closest('.task-close-btn')) {
        event.preventDefault();
        doujoifureg8.querySelector('input[name="is-template"]').value = 'no'
        doujoifureg8.classList.add('none')
    }
    else if (event.target.closest('.tcobdel') && ddKJFIDJFIOJDS.classList.contains('none')) {
        event.preventDefault();
        const id = event.target.closest('.tcobdel').closest('.template-change-template-one').querySelector('input[name="id"]').value
        ddKJFIDJFIOJDS.querySelector('input[name="id"]').value = id
        ddKJFIDJFIOJDS.classList.remove('none')
    }
    else if (event.target.closest('.template-change-delete-btn-subred')){
        const id = event.target.closest('.template-change-delete-template-frame').querySelector('input[name="id"]').value

        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {DeleteSubrTemp: 1, id: id}
        })
        document.querySelector('.template-change-delete-btn-subred').classList.add('none')
    }
    else if (event.target.closest('.template-change-delete-btn-back')) {
        event.preventDefault();
        ddKJFIDJFIOJDS.classList.add('none')
    }
    else if (event.target.closest('.template-change-task-delete-btn2') && pOJNJHhgf.classList.contains('none')) {
        event.preventDefault()
        const id = event.target.closest('.template-change-task-delete-btn2').closest('.template-change-task').querySelector('input[name="id"]').value
        pOJNJHhgf.querySelector('input[name="id"]').value = id
        pOJNJHhgf.classList.remove('none')
    }
    else if (event.target.closest('.bbq')) {
        event.preventDefault();
        pOJNJHhgf.classList.add('none')
    }
    else if (event.target.closest('.template-change-template-delete-btn') && dqwrytrhgrhrhrt.classList.contains('none')) {
        const id = event.target.closest('.template-change-template-delete-btn').closest('.template-change-template').querySelector('input[name="id"]').value
        dqwrytrhgrhrhrt.querySelector('input[name="id"]').value = id
        dqwrytrhgrhrhrt.classList.remove('none')
    }
    else if (event.target.closest('.template-change-btn-back2')) {
        event.preventDefault();
        dqwrytrhgrhrhrt.classList.add('none')
    }
    else if (event.target.closest('.template-change-template-btn') && yahz.classList.contains('none')) {
        const id = event.target.closest('.template-change-template-btn').closest('.template-change-template').querySelector('input[name="id"]').value
        yahz.querySelector('input[name="id"]').value = id
        yahz.classList.remove('none')
        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {getTemplateChangeInfo: 1, id: id},
            success: function(data){
                if (data.status === 200){
                    // after changing name or desc of template tasks disappear
                    const name = data.name
                    const description = data.description
                    const tasks = JSON.parse(data.tasks)

                    yahz.querySelector('.inf-and-tasks').querySelector('textarea[name="name"]').value = name
                    yahz.querySelector('.inf-and-tasks').querySelector('textarea[name="description"]').value = description
                    taskQ = `
                    <div class="template-change-task">
                        {id}
                        <div class="task-infos">
                            {priority}
                            {remind}
                            {minutes}
                        </div>
                        <div class="task-nad">
                            {name}
                            {description}
                        </div>
                        <button class="task-delet"><img src="${trashImg}" alt="del"></button>
                        <button class="task-return"><img src="${returnImg}" alt="return"></button>
                    </div>
                    `

                    for (task of tasks){
                        const name = task.name
                        const description = task.description
                        const priority = task.priority
                        const id = task.id
                        const minutes = task.minutes
                        const remind = task.remind

                        let ts = taskQ
                        ts = ts.replace('{id}', `<input type="hidden" name="id" value="${id}">`)
                        ts = ts.replace('{name}', `<h2 class='task-name'>${name}</h2>`)

                        if (priority === 'common') {
                            ts = ts.replace('{priority}', `<button class='task-btn'><img src=${comrad} alt='radio' class='task-rad common-rad'></button>`)
                        } else if (priority === 'simple') {
                            ts = ts.replace('{priority}', `<button class='task-btn'><img src=${simrad} alt='radio' class='task-rad simple-rad'></button>`)
                        } else if (priority === 'important') {
                            ts = ts.replace('{priority}', `<button class='task-btn'><img src=${imprad} alt='radio' class='task-rad important-rad'></button>`)
                        } else if (priority === 'strong') {
                            ts = ts.replace('{priority}', `<button class='task-btn'><img src=${strrad} alt='radio' class='task-rad strong-rad'></button>`)
                        }
                        ts = ts.replace('{pri}', `<input type="hidden" name="priority" value="${priority}">`)
                        if (description) {
                            ts = ts.replace('{description}', `<h3 class='task-description'>${description}</h3>`)
                        } else {
                            ts = ts.replace('{description}', '')
                        }
                        if (minutes) {
                            ts = ts.replace('{minutes}', `<h3 class='task-time'>${minutes} минут</h3>`)
                        } else {
                            ts = ts.replace('{minutes}', '')
                        }
                        if (remind && remind !== 'no') {
                            ts = ts.replace('{remind}', "<h3 class='task-remind'>с напоминанием</h3>")
                        } else {
                            ts = ts.replace('{remind}', '')
                        }

                        document.querySelector('.inf-and-tasks').insertAdjacentHTML('beforeend', ts)

                        document.querySelector('.add-task-frame').querySelector('input[name="name"]').value = ''
                        document.querySelector('.add-task-frame').querySelector('input[name="description"]').value = ''
                        document.querySelector('.add-task-frame').querySelector('input[name="task-time"]').value = ''
                        document.querySelector('.add-task-frame').querySelector('input[name="remind"]').value = 'no'
                        document.querySelector('.add-task-frame').querySelector('input[name="priority"]').value = 'common'
                        document.querySelector('.task-priority-btn').querySelector('p').innerText = 'приоритет(обычный)'
                        document.querySelector('.task-remind-btn').querySelector('p').innerText = 'напоминание(нет)'

                        document.querySelector('.add-task-frame').classList.add('none')
                    }
                }
            }
        })
    }
    else if (event.target.closest('.tcobback')) {
        event.preventDefault()
        const tasks = event.target.closest('.tcobback').closest('.template-change-template-one').querySelector('.inf-and-tasks').querySelectorAll('.template-change-task')
        tasks.forEach(element => {
           element.remove()
        });
        yahz.classList.add('none')
    }
    else if (event.target.closest('.template-change-task-btn') && openTa.classList.contains('none')) {
        event.preventDefault();
        const id = event.target.closest('.template-change-task-btn').closest('.template-change-task').querySelector('input[name="id"]').value
        openTa.querySelector('input[name="is-template"]').value = 'true'
        openTa.querySelector('input[name="id"]').value = id
        openTa.classList.remove('none')
    }
    else if (event.target.closest('.detail-btn-back')) {
        openTa.querySelector('input[name="is-template"]').value = 'no'
        openTa.classList.add('none')

        const things = openTa.querySelector('.comments-more').children
        for (const elem of things){
            if (elem.classList.contains('comment')){
                elem.remove()
            }
        }
    }
})