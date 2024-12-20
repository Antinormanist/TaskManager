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
    }
    else if (event.target.closest('.dwn-btn-close')) {
        event.preventDefault();
        TemplATopNg.classList.add('none')
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