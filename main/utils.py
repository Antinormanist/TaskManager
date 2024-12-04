def priority_sort(task) -> int:
    if task.priority == 'common':
        return 1
    elif task.priority == 'simple':
        return 2
    elif task.priority == 'important':
        return 3
    return 4