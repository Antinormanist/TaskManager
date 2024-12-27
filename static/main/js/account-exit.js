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

async function createTemplateAndTasks(event) {
    event.preventDefault();
    const name = event.target.closest('.template-create-subred1').closest('.template-create').querySelector('.template-create-name').value;
    const description = event.target.closest('.template-create-subred1').closest('.template-create').querySelector('.template-create-description').value;

    console.log(name, description);

    if (name) {
        try {
            // Отправляем AJAX-запрос на создание шаблона
            const createTemplateResponse = await $.ajax({
                url: sendUrl,
                method: 'post',
                headers: { 'X-CSRFToken': csrftoken },
                data: { createTemplate: 1, name: name, description: description }
            });
            console.log('lets go', createTemplateResponse.status)
            if (createTemplateResponse.status === 201) {
                const id = createTemplateResponse.id;
                const tasks = event.target.closest('.template-create-subred1').closest('.template-create').querySelector('.template-create-tasks').children;

                console.log('TEMPLATE WAS CREATED');

                for (const elem of tasks) {
                    if (elem.classList.contains('task')) {
                        const taskName = elem.querySelector('.task-name').innerHTML;
                        let taskDescription = '';
                        if (elem.querySelector('.task-description')) {
                            taskDescription = elem.querySelector('.task-description').innerHTML;
                        }
                        const remind = elem.querySelector('input[name="remind"]').value;
                        const priority = elem.querySelector('input[name="priority"]').value;
                        const minutes = elem.querySelector('input[name="time"]').value;
                        const remSplit = remind.split('/'); // mm/dd/yyyy
                        let day, month, year;

                        if (remSplit.length === 3) {
                            month = remSplit[0];
                            day = remSplit[1];
                            year = remSplit[2];
                        }

                        console.log('LETS SEND AJAX for task');

                        // Отправляем AJAX-запрос на создание задачи
                        const createTaskResponse = await $.ajax({
                            url: sendUrl,
                            method: 'post',
                            headers: { 'X-CSRFToken': csrftoken },
                            data: {
                                CreateTemplateTask: 1,
                                templateId: id,
                                name: taskName,
                                description: taskDescription,
                                day: day,
                                month: month,
                                year: year,
                                priority: priority,
                                minutes: minutes
                            }
                        });

                        if (createTaskResponse.status === 201) {
                            console.log("WE DID IT for task!");
                        }
                    }
                }
            } else {
            }
        } catch (error) {
            console.log(error, "qwe")
            console.log(error.responseText)
            console.log(error.status, 'status')
        }
    }
}

