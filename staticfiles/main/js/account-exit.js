const bgfgfdgfd = document.querySelector('.template-change')
const ddgrthreth = document.querySelector('.add-task-frame')
const dfgdgdfgregergqweqweqweqwwe = document.querySelector('.template-create-task-delete-frame')
const dtmpDow = document.querySelector('.template-download')
const ddgfreger = document.querySelector('.template-create')
const updateTooManyFrame = document.querySelector('.too-many-characters-frame')
const tooManyFrame = document.querySelector('.too-many-characters-frame')
const doneTasks = document.querySelector('.done-tasks')
const comrad = document.querySelector('input[name="comrad"]').value
const simrad = document.querySelector('input[name="simrad"]').value
const imprad = document.querySelector('input[name="imprad"]').value
const strrad = document.querySelector('input[name="strrad"]').value
const mainFrame = document.querySelector('.main')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-btn-change') && bgfgfdgfd.classList.contains('none')) {
        bgfgfdgfd.classList.remove('none')
    }
    else if (event.target.closest('.task-btn')) {
//        make that task completed
        const task = event.target.closest('.task')
        if (task) {
            const id = task.querySelector('input[name="id"]').value
            if (id) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    headers: {'X-CSRFToken': csrftoken},
                    data: {completeTask: 1, id: id},
                    success: function(data) {
                        if (data.status === 200) {
                            const newTask = task.cloneNode(true)
                            task.remove()
                            let count = 0
                            const tasks = document.querySelector('.main').children
                            for (let i = 0; i < tasks.length; i++) {
                                const task = tasks[i]
                                if (task.classList.contains('task')) {
                                    count += 1
                                }
                            }
                            if (count === 0) {
                                document.querySelector('.no-task').classList.remove('none')
                                document.querySelector('.add-btn').classList.remove('none')
                            }
                            newTask.classList.remove('task')
                            newTask.classList.add('done-task')
                            newTask.querySelector('.task-return').classList.add('done-task-return')
                            newTask.querySelector('.task-return').classList.remove('task-return')
                            if (doneTasks.classList.contains('none')) {
                                doneTasks.classList.remove('none')
                            }
                                doneTasks.appendChild(newTask)
                        } else if (data.status === 403) {
                            wrongFrameMsg.querySelector('h2').innerText = 'Что-то не так. Таск с таким айди не ваш';
                            wrongFrameMsg.classList.remove('none');
                            setTimeout(() => {
                                wrongFrameMsg.classList.add('none');
                            }, 1500);
                        } else {
                            wrongFrameMsg.querySelector('h2').innerText = 'Что-то не так. Обновите страницу';
                            wrongFrameMsg.classList.remove('none');
                            setTimeout(() => {
                                wrongFrameMsg.classList.add('none');
                            }, 1500);
                        }
                    }
                })
            }
        }
    }
    else if (event.target.closest('.done-task-return')){
        const doneTask = event.target.closest('.done-task')
        const task = doneTask.cloneNode(true)
        doneTask.remove()
        task.classList.add('task')
        task.classList.remove('done-task')
        task.querySelector('.done-task-return').classList.add('task-return')
        task.querySelector('.done-task-return').classList.remove('done-task-return')

        const id = parseInt(task.querySelector('input[name="id"]').value)

        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {returnTask: 1, id: id}
        })
        document.querySelector('.main').insertAdjacentElement('afterbegin', task)
//        REMOVE NO TASK FRAME IF N O T SKTAM FRME IS EXIST
        const noTask = document.querySelector('.no-task')
        const noBtn = document.querySelector('.add-btn')
        let taskCount = 0
        const kids = document.querySelector('.main').children
        for (let i = 0; i < kids.length; i++)
        {
            if (kids[i].classList.contains('task')){
                taskCount += 1
            }
        }
        if (!(noTask.classList.contains('none')) && taskCount >= 1){
            noTask.classList.add('none')
            noBtn.classList.add('none')
        }
