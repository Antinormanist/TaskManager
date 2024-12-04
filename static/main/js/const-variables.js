const trashImg = document.querySelector('input[name="trashUrl"]').value
const returnImg = document.querySelector('input[name="returnUrl"]').value
const taskImg = document.querySelector('input[name="taskUrl"]').value
const addImg = document.querySelector('input[name="addUrl"]').value
let constTask = `
<div class="task">
    {id}
    <div class="task-infos">
        {priority}
        {remind}
        {minutes}
    </div>
    <button class="task-nade">
        {name}
        {description}
    </button>
    <button class="task-delete"><img src="${trashImg}" alt="del"></button>
    <button class="task-return"><img src="${returnImg}" alt="return"></button>
</div>
`
const noTaskFrame = `
<div class="no-task">
    <img class="no-task-img" src="${taskImg}" alt="task">
    <h2>Задач на сегодня нет</h2>
</div>
<button class="add-btn">
    <span><img class="add-img" src="${addImg}" alt="add"></span><h4>добавить задачу</h4>
</button>
`