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

                    // CHANGE THERI STYLE(ADD BORDER-RADIUS) AND CHANGING PRIORITY AND REMIND AND MAKE COMMENTARIES


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
                    // continue here
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
        // WE NEED SEND API REQUEST TO BACKEND TO GET OTHER INFOS
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