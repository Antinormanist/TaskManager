TASK_DATE_MESSAGE = '''
Привет, {username}!
Если ты видишь это сообщение, то это значит,
что сработало напоминание, которое ты ставил
на задачу.

Название задачи:
{task_title}

Удачного выполнения!
'''


def priority_sort(task) -> int:
    if task.priority == 'common':
        return 1
    elif task.priority == 'simple':
        return 2
    elif task.priority == 'important':
        return 3
    return 4