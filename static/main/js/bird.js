const settingsFrame = document.querySelector('.account-settings')
const doujoifureg8 = document.querySelector('.add-task-frame')
const ddKJFIDJFIOJDS = document.querySelector('.template-change-delete-template-frame')
const pOJNJHhgf = document.querySelector('.template-change-delete-task-frame')
const dqwrytrhgrhrhrt = document.querySelector('.template-change-delete-frame')
const yahz = document.querySelector('.template-change-template-one')
const openTa = document.querySelector('.task-detail-info')

window.addEventListener('click', (event) => {
    if (event.target.closest('.settings-btn') && settingsFrame.classList.contains('none')) {
        settingsFrame.classList.remove('none')
    }
    else if (event.target.closest('.change-name-btn')) {
        event.preventDefault()
        name = event.target.closest('.account-settings').querySelector('.name-input').value
        if (name) {
            $.ajax({
                url: sendUrl,
                method: 'post',
                headers: {'X-CSRFToken': csrftoken},
                data: {changeName: 1, name: name},
                success: function(data) {
                    if (data.status === 200) {
                        document.querySelector('nav').querySelector('.btns').querySelector('.username').innerText = name
                    }
                }
            })
        }
    }
    else if (event.target.closest('.avatar-change-btn')) {
        event.preventDefault()
        avatar = event.target.closest('.avatar-frame').querySelector('input[name="file"]').files[0]
        const sendAva = new FormData()
        sendAva.append('image', avatar)
        sendAva.append('sendAva', 1)
        if (avatar) {
            $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: sendAva,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.status == 200) {
                    document.querySelector('.avatar-frame').classList.add("none")
                    document.querySelector('.avatar-frame').querySelector('input[name="file"]').value = null

                    document.querySelector('.ava').src = data.url
                    document.querySelector('.avatar-img').src = data.url
                }
            }
            })
        }
    }
    else if (event.target.closest('.account-settings-close-btn')) {
        settingsFrame.classList.add('none')
    }
    else if (event.target.closest('.tcobadd') && doujoifureg8.classList.contains('none')) {
        event.preventDefault()
        doujoifureg8.querySelector('input[name="is-template"]').value = 'true'
        doujoifureg8.classList.remove('none')
    }
    else if (event.target.closest('.task-close-btn')) {
        event.preventDefault();
        doujoifureg8.querySelector('input[name="is-template"]').value = 'no'
        doujoifureg8.classList.add('none')
    }
    else if (event.target.closest('.tcobdel') && ddKJFIDJFIOJDS.classList.contains('none')) {
        event.preventDefault();
        const id = event.target.closest('.tcobdel').closest('.template-change-template-one').querySelector('input[name="id"]').value
        ddKJFIDJFIOJDS.querySelector('input[name="id"]').value = id
        ddKJFIDJFIOJDS.classList.remove('none')
    }
    else if (event.target.closest('.template-change-delete-btn-back')) {
        event.preventDefault();
        ddKJFIDJFIOJDS.classList.add('none')
    }
    else if (event.target.closest('.template-change-task-delete-btn2') && pOJNJHhgf.classList.contains('none')) {
        event.preventDefault()
        const id = event.target.closest('.template-change-task-delete-btn2').closest('.template-change-task').querySelector('input[name="id"]').value
        pOJNJHhgf.querySelector('input[name="id"]').value = id
        pOJNJHhgf.classList.remove('none')
    }
    else if (event.target.closest('.bbq')) {
        event.preventDefault();
        pOJNJHhgf.classList.add('none')
    }
    else if (event.target.closest('.template-change-template-delete-btn') && dqwrytrhgrhrhrt.classList.contains('none')) {
        const id = event.target.closest('.template-change-template-delete-btn').closest('.template-change-template').querySelector('input[name="id"]').value
        dqwrytrhgrhrhrt.querySelector('input[name="id"]').value = id
        dqwrytrhgrhrhrt.classList.remove('none')
    }
    else if (event.target.closest('.template-change-btn-back2')) {
        event.preventDefault();
        dqwrytrhgrhrhrt.classList.add('none')
    }
    else if (event.target.closest('.template-change-template-btn') && yahz.classList.contains('none')) {
        const id = event.target.closest('.template-change-template-btn').closest('.template-change-template').querySelector('input[name="id"]').value
        yahz.querySelector('input[name="id"]').value = id
        // SENDE API REQUEIST AND ET OTHER INFO
        yahz.classList.remove('none')
        event.target.closest('.tcobback').closest('.template-change-template-one').querySelector('.template-change-divider').classList.remove('none')
    }
    else if (event.target.closest('.tcobback')) {
        event.preventDefault()
        const tasks = event.target.closest('.tcobback').closest('.template-change-template-one').querySelector('.inf-and-tasks').querySelectorAll('.template-change-task')
        tasks.forEach(element => {
           element.remove()
        });
        event.target.closest('.tcobback').closest('.template-change-template-one').querySelector('.template-change-divider').classList.add('none')
        yahz.classList.add('none')
    }
    else if (event.target.closest('.template-change-task-btn') && openTa.classList.contains('none')) {
        event.preventDefault();
        const id = event.target.closest('.template-change-task-btn').closest('.template-change-task').querySelector('input[name="id"]').value
        openTa.querySelector('input[name="is-template"]').value = 'true'
        openTa.querySelector('input[name="id"]').value = id
        openTa.classList.remove('none')
    }
    else if (event.target.closest('.detail-btn-back')) {
        openTa.querySelector('input[name="is-template"]').value = 'no'
        openTa.classList.add('none')
    }
})