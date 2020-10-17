'use strict'
todoMain()

function todoMain() {

    let inputTitle,
        inputText,
        selectedDate,
        timeInputStart,
        timeInputEnd,
        deleteButton,
        saveButton,
        addButton,
        date,
        eventClickId,
        saveEvents,
        eventList = [],
        calendar,
        changeBtn,
        closePopupBtn
    var pop = document.getElementById("zatemnenie");

    
    
    // App start
    getElements()
    addListeners()
    initCalendar()
    loadEvents()
    renderAllEvents(eventList)
    calendarDate()
    // updateFilterOptions()

    // function addListeners() {
    //     addBtn.addEventListener('click', addEvent)
    //     sortByDateBtn.addEventListener('click', sortEventListByDate)
    //     selectElem.addEventListener('change', multipleFilter)
    //     shortListBtn.addEventListener('change', multipleFilter)
    //     managePanel.addEventListener('click', managePanelReduct)
    // }
    function getElements() {
        inputTitle = document.querySelector('#inpTitle')
        inputText = document.querySelector('#inpText')
        selectedDate = document.querySelector('#datePopup')
        timeInputStart = document.querySelector('#timeInputStart')
        timeInputEnd = document.querySelector('#timeInputEnd')
        deleteButton = document.querySelector('#popUpDelete')
        saveButton = document.querySelector('#popUpSave')
        addButton = document.querySelector('#popUpAdd')
    }
   
    function addListeners() {
        saveButton.addEventListener('click', editEvent);
        deleteButton.addEventListener('click', deleteEvent)
        addButton.addEventListener('click',addEvent)
    }
    console.log(eventList)
         window.onclick = function (e) {
        if(e.target == zatemnenie){pop.style.display = "none";
       } console.log(e.target)
        
    }

    function addEvent() {

        //Get event name
        const inputTitleEvent = inputTitle.value
        inputTitle.value = ''

        //Get event category
        // const inputValueCategory = inputElemCategory.value
        // inputElemCategory.value = ''

        //Get date
        // const inputValueDate = dateInput.value
        // dateInput.value = ''

        //Get time
        const inputValueTimeStart = timeInputStart.value
        timeInputStart.value = ''
        const inputValueTimeEnd = timeInputEnd.value
        timeInputEnd.value = ''

        // Create obj for new event
        let eventObj = {
            id: _uuid(),
            name: inputTitleEvent,
            // category: inputValueCategory,
            date: date || '2020-01-01',
            timeStart: inputValueTimeStart,
            timeEnd: inputValueTimeEnd,
            isDone: false,
        }
        console.log(eventObj);
         addEventToCalendar({
                    id: eventObj.id,
                    title: eventObj.name,
                    start: eventObj.date,
                })

        //Render new event category

        // renderEvent(eventObj)
        


        //Add new event in array eventList
        eventList.push(eventObj)

        //Save event to LocalStorage
        saveEvent()

        //Update filter options
        // updateFilterOptions()
pop.style.display = "none"; var close = document.getElementById("closePopup");
        
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
            console.log(itemObj);
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

        //Add event to calendar
        addEventToCalendar({
            id: id,
            title: name,
            start: date,
        })

        

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
    function fillInput() {
        eventList.forEach(itemObj => {
                if (itemObj.id === eventClickId) {
                    // updateGoogleEvent(itemObj);
                    // console.log(itemObj);
                    timeInputStart.value = itemObj.timeStart;
                    timeInputEnd.value = itemObj.timeEnd;
                    console.log(itemObj.timeStart);
                }
        })
        
        
    
}
    function editEvent(event) {
        const eventId = eventClickId;
        //Get event name
        const inputTitleEvent = inputTitle.value
        inputTitle.value = ''

        //Get event category
        // const inputValueCategory = inputElemCategory.value
        // inputElemCategory.value = ''

        //Get date
        // const inputValueDate = dateInput.value
        // dateInput.value = ''

        //Get time
        const inputValueTimeStart = timeInputStart.value
        timeInputStart.value = ''
        const inputValueTimeEnd = timeInputEnd.value
        timeInputEnd.value = ''


            calendar.getEventById(eventId).remove()

            eventList.forEach(itemObj => {
                if (itemObj.id === eventId) {
                    // itemObj.name = newEventName
                    itemObj.id = eventClickId;
                    itemObj.name = inputTitleEvent;
                    itemObj.date = date;
                    itemObj.timeStart = inputValueTimeStart;
                    itemObj.timeEnd = inputValueTimeEnd;
                    addEventToCalendar({
                        id: itemObj.id,
                        title: itemObj.name,
                        start: itemObj.date,
                    })
                    updateGoogleEvent(itemObj);
                    // console.log(itemObj);
                }
            })

            saveEvent()
            clearEvents()
        renderAllEvents(eventList)
        pop.style.display = "none"; var close = document.getElementById("closePopup");
        }
    function deleteEvent() {

            for (let i = 0; i < eventList.length; i++) {
                if (eventList[i].id == eventClickId) {
                    eventList.splice(i, 1)
                }
            }

            saveEvent()

            // Fullcalendar
            calendar.getEventById(eventClickId).remove()

            // Event delete for google calendar
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                var request = gapi.client.calendar.events.delete({
                    'calendarId': CAL_ID,
                    'eventId': this.dataset.id,
                })
                request.execute()
                // console.log('id for delete: ' + this.dataset.id);
        }
        pop.style.display = "none"; var close = document.getElementById("closePopup");
        }
    // let dateObj = new Date(date)
    // const uaDate = dateObj.toLocaleString('uk-UA', {
    //     day: 'numeric',
    //     month: 'long',
    //     year: 'numeric',
    // })

    // // Add event to calendar
    // addEventToCalendar({
    //     id: id,
    //     title: name,
    //     start: date,
    // })

    // function doneEvent() {
    //     eventRow.classList.toggle('strike')
    //     for (let item of eventList) {
    //         if (item.id == this.dataset.id) {
    //             item.isDone = !item.isDone
    //         }
    //     }

    //     saveEvent()
    // }

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

    // function sortEventListByDate() {
    //     eventList.sort((a, b) => {
    //         const aDate = Date.parse(a.date)
    //         const bDate = Date.parse(b.date)
    //         return aDate - bDate
    //     })

    //     saveEvent()
    //     clearEvents()
    //     renderAllEvents(eventList)
    //     updateFilterOptions()
    // }
    

   
    function initCalendar() {
        var calendarEl = document.getElementById('calendar');
        
        calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: false,
            dayHeaderFormat :{ weekday: 'long'},
            locale: 'uk',
            contentHeight: 'auto',
            buttonIcons: false, // show the prev/next text
            weekNumbers: false,
            navLinks: false, // can click day/week names to navigate viewsgit
            editable: true,
            dayMaxEvents: true, // allow "more" link when too many events
            events: [],
            dateClick: function (info) {
                date = info.dateStr;
                addButton.style.display = "block";
                saveButton.style.display = "none";
                deleteButton.style.display = "none";
                pop.style.display = "block"; var close = document.getElementById("closePopup");
                close.onclick = function () {
                    pop.style.display = "none";
                    inputTitle.value = '';
                    timeInputStart.value = '';
                    timeInputEnd.value = '';
                };
                console.log(close);
                let dateObj = new Date(info.date)
        const uaDate = dateObj.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        })
                document.getElementById('datePopup').innerHTML = uaDate;
            },
            eventClick: function (info) {
                date = info.event.startStr;
                inputTitle.value = info.event.title;
                eventClickId = info.event.id;
                fillInput();
                addButton.style.display = "none";
                saveButton.style.display = "block";
                deleteButton.style.display = "block";
                pop.style.display = "block"; var close = document.getElementById("closePopup");
                close.onclick = function () {
                    pop.style.display = "none";
                    inputTitle.value = '';
                    timeInputStart.value = '';
                    timeInputEnd.value = '';
                };
                let dateObj = new Date(info.event.start)
        const uaDate = dateObj.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        })
                document.getElementById('datePopup').innerHTML = uaDate;
                console.log("clicked event date:" + date);
                
            }


            //код - Віталій Скиртач
            //editable: true,
            //eventDrop: function (info){
            //    calendarEventDragged(info.event);
            //}
        });

        calendar.render();
        
        // console.log(calendar.getDate());

    }
    function calendarDate(date) {
        let dateObj = new Date(calendar.getDate())
        const uaDate = dateObj.toLocaleString('ru-RU', {
            // day: 'numeric',
            month: 'long',
            year: 'numeric',
            // weekday: 'long',
        })
        document.getElementById('dateCalendar').innerHTML = uaDate;
        console.log(uaDate);   
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
    // saveEvent()
    // clearEvents()
    // renderAllEvents(eventList)
    // updateFilterOptions()
        
    

    


    // window.addEventListener('load', () => {
    //     changeBtn = document.querySelector('#changeBtn')
    //     closePopupBtn = document.querySelector('.showPopup-popupClose')
    //     closePopupBtn.classList.add('updatePopup')
    //     changeBtn.addEventListener('click', commitEdit)
    // })

    function commitEdit(event) {

        let id = event.target.dataset.id

        let nameObj = document.querySelector('#editName').value
        let category = document.querySelector('#editCategory').value
        let dateObj = document.querySelector('#editDate').value
        console.log("commitEdit -> dateObj", dateObj)
        let time = document.querySelector('#editTime').value

        calendar.getEventById(id).remove()

        eventList.forEach(itemObj => {
            if (itemObj.id == id) {

                itemObj.id = id
                itemObj.name = nameObj
                itemObj.category = category
                itemObj.time = time
                itemObj.date = dateObj

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

        

        console.log(eventList)
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