window.addEventListener('click', async (event) => {
    if (event.target.closest('.template-btn-change') && bgfgfdgfd.classList.contains('none')) {
        bgfgfdgfd.classList.remove('none')
    }
    else if (event.target.closest('.task-btn')) {
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
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},

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
    else if (event.target.closest('.task-delet')){
        const task = event.target.closest('.task-delet').closest('.task')
        task.remove()
        const children = document.querySelector('.template-create').querySelector('.template-create-tasks').children
        if (children.length === 4){
            document.querySelector('.template-create').querySelector('.template-create-tasks').querySelector('.template-create-no-task-message').classList.remove('none')
        }
    }
    else if (event.target.closest('.template-create-subred1')){
        event.preventDefault()
//        await createTemplateAndTasks(event);
        const name = event.target.closest('.template-create-subred1').closest('.template-create').querySelector('.template-create-name').value
        const description = event.target.closest('.template-create-subred1').closest('.template-create').querySelector('.template-create-description').value

        if (name){
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {createTemplate: 1, name: name, description: description},
                async: false,
                success: function(data){
                    if (data.status === 201){
                        const tasks = event.target.closest('.template-create-subred1').closest('.template-create').querySelector('.template-create-tasks').children
                        for (elem of tasks) {
                            if (elem.classList.contains('task')){
                                const name = elem.querySelector('.task-name').innerHTML
                                let description = ''
                                if (elem.querySelector('.task-description')){
                                    description = elem.querySelector('.task-description').innerHTML
                                }
                                const remind = elem.querySelector('input[name="remind"]').value
                                const priority = elem.querySelector('input[name="priority"]').value
                                const minutes = elem.querySelector('input[name="time"]').value
                                const remSplit = remind.split('/') // mm/dd/yyyy
                                let day
                                let month
                                let year

                                if (remSplit.length === 3){
                                    month = remSplit[0]
                                    day = remSplit[1]
                                    year = remSplit[2]
                                }
                                $.ajax({
                                    url: sendUrl,
                                    method: 'post',
                                    headers: {'X-CSRFToken': csrftoken},
                                    data: {CreateTemplateTask: 1, templateId: data.id, name: name, description: description, day: day, month: month, year: year, priority: priority, minutes: minutes},
                                    async: false,
                                })
                            }
                        }

                        const frame = document.querySelector('.template-create')
                        const children = frame.querySelector('.template-create-tasks').children
                        for (const kid of children){
                            if (kid.classList.contains('task')){
                                kid.remove()
                            }
                        }
                        frame.querySelector('.template-create-name').value = ''
                        frame.querySelector('.template-create-description').value = ''

                        frame.classList.add('none')
                    }
                }
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
        if (document.querySelector('.add-task-frame').querySelector('input[name="is-template"]').value === 'true') {
            let task = `
            <div class="task">
                {id}
                {pri}
                {rem}
                {tm}
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
            task = task.replace('{name}', `<h2 class='task-name'>${name}</h2>`)

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
            task = task.replace('{pri}', `<input type="hidden" name="priority" value="${priority}">`)
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
            task = task.replace('{tm}', `<input type="hidden" name="time" value="${minutes}">`)
            if (remind !== 'no') {
                task = task.replace('{remind}', "<h3 class='task-remind'>с напоминанием</h3>")
            } else {
                task = task.replace('{remind}', '')
            }
            task = task.replace('{rem}', `<input type="hidden" name="remind" value="${remind}">`)
            task = task.replace('{id}', `<input type="hidden" name="id" value="">`)

            document.querySelector('.template-create').querySelector('.template-create-no-task-message').classList.add('none')
            document.querySelector('.template-create').querySelector('.template-create-tasks').insertAdjacentHTML('beforeend', task)

            document.querySelector('.add-task-frame').querySelector('input[name="name"]').value = ''
            document.querySelector('.add-task-frame').querySelector('input[name="description"]').value = ''
            document.querySelector('.add-task-frame').querySelector('input[name="task-time"]').value = ''
            document.querySelector('.add-task-frame').querySelector('input[name="remind"]').value = 'no'
            document.querySelector('.add-task-frame').querySelector('input[name="priority"]').value = 'common'
            document.querySelector('.task-priority-btn').querySelector('p').innerText = 'приоритет(обычный)'
            document.querySelector('.task-remind-btn').querySelector('p').innerText = 'напоминание(нет)'

            document.querySelector('.add-task-frame').classList.add('none')

        } else {
            let task = `
            <div class="task">
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
            if (name) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    headers: {'X-CSRFToken': csrftoken},
                    data: {createTask: 1, name: name, description: description, priority: priority, remind: remind, minutes: minutes},
                    success: function(data){
                        if (data.status === 201){
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
        const frame = document.querySelector('.template-create')
        // CONTINUE HERE. GET TO KNOW HOW TO GET CHILDREN USING AJAX AND NOT VANILA JS
        const children = frame.querySelector('.template-create-tasks').childNodes
        for (const kid of children){
            if (kid.classList && kid.classList.contains('task')){
                kid.remove()
            }
        }
        frame.querySelector('.template-create-name').value = ''
        frame.querySelector('.template-create-description').value = ''

        frame.classList.add('none')
        document.querySelector('.template-create-no-task-message').classList.remove('none')
    }
    else if (event.target.closest('.done-task-return')) {
        const id = event.target.closest('.done-task-return').closest('.done-task').querySelector('input[name="id"]').value
        // GET INFO AND ADD  THIS TASK TO TASKS FOR COMPLITING
    }
    else if (event.target.closest('.change-comment-btn-subred')) {
        event.preventDefault();
        const comment = document.querySelector('.change-comment-form').querySelector('textarea').value
        if (357 < comment.length) {
            updateTooManyFrame.classList.remove('none')
            setTimeout(() => {
                updateTooManyFrame.classList.add('none')
            }, 3000)
        } else if (comment){
            const id = event.target.closest('.change-comment-btn-subred').closest('.comment').querySelector('input[name="id"]').value
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {changeCommentO: 1, id: id, text: comment},
                success: function(data){
                    if (data.status === 200){
                        event.target.closest('.change-comment-btn-subred').closest('.comment').querySelector('.comment-comment').classList.remove('none')
                        event.target.closest('.change-comment-btn-subred').closest('.comment').querySelector('.change-comment-form').classList.add('none')
                        event.target.closest('.change-comment-btn-subred').closest('.comment').querySelector('.comment-comment').innerHTML = comment
                    }
                }
            })
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