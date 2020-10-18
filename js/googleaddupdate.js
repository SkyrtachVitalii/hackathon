function addGoogleEvent(eventObj) {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        if (!eventObj.timeStart) {
            var event = {
                'summary': eventObj.name,
                'id': eventObj.id,
                'description': eventObj.text,
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
                'description': eventObj.text,
                'start': {
                    'dateTime': eventObj.date + 'T' + eventObj.timeStart + ':00',
                    'timeZone': 'Europe/Kiev',
                },
                'end': {
                    'dateTime': eventObj.date + 'T' + eventObj.timeEnd + ':00',
                    'timeZone': 'Europe/Kiev',
                },
                
            }
        }
        console.log(event);
            
        var request = gapi.client.calendar.events.insert({
            'calendarId': CAL_ID,
            'resource': event
        })
        request.execute()
    }
}
    
function updateGoogleEvent(itemObj) {
    console.log(itemObj);
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        // console.log('updateG: ' + itemObj.name);
       if(!itemObj.time) var event = {
            'summary': itemObj.name,
            // 'id': itemObj.id,
           'description': itemObj.text,
            'start': {
                'date': itemObj.date,
                'timeZone': 'Europe/Kiev',
            },
            'end': {
                'date': itemObj.date,
                'timeZone': 'Europe/Kiev',
           },
            
        }
        else var event = {
                'summary': itemObj.name,
                // 'id': itemObj.id,
                'description': eventObj.text,
                'start': {
                    'dateTime': itemObj.date + 'T' + itemObj.time + ':00',
                    'timeZone': 'Europe/Kiev',
                },
                'end': {
                    'dateTime': itemObj.date + 'T' + itemObj.time + ':00',
                    'timeZone': 'Europe/Kiev',
           },
            }
        var request = gapi.client.calendar.events.update({
            'calendarId': CAL_ID,
            'eventId': itemObj.id,
            'resource': event
        })
        request.execute()
    }
}
function removeGoogleEvent(eventId) {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        var request = gapi.client.calendar.events.delete({
            'calendarId': CAL_ID,
            'eventId': eventId,
        })
        request.execute()
        // console.log('id for delete: ' + this.dataset.id);
    }
}