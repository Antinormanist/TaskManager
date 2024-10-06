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

const dataFrame = document.querySelector('.firs')
const emailFrame = document.querySelector('.secon')
const wrongFrame = document.querySelector('.wrong-message')
const sendUrl = document.querySelector('input[name="sendUrl"]').value
let username
let password
let email
let code
let tries = 5

window.addEventListener('click', event => {
    if (code) {
        if (event.target.closest('.emailF')) {
                event.preventDefault()
                const userCode = parseInt(emailFrame.querySelector('input[name="code"]').value)
                if (userCode === code) {
                    $.ajax({
                        url: sendUrl,
                        method: 'post',
                        data: {success: 1, username: username, password: password},
                        headers: {'X-CSRFToken': csrftoken},
                        success: function(data) {
                            window.location = data.successUrl
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
    } else {
        if (event.target.closest('.dataF') && emailFrame.classList.contains('none')) {
            event.preventDefault()
            username = dataFrame.querySelector('input[name="login"]').value
            password = dataFrame.querySelector('input[name="password"]').value
            if (username && password) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    data: {username: username, password: password},
                    headers: {'X-CSRFToken': csrftoken},
                    success: function(data) {
                        if (data.status === 404) {
                            wrongFrame.querySelector('h2').innerText = 'Нет пользователя с таким логином'
                            wrongFrame.classList.remove('none')
                            setTimeout(() => {
                                wrongFrame.classList.add('none')
                            }, 1500)
                        } else if (data.status === 403) {
                            wrongFrame.querySelector('h2').innerText = 'Неверный логин или пароль'
                            wrongFrame.classList.remove('none')
                            setTimeout(() => {
                                wrongFrame.classList.add('none')
                            }, 1500)
                        } else if (data.trust) {
                            window.location = data.successUrl
                        } else {
                            code = data.code
                            email = data.email
                            document.querySelector('.emailP').innerText = `Отправленно письмо на почту ${email}`
                            dataFrame.classList.add('none')
                            emailFrame.classList.remove('none')
                        }
                    },
                })
            }
        }
    }
})