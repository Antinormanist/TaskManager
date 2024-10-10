window.addEventListener('click', event => {
    if (event.target.closest('.done-task-return')) {
        const id = event.target.closest('.done-task-return').closest('.done-task').querySelector('input[name="id"]').value
        // GET INFO AND ADD  THIS TASK TO TASKS FOR COMPLITING
    }
})