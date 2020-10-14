'use strict'
todoMain()

function todoMain() {

    let inputElemEvent
    let inputElemCategory
    let addButton
    let managePanel
    let selectElem
    let eventList = []


    // App start
    getElements()
    addListeners()
    loadEvents()
    renderAllEvents()
    updateFilterOptions()

    function getElements() {
        inputElemEvent = document.querySelector('#inpEvent')
        inputElemCategory = document.querySelector('#inpCategory')
        addButton = document.querySelector('#addBtn')
        managePanel = document.querySelector('#eventManagePanel')
        selectElem = document.querySelector('#categoryFilter')
    }

    function addListeners() {
        addButton.addEventListener('click', addEvent)
        selectElem.addEventListener('change', filterEvents)
    }

    function addEvent() {

        //Get event name
        const inputValueEvent = inputElemEvent.value
        inputElemEvent.value = ''

        //Get event category
        const inputValueCategory = inputElemCategory.value
        inputElemCategory.value = ''

        // Create obj for new event
        let eventObj = {
            id: eventList.length,
            name: inputValueEvent,
            category: inputValueCategory,
            isDone: false,
        }

        //Render new event category
        if (inputValueEvent != '') { //Запрещаем пустое событие
            renderEvent(eventObj)
        }

        //Add new event in array eventList
        eventList.push(eventObj)

        //Save event to LocalStorage
        saveEvent()

        //Update filter options
        updateFilterOptions()
    }

    function filterEvents() {
        const events = Array.from(document.querySelectorAll('table>tr'))
        events.forEach((item) => {
            const category = item.querySelector('.categoryName')
            if (selectElem.value === 'Всі категорії') {
                item.style.display = ''
            } else {
                if (category.innerText !== selectElem.value) {
                    item.style.display = 'none'
                } else {
                    item.style.display = ''
                }
            }
        })
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

    function renderAllEvents() {
        eventList.forEach(itemObj => {
            renderEvent(itemObj) //Деструктуризация
        })
    }

    function renderEvent({
        id,
        name,
        category,
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

        //Add a eventname cell
        let eventNameCell = document.createElement('td')
        let eventName = document.createElement('span')
        eventName.innerText = name
        eventNameCell.appendChild(eventName)
        eventRow.appendChild(eventNameCell)

        //Add a categoryname cell
        let categoryNameCell = document.createElement('td')
        let categoryName = document.createElement('span')
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

        function deleteEvent() {
            eventRow.remove() // Замыкание!!!
            updateFilterOptions()

            for (let i = 0; i < eventList.length; i++) {
                if (eventList[i].id == this.dataset.id) {
                    eventList.splice(i, 1)
                }
            }

            saveEvent()
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

}