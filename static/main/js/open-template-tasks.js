const TemplATopNg = document.querySelector('.template-frame')

window.addEventListener('click', (event) => {
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
})