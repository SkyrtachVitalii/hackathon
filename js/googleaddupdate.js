function updateGoogleEvent(itemObj) {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        // console.log('updateG: ' + itemObj.name);
       if(!itemObj.time) var event = {
            'summary': itemObj.name,
            // 'id': itemObj.id,
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