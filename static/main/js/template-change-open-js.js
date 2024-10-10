const yahz = document.querySelector('.template-change-template-one')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-change-template-btn') && yahz.classList.contains('none')) {
        const id = event.target.closest('.template-change-template-btn').closest('.template-change-template').querySelector('input[name="id"]').value
        yahz.querySelector('input[name="id"]').value = id
        // SENDE API REQUEIST AND ET OTHER INFO
        yahz.classList.remove('none')
        event.target.closest('.tcobback').closest('.template-change-template-one').querySelector('.template-change-divider').classList.remove('none')
    }
    if (event.target.closest('.tcobback')) {
        event.preventDefault()
        const tasks = event.target.closest('.tcobback').closest('.template-change-template-one').querySelector('.inf-and-tasks').querySelectorAll('.template-change-task')
        tasks.forEach(element => {
           element.remove() 
        });
        event.target.closest('.tcobback').closest('.template-change-template-one').querySelector('.template-change-divider').classList.add('none')
        yahz.classList.add('none')
    }
})