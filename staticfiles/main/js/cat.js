const delTask = document.querySelector('.task-delete-frame')
const dtempDel = document.querySelector('.delete-template-submit')
const emailFrame = document.querySelector('.change-email-frame')
const filterFrame = document.querySelector('.filter-frame')
const loginFrame = document.querySelector('.change-login-frame')
const date2 = document.querySelector('.task-detail-info').querySelector('input[name=remind]')
const mInpUt = document.querySelector('.months2').querySelector('input')
const showMonth2 = document.querySelector('.remind-changer-month').querySelector('p')
const date = document.querySelector('.add-task-frame').querySelector('input[name=remind]')
const btn = document.querySelector('.choose-date-btn-submit')

window.addEventListener('click', (event) => {
    if (event.target.closest('.task-delete') && delTask.classList.contains('none')) {
        event.preventDefault();
        const dataFrame = event.target.closest('.task-delete').closest('.done-task')
        const id = dataFrame.querySelector('input[name="id"]').value
        delTask.querySelector('input[name="id"]').value = id
        delTask.querySelector('input[name="is-completed-task"]').value = 'true'
        delTask.classList.remove('none')
    }
    else if (event.target.closest('.task-delete-btn-back')) {
        event.preventDefault();
        delTask.querySelector('input[name="is-completed-task"]').value = 'no'
        delTask.classList.add('none')
    }
    else if (event.target.closest('.template-delete') && dtempDel.classList.contains('none')) {
        const id = event.target.closest('.template-delete').closest('.template-download-template').querySelector('input[name="id"]').value
        dtempDel.querySelector('input[name="id"]').value = id
        dtempDel.classList.remove('none')
    }
    else if (event.target.closest('.bbc')) {
        event.preventDefault();
        dtempDel.classList.add('none')
    }
    else if (event.target.closest('.comment-edit-btn')) {
        const frame = event.target.closest('.comment')
        const fform = frame.querySelector('.change-comment-form')
        const area = fform.querySelector('textarea')
        area.innerText = frame.querySelector('.comment-comment').innerText
        if (fform.classList.contains('none')) {
            frame.querySelector('.comment-comment').classList.add('none')
            // ADD COMM TO TEXTAREA
            fform.classList.remove('none')
        }
    }
    else if (event.target.closest('.change-comment-btn-back')) {
        event.preventDefault();
        const btn = event.target.closest('.change-comment-btn-back')
        const frame = btn.closest('.comment')
        frame.querySelector('.comment-comment').classList.remove('none')
        frame.querySelector('.change-comment-form').classList.add('none')
    }
    else if (event.target.closest('.change-email-btn') && emailFrame.classList.contains('none')) {
        emailFrame.classList.remove('none')
    }
    else if (event.target.closest('.change-email-close-btn')) {
        event.preventDefault();
        emailFrame.classList.add('none')
    }
    else if (event.target.closest('.filter-btn') && filterFrame.classList.contains('none')) {
        filterFrame.classList.remove('none')
    }
    else if (event.target.closest('.filter-btn-back')) {
        event.preventDefault()
        filterFrame.classList.add('none')
    }
    else if (event.target.closest('.change-username-btn') && loginFrame.classList.contains('none')) {
        loginFrame.classList.remove('none')
    }
    else if (event.target.closest('.change-login-close-btn')) {
        event.preventDefault();
        loginFrame.classList.add('none')
    }
    else if (event.target.closest('.remind-changer-btn-submit')) {
        event.preventDefault();
        const day = parseInt(document.querySelector('.remind-changer').querySelector('input[name="day"]').value)
        const month = parseInt(document.querySelector('.months2').querySelector('input[name="month"]').value)
        const year = parseInt(document.querySelector('.remind-changer').querySelector('input[name="year"]').value)
        const monthsMap = {
            1: 'января',
            2: 'февраля',
            3: 'марта',
            4: 'апреля',
            5: 'мая',
            6: 'июня',
            7: 'июля',
            8: 'августа',
            9: 'сентября',
            10: 'октября',
            11: 'ноября',
            12: 'декабря',
        }
        const testDate = `${month}/${day}/${year}`
        if (!isNaN(new Date(testDate))) {
            date2.value = testDate
            document.querySelector('.remind-changer').classList.add('none')
            document.querySelector('.detail-remind-btn').querySelector('p').innerText = `${day} ${monthsMap[month]} ${year} год`
        }
    }
    else if (event.target.closest('.mbg2')) {
        event.preventDefault();
        mInpUt.value = event.target.closest('.mbg2').classList[0].slice(3, -1)
        showMonth2.innerText = event.target.closest('.mbg2').innerText
    }
    else if (event.target.closest('.choose-date-btn-submit')) {
        event.preventDefault();
        const day = parseInt(document.querySelector('.choose-date').querySelector('input[name="day"]').value)
        const month = parseInt(document.querySelector('.months').querySelector('input[name="month"]').value)
        const year = parseInt(document.querySelector('.choose-date').querySelector('input[name="year"]').value)
        const monthsMap = {
            1: 'января',
            2: 'февраля',
            3: 'марта',
            4: 'апреля',
            5: 'мая',
            6: 'июня',
            7: 'июля',
            8: 'августа',
            9: 'сентября',
            10: 'октября',
            11: 'ноября',
            12: 'декабря',
        }
        const testDate = `${month}/${day}/${year}`
        if (!isNaN(new Date(testDate))) {
            date.value = testDate
            document.querySelector('.choose-date').classList.add('none')
            document.querySelector('.prta').innerText = `${day} ${monthsMap[month]} ${year} год`
        }
    }
})