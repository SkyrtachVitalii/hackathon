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
        checkboxPopup,
        monthPrev,
        monthNext,
        dateCalendar,
        saveEvents,
        eventList = [],
        calendar,
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
        checkboxPopup = document.querySelector('#checkbox')
        monthPrev = document.querySelector('#prevMonth')
        monthNext = document.querySelector('#nextMonth')
        dateCalendar = document.querySelector('#dateCalendar')
    }
    // var render = document.getElementById('checkboxEvent');
    // console.log(render);
    
    function addListeners() {
        saveButton.addEventListener('click', editEvent);
        deleteButton.addEventListener('click', deleteEvent)
        addButton.addEventListener('click', addEvent)
        checkboxPopup.addEventListener('change', setTimesShow)
        monthPrev.addEventListener('click', prevMonth)
        monthNext.addEventListener('click', nextMonth)
    }
    function prevMonth() {
        calendar.prev();
        calendarDate();
    }
    function nextMonth() {
        calendar.next();
        calendarDate();
    }
   function setTimesShow(){
       if (checkboxPopup.checked) {
           timeInputStart.style = "display: none";
           timeInputEnd.style = "display: none";
           timeInputStart.value = "";
           timeInputEnd.value = "";
           console.log(checkboxPopup.checked);
       } else {
           timeInputStart.style = "display: initial";
           timeInputEnd.style = "display: initial";
           console.log(checkboxPopup.checked);
       }
    }
    console.log(eventList)
         window.onclick = function (e) {
             if (e.target == zatemnenie) {
                 pop.style.display = "none";
             }
            //  if (e.target == render) {
            //      console.log('es mazafaka');
                 
                 
            //  };
             console.log(e.target);
             
             if (timeInputStart.value > timeInputEnd.value) timeInputEnd.value = timeInputStart.value;
        
    }
    function clearInputs() {
        inputTitle.value = ''
        timeInputStart.value = ''
        timeInputEnd.value = ''
        inputText.value = ''
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

        const inputTextEvent = inputText.value
        inputText.value = ''

        const inputChecked = checkboxPopup.checked
        checkboxPopup.checked = false

        // Create obj for new event
        let eventObj = {
            id: _uuid(),
            name: inputTitleEvent,
            // category: inputValueCategory,
            date: date || '2020-01-01',
            timeStart: inputValueTimeStart,
            timeEnd: inputValueTimeEnd,
            text: inputTextEvent,
            isDone: false,
            isAllday: inputChecked,
        }
        console.log(eventObj);
         addEventToCalendar({
                    id: eventObj.id,
                    title: eventObj.name,
                    start: eventObj.date,
                    extendedProps: true,
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
        addGoogleEvent(eventObj);
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
            // console.log(itemObj);
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
    function fillInput(info) {
        eventList.forEach(itemObj => {
                if (itemObj.id === eventClickId) {
                    // updateGoogleEvent(itemObj);
                    // console.log(itemObj);
                    timeInputStart.value = itemObj.timeStart;
                    timeInputEnd.value = itemObj.timeEnd;
                    inputText.value = itemObj.text;
                    checkboxPopup.checked = itemObj.isAllday;
                    if (itemObj.isAllday) {
                        timeInputStart.style = "display: none"
                        timeInputEnd.style = "display: none"
                    } else {
                        timeInputStart.style = "display: initial"
                        timeInputEnd.style = "display: initial"
                    }
                    
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

        const inputTextEvent = inputText.value
        inputText.value = ''


            calendar.getEventById(eventId).remove()

            eventList.forEach(itemObj => {
                if (itemObj.id === eventId) {
                    // itemObj.name = newEventName
                    itemObj.id = eventClickId;
                    itemObj.name = inputTitleEvent;
                    itemObj.date = date;
                    itemObj.timeStart = inputValueTimeStart;
                    itemObj.timeEnd = inputValueTimeEnd;
                    itemObj.text = inputTextEvent;
                    addEventToCalendar({
                        id: itemObj.id,
                        title: itemObj.name,
                        start: itemObj.date,
                    })
                    
                    updateGoogleEvent(itemObj);
                    console.log(itemObj);
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
        
        removeGoogleEvent(eventClickId);

        pop.style.display = "none"; var close = document.getElementById("closePopup");

        clearInputs();
        }

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
            locale: 'ru',
            contentHeight: 'auto',
            // showNonCurrentDates: false,
            buttonIcons: false, // show the prev/next text
            weekNumbers: false,
            navLinks: false, // can click day/week names to navigate viewsgit
            editable: true,
            dayMaxEvents: true, // allow "more" link when too many events
            events: [],
            fixedWeekCount: false,
            dateClick: function (info) {
                checkboxPopup.checked = false;
                timeInputStart.style = "display: init";
                timeInputEnd.style = "display: init";
                date = info.dateStr;
                addButton.style.display = "block";
                saveButton.style.display = "none";
                deleteButton.style.display = "none";
                pop.style.display = "block";
                var close = document.getElementById("closePopup");
                
                close.onclick = function () {
                    pop.style.display = "none";
                    inputTitle.value = '';
                    timeInputStart.value = '';
                    timeInputEnd.value = '';
                    inputText.value = '';
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
                fillInput(info);
                addButton.style.display = "none";
                saveButton.style.display = "block";
                deleteButton.style.display = "block";
                pop.style.display = "block";
                var close = document.getElementById("closePopup");
                
                close.onclick = function () {
                    pop.style.display = "none";
                    inputTitle.value = '';
                    timeInputStart.value = '';
                    timeInputEnd.value = '';
                    inputText.value = '';
                };
                let dateObj = new Date(info.event.start)
        const uaDate = dateObj.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        })
                document.getElementById('datePopup').innerHTML = uaDate;
                // console.log("clicked event date:" + date);
                
            },
            // eventContent: function (arg) {
            //     let italicEl = document.createElement('i')

            //     if (arg.event.extendedProps.isUrgent) {
            //         italicEl.innerHTML = 'urgent event'
            //     } else {
            //         italicEl.innerHTML = 'normal event'
            //     }
            // }
    
    // eventContent:{ html: '<div class="eventcheckbox"><input id="checkboxEvent" type="checkbox" class="event" name="eventCheckbox">event.title</input><div>' }
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
        var string = capitalizeFirstLetter(uaDate);
        
        
        document.getElementById('dateCalendar').innerHTML = string.slice(0, -3);
        // console.log(string);   
    }
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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