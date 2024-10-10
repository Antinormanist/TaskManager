const dtempDel = document.querySelector('.delete-template-submit')

window.addEventListener('click', (event) => {
    if (event.target.closest('.template-delete') && dtempDel.classList.contains('none')) {
        const id = event.target.closest('.template-delete').closest('.template-download-template').querySelector('input[name="id"]').value
        dtempDel.querySelector('input[name="id"]').value = id
        dtempDel.classList.remove('none')
    } 
    if (event.target.closest('.bbc')) {
        event.preventDefault();
        dtempDel.classList.add('none')
    }
})