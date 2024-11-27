setInterval( function(){
    const currentDate = new Date().toISOString()
    const dateDate = currentDate.split('T')[0].split('-')
    const dateTime = currentDate.split('T')[1].split(':').slice(0, 2)

    const year = Number(dateDate[0])
    const month = Number(dateDate[1])
    const day = Number(dateDate[2])

    const hours = Number(dateTime[0])
    const minutes = Number(dateTime[1])

    if (hours === 0 && minutes === 0) {
        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {sendMessageDate: 1, day: day, month: month, year: year},
        })
    }
    if (hours === 0 && minutes === 1) {
        $.ajax({
            url: sendUrl,
            method: 'post',
            headers: {'X-CSRFToken': csrftoken},
            data: {sendMessageDate: 1, day: day, month: month, year: year}
        })
    }
} , 1000*60);