'use strict'
todoMain()

function todoMain() {

    let inputElemEvent,
        inputElemCategory,
        dateInput,
        timeInput,
        addBtn,
        sortByDateBtn,
        managePanel,
        selectElem,
        eventList = [],
        calendar,
        shortListBtn


    // App start
    getElements()
    addListeners()
    initCalendar()
    loadEvents()
    renderAllEvents(eventList)
    updateFilterOptions()

    function getElements() {
        inputElemEvent = document.querySelector('#inpEvent')
        inputElemCategory = document.querySelector('#inpCategory')
        dateInput = document.querySelector('#dateInput')
        timeInput = document.querySelector('#timeInput')
        addBtn = document.querySelector('#addBtn')
        sortByDateBtn = document.querySelector('#sortByDateBtn')
        managePanel = document.querySelector('#eventManagePanel')
        selectElem = document.querySelector('#categoryFilter')
        shortListBtn = document.querySelector('#shortListBtn')
    }

    function addListeners() {
        addBtn.addEventListener('click', addEvent)
        sortByDateBtn.addEventListener('click', sortEventListByDate)
        selectElem.addEventListener('change', multipleFilter)
        shortListBtn.addEventListener('change', multipleFilter)
        managePanel.addEventListener('click', managePanelReduct)
    }

    function addEvent() {

        //Get event name
        const inputValueEvent = inputElemEvent.value
        inputElemEvent.value = ''

        //Get event category
        const inputValueCategory = inputElemCategory.value
        inputElemCategory.value = ''

        //Get date
        const inputValueDate = dateInput.value
        dateInput.value = ''

        //Get time
        const inputValueTime = timeInput.value
        timeInput.value = ''

        // Create obj for new event
        let eventObj = {
            id: _uuid(),
            name: inputValueEvent,
            category: inputValueCategory,
            date: inputValueDate,
            time: inputValueTime,
            isDone: false,
        }

        //Event add for google calendar
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            if (!eventObj.time) {
                var event = {
                    'summary': eventObj.name,
                    'id': eventObj.id,
                    'start': {
                        'date': eventObj.date,
                        'timeZone': 'Europe/Kiev',
                    },
                    'end': {
                        'date': eventObj.date,  
                        'timeZone': 'Europe/Kiev',
                    },
                }
            }
         else {
            var event = {
                'summary': eventObj.name,
                'id': eventObj.id,
                'start': {
                    'dateTime': eventObj.date + 'T' + eventObj.time + ':00',
                    'timeZone': 'Europe/Kiev',
                },
                'end': {
                    'dateTime': eventObj.date + 'T' + eventObj.time + ':00',
                    'timeZone': 'Europe/Kiev',
                },
            }
        }
    // console.log(event);
            
            var request = gapi.client.calendar.events.insert({
                'calendarId': CAL_ID,
                'resource': event
            })
            request.execute()
            // console.log('event pushed for gCal ' + event.id);
        }
        //-------------------------------------------------------------------


        //Render new event category
        if (inputValueEvent != '' && inputValueDate != '' && inputValueCategory != '' && inputValueTime != '') { //Запрещаем пустое событие
            renderEvent(eventObj)
        }

        //Add new event in array eventList
        eventList.push(eventObj)

        //Save event to LocalStorage
        saveEvent()

        //Update filter options
        updateFilterOptions()
    }

    function updateFilterOptions() {
        let filters = ['Всі категорії'] //by default

        const events = Array.from(document.querySelectorAll('table>tr'))

        events.forEach((item) => {
            const category = item.querySelector('.categoryName').innerText
            filters.push(category)
        })

        let filterSet = new Set(filters)

        selectElem.innerHTML = ''

        for (let item of filterSet) {
            let customFilterElem = document.createElement('option')
            customFilterElem.value = item
            customFilterElem.innerText = item
            selectElem.appendChild(customFilterElem)
        }

    }

    function saveEvent() {
        const stringified = JSON.stringify(eventList)
        localStorage.setItem('eventList', stringified)
    }

    function loadEvents() {
        let eventData = localStorage.getItem('eventList')
        eventList = JSON.parse(eventData)
        if (eventList === null) {
            eventList = []
        }
    }

    function renderAllEvents(arr) {
        arr.forEach(itemObj => {
            renderEvent(itemObj) //Деструктуризация
        })
    }

    function renderEvent({
        id,
        name,
        category,
        date,
        time,
        isDone,
    }) { //Деструктуризация

        //Add a new event (row)
        let eventRow = document.createElement('tr')
        managePanel.appendChild(eventRow)

        //Add a checkbox cell
        let checkboxCell = document.createElement('td')
        let checkboxElem = document.createElement('input')
        checkboxElem.type = 'checkbox'
        checkboxElem.addEventListener('click', doneEvent)
        checkboxElem.dataset.id = id
        if (isDone) {
            eventRow.classList.add('strike')
            checkboxElem.checked = true
        } else {
            eventRow.classList.remove('strike')
            checkboxElem.checked = false
        }
        checkboxCell.appendChild(checkboxElem)
        eventRow.appendChild(checkboxCell)

        //Add a date cell
        let eventDateCell = document.createElement('td')

        let eventDate = document.createElement('span')
        eventDate.dataset.editable = true
        eventDate.dataset.type = 'date'
        eventDate.dataset.value = date
        eventDate.dataset.id = id

        let dateObj = new Date(date)
        const uaDate = dateObj.toLocaleString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })

        eventDate.innerText = uaDate
        eventDateCell.appendChild(eventDate)
        eventRow.appendChild(eventDateCell)

        //Add a time cell
        let eventTimeCell = document.createElement('td')

        let eventTime = document.createElement('span')
        eventTime.dataset.editable = true
        eventTime.dataset.type = 'time'
        eventTime.dataset.id = id

        eventTime.innerText = time
        eventTimeCell.appendChild(eventTime)
        eventRow.appendChild(eventTimeCell)


        //Add a eventname cell
        let eventNameCell = document.createElement('td')

        let eventName = document.createElement('span')
        eventName.dataset.editable = true
        eventName.dataset.type = 'name'
        eventName.dataset.id = id

        eventName.innerText = name
        eventNameCell.appendChild(eventName)
        eventRow.appendChild(eventNameCell)

        //Add a categoryname cell
        let categoryNameCell = document.createElement('td')

        let categoryName = document.createElement('span')
        categoryName.dataset.editable = true
        categoryName.dataset.type = 'category'
        categoryName.dataset.id = id

        categoryName.className = 'categoryName'
        categoryName.innerText = category
        categoryNameCell.appendChild(categoryName)
        eventRow.appendChild(categoryNameCell)

        //Add a basket cell
        let basketCell = document.createElement('td')
        let basket = document.createElement('i')
        basket.dataset.id = id
        basket.innerText = 'delete'
        basket.className = 'material-icons'
        basket.addEventListener('click', deleteEvent)
        basketCell.appendChild(basket)
        eventRow.appendChild(basketCell)

        //Add event to calendar
        addEventToCalendar({
            id: id,
            title: name,
            start: date,
        })

        function deleteEvent() {
            eventRow.remove() // Замыкание!!!
            updateFilterOptions()

            for (let i = 0; i < eventList.length; i++) {
                if (eventList[i].id == this.dataset.id) {
                    eventList.splice(i, 1)
                }

                // Event delete for google calendar
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    var request = gapi.client.calendar.events.delete({
                        'calendarId': CAL_ID,
                        'eventId': this.dataset.id,
                    })
                    request.execute()
                    // console.log('id for delete: ' + this.dataset.id);
                }
            }

            saveEvent()

            // Fullcalendar
            calendar.getEventById(this.dataset.id).remove()
        }

        function doneEvent() {
            eventRow.classList.toggle('strike')
            for (let item of eventList) {
                if (item.id == this.dataset.id) {
                    item.isDone = !item.isDone
                }
            }

            saveEvent()
        }

    }

    function _uuid() {
        var d = Date.now()
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now() // use high precision timer if available
        }
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
    }
    // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx

    function sortEventListByDate() {
        eventList.sort((a, b) => {
            const aDate = Date.parse(a.date)
            const bDate = Date.parse(b.date)
            return aDate - bDate
        })

        saveEvent()
        clearEvents()
        renderAllEvents(eventList)
        updateFilterOptions()
    }

    function initCalendar() {
        var calendarEl = document.getElementById('calendar');

        calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            locale: 'uk',
            buttonIcons: false, // show the prev/next text
            weekNumbers: true,
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            dayMaxEvents: true, // allow "more" link when too many events
            events: [],


            //код - Віталій Скиртач
            //editable: true,
            //eventDrop: function (info){
            //    calendarEventDragged(info.event);
            //}
        });

        calendar.render();

    }

    function addEventToCalendar(event) {
        calendar.addEvent(event)
    }

    function clearEvents() {
        const events = Array.from(document.querySelectorAll('table>tr'))

        for (let item of events) {
            item.remove()
        }

        // Fullcalendar
        calendar.getEvents().forEach(event => event.remove())
    }

    function multipleFilter() {
        clearEvents()

        if (selectElem.value === 'Всі категорії') {
            if (shortListBtn.checked) {
                let filteredIncompleteArr = eventList.filter(obj => obj.isDone === false)
                renderAllEvents(filteredIncompleteArr)
                let filteredCompleteArr = eventList.filter(obj => obj.isDone === true)
                renderAllEvents(filteredCompleteArr)
            } else {
                renderAllEvents(eventList)
            }
        } else {
            let filteredCategoryArr = eventList.filter(obj => obj.category === selectElem.value)

            if (shortListBtn.checked) {
                let filteredIncompleteArr = filteredCategoryArr.filter(obj => obj.isDone === false)
                console.log("multipleFilter -> filteredIncompleteArr", filteredIncompleteArr)

                if (filteredIncompleteArr.length == 0) {
                    let eventRow = document.createElement('tr')
                    managePanel.appendChild(eventRow)
                    let eventMessageCell = document.createElement('td')
                    eventMessageCell.setAttribute('colspan', '6')
                    let eventMessage = document.createElement('span')
                    eventMessage.innerText = 'У Вас немає актуальних подій за обраною категорією'
                    eventMessageCell.appendChild(eventMessage)
                    eventRow.appendChild(eventMessageCell)
                } else {
                    renderAllEvents(filteredIncompleteArr)
                }

                let filteredCompleteArr = filteredCategoryArr.filter(obj => obj.isDone === true)
                renderAllEvents(filteredCompleteArr)

            } else {
                renderAllEvents(filteredCategoryArr)
            }
        }

    }

    function managePanelReduct(event) {
        if (event.target.matches('span') && event.target.dataset.editable == 'true') {
            let tempInputElem
            switch (event.target.dataset.type) {
                case 'date':
                    tempInputElem = document.createElement('input')
                    tempInputElem.type = 'date'
                    tempInputElem.value = event.target.dataset.value
                    break
                case 'time':
                    tempInputElem = document.createElement('input')
                    tempInputElem.type = 'time'
                    tempInputElem.value = event.target.innerText
                    break
                case 'name':
                    tempInputElem = document.createElement('input')
                    tempInputElem.type = 'text'
                    tempInputElem.value = event.target.innerText
                    break
                case 'category':
                    tempInputElem = document.createElement('input')
                    tempInputElem.type = 'text'
                    tempInputElem.value = event.target.innerText
                    break
            }
            tempInputElem.addEventListener('change', addNewEventData)
            event.target.innerText = ''
            event.target.appendChild(tempInputElem)
        }

        function addNewEventData(event) {
            const newEventData = event.target.value
            const eventId = event.target.parentNode.dataset.id

            calendar.getEventById(eventId).remove()

            eventList.forEach(itemObj => {
                if (itemObj.id === eventId) {
                    // itemObj.name = newEventName
                    itemObj[event.target.parentNode.dataset.type] = newEventData
                    addEventToCalendar({
                        id: itemObj.id,
                        title: itemObj.name,
                        start: itemObj.date,
                    })
                }
            })

            saveEvent()
            clearEvents()
            renderAllEvents(eventList)
            updateFilterOptions()
        }
    }


    //код - Скиртач Віталій урок 20
    /*
    function calendarEventDragged(event){
        let id = event.id;
        let dateObj = new Date(event.start);
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth();
        let date = dateObj.getDate();

        let paddedMonth = month.toString();
        if (paddedMonth.length < 2){
            paddedMonth = "0" + paddedMonth;
        }

        let paddedDate = date.toString();
        if (paddedDate.length < 2){
            paddedDate = "0" + paddedDate;
        }
    
        let toStoreDate = `${year}-${paddedMonth}-${paddedDate}`;
        console.log(toStoreDate);

        todoList.forEach(todoObj => {
            if(todoObj.id == id){
                todoObj.date = toStoreDate;
            }
        });
        
        save();
        multipleFilter();

    }*/
}
