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

        //Render new event category
        if (inputValueEvent != '') {
            renderEvent(inputValueEvent, inputValueCategory)
        }

        //Create new event in array eventList
        eventList.push(inputValueEvent)

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
        eventList.forEach(item => {
            renderEvent(item, null) // null - category
        })
    }

    function renderEvent(inputValueEvent, inputValueCategory) {

        //Add a new event (row)
        let eventRow = document.createElement('tr')
        managePanel.appendChild(eventRow)

        //Add a checkbox cell
        let checkboxCell = document.createElement('td')
        let checkboxElem = document.createElement('input')
        checkboxElem.type = 'checkbox'
        checkboxElem.addEventListener('click', doneEvent)
        checkboxCell.appendChild(checkboxElem)
        eventRow.appendChild(checkboxCell)

        //Add a eventname cell
        let eventNameCell = document.createElement('td')
        let eventName = document.createElement('span')
        eventName.innerText = inputValueEvent
        eventNameCell.appendChild(eventName)
        eventRow.appendChild(eventNameCell)

        //Add a categoryname cell
        let categoryNameCell = document.createElement('td')
        let categoryName = document.createElement('span')
        categoryName.className = 'categoryName'
        categoryName.innerText = inputValueCategory
        categoryNameCell.appendChild(categoryName)
        eventRow.appendChild(categoryNameCell)

        //Add a basket cell
        let basketCell = document.createElement('td')
        let basket = document.createElement('i')
        basket.innerText = 'delete'
        basket.className = 'material-icons'
        basket.addEventListener('click', deleteEvent)
        basketCell.appendChild(basket)
        eventRow.appendChild(basketCell)

        function deleteEvent() {
            eventRow.remove() // Замыкание!!!
            updateFilterOptions()
        }

        function doneEvent() {
            eventRow.classList.toggle('strike')
        }
    }

}