//        REMOVE COMPLETED TASK FRME IF NOT TAKS
        const completeFrame = document.querySelector('.done-tasks')
        const doneKids = completeFrame.children
        taskCount = 0
        for (let i = 0; i < doneKids.length; i++)
        {
            if (doneKids[i].classList.contains('done-task')){
                taskCount += 1
            }
        }

        if (!(completeFrame.classList.contains('none')) && taskCount == 0){
            completeFrame.classList.add('none')
        }
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
    else if (event.target.closest('.done-task-btn')){
        const kids = document.querySelector('.done-tasks').children
        let templateIdsToDel = {}
        for (let i = 0; i < kids.length; i++){
            const dTask = kids[i]
            if (dTask.classList.contains('done-task')){
                const id = parseInt(dTask.querySelector('input[name="id"]').value)
                templateIdsToDel[id] = 'exists'
            }
        }
        if (Object.keys(templateIdsToDel).length >= 1){
            // SEND AJAX
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},

                // CAN'T REMOVE FROM HTML
                data: {delAllDoneTasks: 1, ids: JSON.stringify(templateIdsToDel)},
                success: function(data){
                    if (data.status === 204){
                        const completeFrame = document.querySelector('.done-tasks')
                        const doneKids = completeFrame.children
                        let taskCount = 0
                        for (let i = 0; i < doneKids.length; i++)
                        {
                            if (doneKids[i].classList.contains('done-task')){
                                taskCount += 1
                            }
                        }

                        if (!(completeFrame.classList.contains('none')) && taskCount == 0){
                            completeFrame.classList.add('none')
                        }
                        window.location = '?'
                    } else {
                        wrongFrameMsg.querySelector('h2').innerText = 'Что - то пошло не так, обновите страницу';
                        wrongFrameMsg.classList.remove('none');
                        setTimeout(() => {
                            wrongFrameMsg.classList.add('none');
                        }, 1500);
                    }
                },
            })
        }
    }
    else if (event.target.closest('.task-add-btn')) {
        event.preventDefault()
        const name = document.querySelector('.add-task-frame').querySelector('input[name="name"]').value
        const description = document.querySelector('.add-task-frame').querySelector('input[name="description"]').value
        let minutes = document.querySelector('.add-task-frame').querySelector('input[name="task-time"]').value
        const priority = document.querySelector('.add-task-frame').querySelector('input[name="priority"]').value
        const remind = document.querySelector('.add-task-frame').querySelector('input[name="remind"]').value
        if (document.querySelector('.add-task-frame').querySelector('input[name="is-template"]').value === 'yes') {
            const a = 1
        } else {
            if (name) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    headers: {'X-CSRFToken': csrftoken},
                    data: {createTask: 1, name: name, description: description, minutes: minutes, priority: priority, remind: remind},
                    success: function(data) {
                        if (data.status === 201) {
                            let task = constTask
                            task = task.replace('{name}', `<h2 class='task-name'>${name}</h2>`)
                            task = task.replace('{id}', `<input type="hidden" name="id" value="${data.id}">`)

                            minutes = minutes.replace(/^0+/, '')

                            if (priority === 'common') {
                                task = task.replace('{priority}', `<button class='task-btn'><img src=${comrad} alt='radio' class='task-rad common-rad'></button>`)
                            } else if (priority === 'simple') {
                                task = task.replace('{priority}', `<button class='task-btn'><img src=${simrad} alt='radio' class='task-rad simple-rad'></button>`)
                            } else if (priority === 'important') {
                                task = task.replace('{priority}', `<button class='task-btn'><img src=${imprad} alt='radio' class='task-rad important-rad'></button>`)
                            } else if (priority === 'strong') {
                                task = task.replace('{priority}', `<button class='task-btn'><img src=${strrad} alt='radio' class='task-rad strong-rad'></button>`)
                            }
                            if (description) {
                                let trunct_desc = description.slice(0, 64)
                                if (trunct_desc.length === 64) {
                                    trunct_desc += '...'
                                }
                                task = task.replace('{description}', `<h3 class='task-description'>${trunct_desc}</h3>`)
                            } else {
                                task = task.replace('{description}', '')
                            }
                            if (minutes) {
                                task = task.replace('{minutes}', `<h3 class='task-time'>${minutes} минут</h3>`)
                            } else {
                                task = task.replace('{minutes}', '')
                            }
                            if (remind !== 'no') {
                                task = task.replace('{remind}', "<h3 class='task-remind'>с напоминанием</h3>")
                            } else {
                                task = task.replace('{remind}', '')
                            }
                            document.querySelector('.no-task').classList.add('none')
                            document.querySelector('.add-btn').classList.add('none')
                            mainFrame.insertAdjacentHTML('afterbegin', task)

                            document.querySelector('.add-task-frame').querySelector('input[name="name"]').value = ''
                            document.querySelector('.add-task-frame').querySelector('input[name="description"]').value = ''
                            document.querySelector('.add-task-frame').querySelector('input[name="task-time"]').value = ''
                            document.querySelector('.add-task-frame').querySelector('input[name="remind"]').value = 'no'
                            document.querySelector('.add-task-frame').querySelector('input[name="priority"]').value = 'common'
                            document.querySelector('.task-priority-btn').querySelector('p').innerText = 'приоритет(обычный)'
                            document.querySelector('.task-remind-btn').querySelector('p').innerText = 'напоминание(нет)'

                            document.querySelector('.add-task-frame').classList.add('none')
                        } else if (data.status === 400) {
                            wrongFrameMsg.querySelector('h2').innerText = 'Проблема с приоритетом';
                            wrongFrameMsg.classList.remove('none');
                            setTimeout(() => {
                                wrongFrameMsg.classList.add('none');
                            }, 1500);
                        }
                    }
                })
            }
        }
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
    else if (event.target.closest('.detail-btn-subred')){
        event.preventDefault();
        const fm = document.querySelector('.task-detail-info')

        const id = fm.querySelector('input[name="id"]').value

        const priority = fm.querySelector('input[name="priority"]').value
        const remind = fm.querySelector('input[name="remind"]').value
        const name = fm.querySelector('.name-inp').value
        const description = fm.querySelector('.description-inp').value

        // ajax
        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {taskInfoChange: 1, id: id, priority: priority, remind: remind, name: name, description: description},
            success: function(data){
                if (data.status === 200){
                    window.location = '?'
                } else {
                    wrongFrameMsg.querySelector('h2').innerText = 'Проблема с приоритетом';
                    wrongFrameMsg.classList.remove('none');
                    setTimeout(() => {
                        wrongFrameMsg.classList.add('none');
                    }, 1500);
                }
            }
        })

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