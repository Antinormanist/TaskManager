const fkrgji = document.querySelector('.remind-changer')
const aas = document.querySelector('.months2')
const taskFramik = document.querySelector('.task-detail-info')
const TemplATopNg = document.querySelector('.template-frame')
const result = document.querySelector('.task-results')

window.addEventListener('click', (event) => {
    if (event.target.closest('.detail-remind-btn') && fkrgji.classList.contains('none')) {
        fkrgji.classList.remove('none')
    }
    if (event.target.closest('.remind-changer-btn-back')) {
        fkrgji.classList.add('none')
    }
    if (event.target.closest('.remind-changer-month') && aas.classList.contains('none')) {
        aas.classList.remove('none')
    } else if (!aas.classList.contains('none')) {
        aas.classList.add('none')
    }
    if (event.target.closest('.task-nade') && taskFramik.classList.contains('none')) {
        const task = event.target.closest('.task-nade').closest('.task')
        const id = task.querySelector('input[name="id"]').value
        taskFramik.classList.remove('none')
        taskFramik.querySelector('input[name="id"]').value = id
        // WE NEED SEND API REQUEST TO BACKEND TO GET OTHER INFOS
    }
    if (event.target.closest('.detail-btn-back')) {
        event.preventDefault();
        taskFramik.classList.add('none')
    }
    if (event.target.closest('.template-btn2') && TemplATopNg.classList.contains('none')) {
        const template = event.target.closest('.template-btn2').closest('.template-download-template')
        const id = template.querySelector('input[name="id"]').value
        TemplATopNg.querySelector('input[name="id"]').value = id
        TemplATopNg.classList.remove('none')
    }
    if (event.target.closest('.dwn-btn-close')) {
        event.preventDefault();
        TemplATopNg.classList.add('none')
    }
    if (event.target.closest('.result-btn') && result.classList.contains('none')) {
        result.classList.remove('none')
    }
    if (event.target.closest('.exit')) {
        result.classList.add('none')
    }
})