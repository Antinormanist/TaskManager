const dqwrytrhgrhrhrt = document.querySelector('.template-change-delete-frame')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-change-template-delete-btn') && dqwrytrhgrhrhrt.classList.contains('none')) {
        const id = event.target.closest('.template-change-template-delete-btn').closest('.template-change-template').querySelector('input[name="id"]').value
        dqwrytrhgrhrhrt.querySelector('input[name="id"]').value = id
        dqwrytrhgrhrhrt.classList.remove('none')
    }
    if (event.target.closest('.template-change-btn-back2')) {
        event.preventDefault();
        dqwrytrhgrhrhrt.classList.add('none')
    }
})