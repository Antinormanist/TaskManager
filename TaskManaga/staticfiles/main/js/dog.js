const fkrgji = document.querySelector('.remind-changer')
const aas = document.querySelector('.months2')
const taskFramik = document.querySelector('.task-detail-info')
const TemplATopNg = document.querySelector('.template-frame')
const result = document.querySelector('.task-results')
const fm = document.querySelector('.task-detail-info')

window.addEventListener('click', (event) => {
    if (event.target.closest('.detail-remind-btn') && fkrgji.classList.contains('none')) {
        fkrgji.classList.remove('none')
    }
    else if (event.target.closest('.remind-changer-btn-back')) {
        fkrgji.classList.add('none')
    }
    if (event.target.closest('.remind-changer-month') && aas.classList.contains('none')) {
        aas.classList.remove('none')
    } else if (!aas.classList.contains('none')) {
        aas.classList.add('none')
    }
    else if (event.target.closest('.task-nade') && taskFramik.classList.contains('none')) {
        const task = event.target.closest('.task-nade').closest('.task')
        const id = task.querySelector('input[name="id"]').value

        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {getInfoForTaskFrame: 1, id: id},
            success: function(data){
                if (data.status === 200){
                    taskFramik.classList.remove('none')
                    taskFramik.querySelector('input[name="id"]').value = id

                    const comments = JSON.parse(data.comments)

                    const commsPlace = taskFramik.querySelector('.btns-and-comments').querySelector('.comments-more')
                    const addComm = taskFramik.querySelector('.make-comment')

                    let amountCom = comments.length
                    if (99 < amountCom){
                        amountCom = '99+'
                    }
                    // amount of comments
                    taskFramik.querySelector('.commentaries-btn').querySelector('.weak-p').innerHTML = amountCom

                    comments.forEach((elem) => {
                        const day = elem.day
                        const month = elem.month
                        const year = elem.year
                        let imga
                        let usar
                        if (elem.userImage){
                            imga = elem.userImage
                        } else {
                            imga = document.querySelector('.qpla').value
                        }
                        if (elem.username){
                            usar = elem.username
                        } else {
                            user = "Неизвестный"
                        }

                        const comment = `<div class="comment">
                            <input type="hidden" name="id" value="${elem.id}">
                            <img class="comment-avatar" src="${imga}" alt="ava">
                            <div class="comment-head">
                                <h3 class="comment-login">${usar}</h3>
                                <p class="comment-time">${day}.${month}.${year}</p>
                                <button class="comment-edit-btn"><img src=${changeIconLink} alt="edit"></button>
                                <button class="comment-delete-btn"><img src=${trashIconLink} alt="del"></button>
                            </div>
                            <div class="change-comment-form none">
                                <textarea name="new-comment" placeholder="комментарий"></textarea>
                                <button class="change-comment-btn-back btn-back">отмена</button>
                                <button class="change-comment-btn-subred btn-subred">изменить</button>
                            </div>
                            <p class="comment-comment">${elem.comment}</p>
                        </div>`
                        const parser = new DOMParser()
                        let node = parser.parseFromString(comment, 'text/html')
                        node = node.body.firstChild

                        commsPlace.insertBefore(node, addComm.nextSibling)
                    })


                    const name = data.name
                    const description = data.description
                    const priority = data.priority
                    const remind = data.remind // day|month|year
                    if (remind) {
                        const remindd = remind.split('|')
                        const day = remindd[0]
                        const month = remindd[1]
                        const year = remindd[2]

                        fm.querySelector('input[name="remind"]').value = remind
                        fm.querySelector('.detail-remind-btn').querySelector('p').innerHTML = remind
                    }

                    fm.querySelector('input[name="priority"]').value = priority
                    if (priority === 'common'){
                        fm.querySelector('.detail-priority-btn').querySelector('p').innerHTML = 'обычный'
                    } else if (priority === 'simple'){
                        fm.querySelector('.detail-priority-btn').querySelector('p').innerHTML = 'простой'
                    } else if (priority === 'important'){
                        fm.querySelector('.detail-priority-btn').querySelector('p').innerHTML = 'важный'
                    } else {
                        fm.querySelector('.detail-priority-btn').querySelector('p').innerHTML = 'сильный'
                    }
                    fm.querySelector('.namedescription').querySelector('.name-inp').innerHTML = name
                    fm.querySelector('.namedescription').querySelector('.description-inp').innerHTML = description;

                } else {
                    wrongFrameMsg.querySelector('h2').innerText = 'Не удалось получить данные таска';
                    wrongFrameMsg.classList.remove('none');
                    setTimeout(() => {
                        wrongFrameMsg.classList.add('none');
                    }, 1500);
                }
            }
        })
    }
    else if (event.target.closest('.detail-btn-back')) {
        event.preventDefault();
        taskFramik.classList.add('none')

        taskFramik.querySelector('input[name="id"]').value = ""
        fm.querySelector('input[name="remind"]').value = ""
        fm.querySelector('.detail-remind-btn').querySelector('p').innerHTML = "нет"

        fm.querySelector('input[name="priority"]').value = ""
        fm.querySelector('.detail-priority-btn').querySelector('p').innerHTML = "обычный"
        // continue here
        fm.querySelector('.namedescription').querySelector('.name-inp').innerHTML = ""
        fm.querySelector('.namedescription').querySelector('.description-inp').innerHTML = ""
    }
    else if (event.target.closest('.template-btn2') && TemplATopNg.classList.contains('none')) {
        const template = event.target.closest('.template-btn2').closest('.template-download-template')
        const id = template.querySelector('input[name="id"]').value
        TemplATopNg.querySelector('input[name="id"]').value = id
        TemplATopNg.classList.remove('none')
        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            async: false,
            data: {GetTemplateBt2Inf: 1, id: id},
            success: function(data){
                if (data.status === 200){
                    const where = document.querySelector('.template-tasks')
                    const name = data.name
                    const description = data.description
                    where.querySelector('.template-template-name').innerHTML = name
                    where.querySelector('.template-template-description').innerHTML = description
                }
            }
        })
        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {GetTasksOfTempDownload: 1, id: id},
            success: function(data){
                if (data.status === 200){
                    const tasks = JSON.parse(data.tasks)
                    for (const task of tasks){
                        const task_frame = `
                        <div class="template-task">
                            <input type="hidden" name="id" value="{id}">
                            <div class="prt-info">
                                <p class="template-task-priority pcb2">{priority}</p>
                                {remind}
                                {minutes}
                            </div>
                            <div class="template-name-and-description">
                                {name}
                                {description}
                            </div>
                        </div>
                        `

                        let ts = task_frame
                        const name = task.name
                        ts = ts.replace('{id}', task.id)
                        // desc cut 64 letters
                        let description = task.description

                        if (description && 64 < description.length){
                            description = description.slice(0, 64)
                        } else {
                            description = ''
                        }
                        const priority = task.priority
                        let minutes = task.minutes
                        let remind = task.remind

                        ts = ts.replace('{name}', `<p class="template-task-name">${name}</p>`)
                        ts = ts.replace('{description}', `<p class="template-task-description">${description}</p>`)
                        if (priority === 'common'){
                            ts = ts.replace('{priority}', 'обычный')
                        } else if (priority === 'simple'){
                            ts = ts.replace('{priority}', 'простой')
                        } else if (priority === 'important'){
                            ts = ts.replace('{priority}', 'важный')
                        } else {
                            ts = ts.replace('{priority}', 'сильный')
                        }
                        if (remind){
                            ts = ts.replace('{remind}', `<p class="template-task-remind">с напоминанием</p>`)
                        } else {
                            ts = ts.replace('{remind}', '')
                        }
                        if (minutes){
                            ts = ts.replace('{minutes}', `<p class="template-task-time">${minutes} минут</p>`)
                        } else {
                            ts = ts.replace('{minutes}', '')
                        }

                        document.querySelector('.template-tasks').insertAdjacentHTML('beforeend', ts)
                    }
                }
            }
        })
    }
    else if (event.target.closest('.dwn-btn-close')) {
        event.preventDefault();
        TemplATopNg.classList.add('none')

        const kids = document.querySelector('.template-tasks').children
        for (let j = 0; j < 5; j++){
            for (const kid of kids){
                if (kid.classList.contains('template-task')){
                    kid.remove()
                }
            }
        }
    }
    else if (event.target.closest('.dwn-btn-with')){
        event.preventDefault()
        const kids = document.querySelector('.template-frame').querySelector('.template-tasks').children
        const task_frame = `
        <div class="task">
            <input type="hidden" name="id" value="{id}">
            <div class="task-infos">
                {priority}
                {remind}
                {minutes}
            </div>
            <button class="task-nadeFa">
                {name}
                {description}
            </button>
            <button class="task-delete"><img src="${trashImg}" alt="del"></button>
            <button class="task-return"><img src="${returnImg}" alt="ret"></button>
        </div>
        `
        // КОГДА УДАЛЯЕШЬ ТЕМПЛЕЙТ ИЗ ЗАГРУЗИТЬ, ТО ПУСТЬ УДАЛЯТСЯ ВСЕ ТААСКИ НА РАБ СТОЛЕ, У КОТОРЫХ ТЕМПЛЕЙТ РАВЕН УАЛЁННОМУ

        for (const kid of kids){
            if (kid.classList.contains('template-task')){
                let ts = task_frame
                const name = kid.querySelector('.template-task-name').innerHTML
                let description = kid.querySelector('.template-task-description').innerHTML
                if (description && 64 < description.length){
                    description = description.slice(0, 64)
                } else {
                    description = ''
                }
                let remind = ''
                if (kid.querySelector('.template-task-remind')){
                    remind = kid.querySelector('.template-task-remind').innerHTML
                }
                let minutes = ''
                if (kid.querySelector('.template-task-time')){
                    minutes = kid.querySelector('.template-task-time').innerHTML
                    minutes = parseInt(minutes.split()[0])
                }
                const priority = kid.querySelector('.template-task-priority').innerHTML
                const idd = kid.querySelector('input[name="id"]').value
                // here
                ts = ts.replace('{id}', idd)

                ts = ts.replace('{name}', `<h2 class="task-name">${name}</h2>`)
                if (priority === 'обычный') {
                    ts = ts.replace('{priority}', `<button class=''><img src=${comrad} alt='radio' class='common-rad'></button>`)
                } else if (priority === 'простой') {
                    ts = ts.replace('{priority}', `<button class=''><img src=${simrad} alt='radio' class='simple-rad'></button>`)
                } else if (priority === 'важный') {
                    ts = ts.replace('{priority}', `<button class=''><img src=${imprad} alt='radio' class='important-rad'></button>`)
                } else if (priority === 'сильный') {
                    ts = ts.replace('{priority}', `<button class=''><img src=${strrad} alt='radio' class='strong-rad'></button>`)
                }
                if (description) {
                    let trunct_desc = description.slice(0, 64)
                    if (trunct_desc.length === 64) {
                        trunct_desc += '...'
                    }
                    ts = ts.replace('{description}', `<h3 class='task-description'>${trunct_desc}</h3>`)
                } else {
                    ts = ts.replace('{description}', '')
                }
                if (minutes) {
                    ts = ts.replace('{minutes}', `<h3 class='task-time'>${minutes} минут</h3>`)
                } else {
                    ts = ts.replace('{minutes}', '')
                }
                if (remind) {
                    ts = ts.replace('{remind}', "<h3 class='task-remind'>с напоминанием</h3>")
                } else {
                    ts = ts.replace('{remind}', '')
                }
                document.querySelector('.main').insertAdjacentHTML('afterbegin', ts)
            }
        }
    }
    else if (event.target.closest('.result-btn') && result.classList.contains('none')) {
        result.classList.remove('none')
    }
    else if (event.target.closest('.exit')) {
        result.classList.add('none')
        result.querySelector('.info-uncompleted').querySelector('.minutes').innerHTML = ""
        result.querySelector('.info-completed').querySelector('.minutes').innerHTML = ""

        result.querySelector('.info-uncompleted').querySelector('.no-time').innerHTML = ""
        result.querySelector('.info-completed').querySelector('.no-time').innerHTML = ""
    }
})