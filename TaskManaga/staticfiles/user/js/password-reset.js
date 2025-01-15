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
const resetPassFrame = document.querySelector('.third')
const wrongFrame = document.querySelector('.wrong-message')
const sendUrl = document.querySelector('input[name="sendUrl"]').value
const chars = '[A-ZА-Я]'
const nums = '[0-9]'
const symbol = /\W/
let username
let password
let password2
let code
let tries = 5
let secretKey

window.addEventListener('click', event => {
    if (code) {
        if (event.target.closest('.emailF')) {
            event.preventDefault()
            const userCode = parseInt(emailFrame.querySelector('input[name="code"]').value)
            if (userCode === code) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    data: {startReset: 1},
                    headers: {'X-CSRFToken': csrftoken},
                    success: function(data) {
                        secretKey = data.secret_key
                        emailFrame.classList.add('none')
                        resetPassFrame.classList.remove('none')
                    }
                })
            } else {
                tries -= 1
                if (tries === 0) {
                    window.location = '?'
                }
                emailFrame.querySelector('.tries').innerText = `осталось попыток ${tries}`
            }
        } else if (event.target.closest('.resF')) {
            event.preventDefault()
            password = resetPassFrame.querySelector('input[name="password"]').value
            password2 = resetPassFrame.querySelector('input[name="password2"]').value
            if (password !== password2) {
                wrongFrame.querySelector('h2').innerText = 'Пароли не совпадают'
                wrongFrame.classList.remove('none')
                setTimeout(() => {
                    wrongFrame.classList.add('none')
                }, 1500)
            } else if (8 <= password.length && password.match(chars) && password.match(nums) && password.match(symbol)) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    headers: {'X-CSRFToken': csrftoken},
                    data: {reset: 1, secretKey: secretKey, password: password, username: username},
                    success: function(data) {
                        if (data.status === 200) {
                            window.location = data.successUrl
                        } else if (data.status === 403) {
                            window.location = 'https://youtu.be/dQw4w9WgXcQ?si=BBQ4NATSyVKqAa8d'
                        }
                    },
                })
            } else {
            wrongFrame.classList.remove('none')
            wrongFrame.querySelector('h2').innerText = 'Убедитесь, что в пароле минимум 8 символов, среди которых хотя-бы одна цифра, символ и заглавная буква'
            setTimeout(() => {
                wrongFrame.classList.add('none')
            }, 3500)
            }
        }
    } else {
        if (event.target.closest('.dataF') && emailFrame.classList.contains('none')) {
            event.preventDefault()
            username = dataFrame.querySelector('input[name="login"]').value
            if (username) {
                $.ajax({
                    url: sendUrl,
                    method: 'post',
                    data: {check_user: 1, username: username},
                    headers: {'X-CSRFToken': csrftoken},
                    success: function(data) {
                        if (data.status === 404) {
                            wrongFrame.querySelector('h2').innerText = 'Нет пользователя с таким логином'
                            wrongFrame.classList.remove('none')
                            setTimeout(() => {
                                wrongFrame.classList.add('none')
                            }, 1500)
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