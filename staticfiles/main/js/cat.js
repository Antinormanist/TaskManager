function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

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
const sendUrl = document.querySelector('input[name="sendUrl"]').value
const wrongFrameMsg = document.querySelector('.wrong-message')
const changeEmailFrame = document.querySelector('.changeEmailFrameCode')
let changeEmailCode
let changeEmaill
let changeEmailPassword
let tries = 5

let taskToDelete

window.addEventListener('click', (event) => {
    if (event.target.closest('.task-delete') && delTask.classList.contains('none')) {
        event.preventDefault();
        const dataFrame = event.target.closest('.task-delete').closest('.done-task')
        let id
        if (dataFrame) {
            id = dataFrame.querySelector('input[name="id"]').value
            taskToDelete = event.target.closest('.task-delete').closest('.done-task')
        } else {
            id = event.target.closest('.task-delete').closest('.task').querySelector('input[name="id"]').value
            taskToDelete = event.target.closest('.task-delete').closest('.task')
        }
//        ALSO CREATE OPTION FOR TEMPLATES TASK
        delTask.querySelector('input[name="id"]').value = id
        delTask.classList.remove('none')
    }
    else if (event.target.closest('.task-delete-btn-back')) {
        event.preventDefault();
        delTask.querySelector('input[name="is-completed-task"]').value = 'no'
        delTask.querySelector('input[name="id"]').value = ''
        taskToDelete = null
        delTask.classList.add('none')
    }
    else if (event.target.closest('.task-delete-submit-btn')) {
        event.preventDefault();
        const id = delTask.querySelector('input[name="id"]').value
        const task = taskToDelete
        if (id && task) {
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {deleteTask: 1, id: id},
                success: function(data) {
                    if (data.status === 204) {
                        task.remove()
                        delTask.classList.add('none')
                        delTask.querySelector('input[name="id"]').value = ''
                        taskToDelete = null
//                        MAKE APPEARENCE OF NO TASK FRAME
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
                        count = 0
                        const tasks2 = doneTasks.children
                        for (let i = 0; i < tasks2.length; i++) {
                            const task = tasks2[i]
                            if (task.classList.contains('done-task')) {
                                count += 1
                            }
                        }
                        console.log(count, "hello worfurdro")
                        console.log(tasks2)
                        if (count === 0) {
                            doneTasks.classList.add('none')
                        }
                    } else {
                        wrongFrameMsg.querySelector('h2').innerText = 'Что - то пошло не так';
                        wrongFrameMsg.classList.remove('none');
                        setTimeout(() => {
                            wrongFrameMsg.classList.add('none');
                        }, 1500);
                    }
                }
            })
        } else {
            wrongFrameMsg.querySelector('h2').innerText = 'Что - то пошло не так';
            wrongFrameMsg.classList.remove('none');
            setTimeout(() => {
                wrongFrameMsg.classList.add('none');
            }, 1500);
        }
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
    else if (event.target.closest('.change-email-submit-btn')) {
        event.preventDefault()
        password = event.target.closest('.change-email-frame').querySelector('input[name="password"]').value
        email = event.target.closest('.change-email-frame').querySelector('input[name="email"]').value
        if (password && email) {
            $.ajax({
                url: sendUrl,
                method: "post",
                headers: {'X-CSRFToken': csrftoken},
                data: {changeEmail: 1, password: password, email: email},
                success: function(data) {
                    if (data.status === 200) {
                        changeEmailCode = data.code
                        changeEmailFrame.classList.remove('none')
                        changeEmailFrame.querySelector(".emailP").innerText = `Отправленно письмо на почту ${email}`
                        changeEmailPassword = password
                        changeEmaill = email
                        emailFrame.classList.add('none')
                        emailFrame.querySelector('input[name="password"]').value = ''
                        emailFrame.querySelector('input[name="email"]').value = ''
                    }
                    if (data.status === 403) {
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
    else if (event.target.closest('.emailF')) {
        event.preventDefault()
        console.log(changeEmailCode)
        if (changeEmailCode) {
            const userCode = parseInt(changeEmailFrame.querySelector('input[name="code"]').value)
            if (userCode === changeEmailCode) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    data: {successEmail: 1, email: changeEmaill, password: changeEmailPassword},
                    headers: {'X-CSRFToken': csrftoken},
                    success: function() {
                        changeEmailFrame.classList.add('none')
                        changeEmailFrame.querySelector('input[name="code"]').value = ''
                        document.querySelector('.change-email-p').innerText = changeEmaill
                        tries = 5
                    }
                })
            } else {
                tries -= 1
                if (tries === 0) {
                    window.location = '?'
                }
                emailFrame.querySelector('.tries').innerText = `осталось попыток ${tries}`
            }
        }
    }
    else if (event.target.closest('.filter-btn') && filterFrame.classList.contains('none')) {
        filterFrame.classList.remove('none')
    }
    else if (event.target.closest('.change-username-btn') && loginFrame.classList.contains('none')) {
        loginFrame.classList.remove('none')
    }
    else if (event.target.closest('.change-login-close-btn')) {
        event.preventDefault();
        loginFrame.classList.add('none')
    }
    else if (event.target.closest('.change-login-submit-btn')) {
        event.preventDefault();
        password = event.target.closest('.change-login-frame').querySelector('input[name="password"]').value.trim();
        newLogin = event.target.closest('.change-login-frame').querySelector('input[name="login"]').value.trim();
        if (password && newLogin) {
            $.ajax({
                url: sendUrl,
                method: "post",
                headers: {'X-CSRFToken': csrftoken},
                data: {changeLogin: 1, password: password, newLogin: newLogin},
                success: function(data) {
                    if (data.status === 201) {
                        document.querySelector('.change-username-p').innerText = newLogin;
                        document.querySelector('nav').querySelector('.username').innerText = newLogin;
                        event.target.closest('.change-login-frame').querySelector('input[name="password"]').value = ''
                        event.target.closest('.change-login-frame').querySelector('input[name="login"]').value = ''
                        event.target.closest('.change-login-frame').classList.add('none')
                    } else if (data.status === 403) {
                        wrongFrameMsg.querySelector('h2').innerText = 'Неверный пароль';
                        wrongFrameMsg.classList.remove('none');
                        setTimeout(() => {
                            wrongFrameMsg.classList.add('none');
                        }, 1500);
                    }
                }
            });
        }
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