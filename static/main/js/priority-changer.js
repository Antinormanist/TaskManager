const actionFrame = document.querySelector('.task-detail-info')
const openFramePriorities = document.querySelector('.priority-changer')

window.addEventListener('click', (event) => {
    if (event.target.closest('.detail-priority-btn') && openFramePriorities.classList.contains('none')) {
        openFramePriorities.classList.remove('none')
    } else {
        openFramePriorities.classList.add('none')
    }
    const input = actionFrame.querySelector('input[name="priority"]')
    const p = actionFrame.querySelector('.detail-priority-btn').querySelector('p')
    if (event.target.closest('.priority-changer-common')) {
        input.value = 'common'
        p.innerText = 'обычный'
    } else if (event.target.closest(".priority-changer-simple")) {
        input.value = 'simple'
        p.innerText = 'простой'
    } else if (event.target.closest(".priority-changer-important")) {
        input.value = 'important'
        p.innerText = 'важный'
    } else if (event.target.closest(".priority-changer-strong")) {
        input.value = 'strong'
        p.innerText = 'сильный'
    }
})