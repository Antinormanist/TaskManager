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
const pswr = wrongFrame.querySelector('.diff-pass')
const loginTaken = wrongFrame.querySelector('.taken-login')
const notAll = wrongFrame.querySelector('.not-all')
const pasvalid = wrongFrame.querySelector('.pasvalid')
const sendUrl = document.querySelector('input[name="sendUrl"]').value
const checkUrl = document.querySelector('input[name="checkUrl"]').value
let username
let password
let password2
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
                        data: {success: 1, username: username, password: password, email: email},
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
            email = dataFrame.querySelector('input[name="email"]').value
            password = dataFrame.querySelector('input[name="password"]').value
            password2 = dataFrame.querySelector('input[name="password2"]').value
            if (username && email && password && password2) {
                $.ajax({
                    url: checkUrl,
                    method: 'post',
                    headers: {'X-CSRFToken': csrftoken},
                    data: {username: username},
                    success: function(data) {
                        if (data.status === 409) {
                            wrongFrame.classList.remove('none')
                            loginTaken.classList.remove('none')
                            notAll.classList.add('none')
                            pswr.classList.add('none')
                            pasvalid.classList.add('none')
                            setTimeout(() => {
                                wrongFrame.classList.add('none')
                            }, 1500)
                        } else if (password !== password2) {
                            wrongFrame.classList.remove('none')
                            loginTaken.classList.add('none')
                            notAll.classList.add('none')
                            pswr.classList.remove('none')
                            pasvalid.classList.add('none')
                            setTimeout(() => {
                                wrongFrame.classList.add('none')
                            }, 1500)
                        } else {
                            const chars = '[A-ZА-Я]'
                            const nums = '[0-9]'
                            const symbol = /\W/
                            console.log(password.match(chars), password.match(nums), password.match(symbol))
                            if (8 <= password.length && password.match(chars) && password.match(nums) && password.match(symbol)) {
                                $.ajax({
                                    url: sendUrl,
                                    method: 'post',
                                    headers: {'X-CSRFToken': csrftoken},
                                    data: {sendEmail: true, email: email, username: username},
                                    success: function(data) {
                                        code = data.code
                                    }
                                })
                                dataFrame.classList.add('none')
                                emailFrame.classList.remove('none')
                                emailFrame.querySelector('.emailP').innerText = `Отправленно письмо на почту ${email}`
                            } else {
                                wrongFrame.classList.remove('none')
                                loginTaken.classList.add('none')
                                notAll.classList.add('none')
                                pswr.classList.add('none')
                                pasvalid.classList.remove('none')
                                setTimeout(() => {
                                    wrongFrame.classList.add('none')
                                }, 3500)
                            }
                        }
                    }
                })
            } else {
                wrongFrame.classList.remove('none')
                loginTaken.classList.add('none')
                notAll.classList.remove('none')
                pswr.classList.add('none')
                setTimeout(() => {
                    wrongFrame.classList.add('none')
                }, 1500)
            }
    }
    }
})