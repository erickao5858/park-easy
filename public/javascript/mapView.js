// TODO: Implement setting variance

let map

$(document).ready(() => {
    // TODO: NOT IN MVP
    // Display a component that covers the whole page
    // and a button allows user to refresh the page
    navigator.geolocation.getCurrentPosition((position) => {
        userCoordinates = position.coords
    }, () => {
        M.toast({ html: 'Failed to get user location, please allow location access!' })
        $('#map').remove()
    }, {
        enableHighAccuracy: true
    })
    // Mapbox API token
    const accessToken = 'pk.eyJ1IjoiZXJpY2thbyIsImEiOiJja25qMzhldmgwYThwMm5tZjh2bjBsdmQxIn0.3z4PTxSU8z0A_ggSYH3FCQ'
    map = new Mapbox(accessToken)
    map.showMap()

    // Center map to user location
    // navigator.geolocation.getCurrentPosition((position) => map.setCenter([position.coords.longitude, position.coords.latitude]))

    // Activate geolocate function
    map.activateGeolocateControl()

    // Implement function required
    map.generateLinkHTML = (e) => {
        title = e.features[0].properties.title
        coordinates = e.features[0].geometry.coordinates
        bays = e.features[0].properties.bays

        // TODO: NOT IN MVP
        // Use jquery to formulate html
        const wrapper = $('<div/>')
        const header = $('<b/>').text(title)
        const distance = Utility.getDistance(userCoordinates.latitude, userCoordinates.longitude, coordinates[1], coordinates[0])
        wrapper.append(header)
        const content = $('<div/>')
        wrapper.append(content)
        content.append(distance)
        content.append($('<br/>'))
        content.append('10/15 spots')
        content.append($('<br/>'))
        const link = $('<a/>').text('Navi to here')
        .attr('href', 'https://www.google.com/maps/dir/?api=1&destination='+coordinates[1] + ',' + coordinates[0] + '&travelmode=driving')
        .attr('target','_blank')
        content.append(link)
        return wrapper.html()

    }

    // Wait for map
    let timer = setInterval(() => {
        if (map.isCustomImageLoaded) {
            clearInterval(timer)
            refreshPOIs()
        }
    }, 100)
})

/**
 * @summary RefreshPOIs in map
 * @todo Request parameter should includes current position
 * The server should only return parking bays around the user
 */
const refreshPOIs = () => {
    $.get(DATA_URL, (data) => {
        if (!data.success) {
            // Cannot retrieve locations
            M.toast({ html: 'Location server under maintenance, please come back later!' })
            return
        }
        // Convert data into POIs
        const POIs = createPOIs(data.locations)

        // Remove existing POIs and append new POIs
        map.removePOIs()
        map.appendPOIs(POIs)
    })
}

/**
 * @summary Convert location data into POI data
 * @param {JSON} locations location data
 * @returns POIs readable by Mapbox API
 * @example locations: [{
    "bays": 10,
    "baysAvailable": 10,
    "coordinates": [145.109342, -37.848027],
    "title": "Elgar Rd/Burwood Hwy"
  }, {
    "bays": 8,
    "baysAvailable": 8,
    "coordinates": [145.120227, -37.849891],
    "title": "Station St/Burwood Hwy"
  }]
 */
const createPOIs = (locations) => {
    let POIs = []
    locations.forEach(location => {
        let POI = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': location.coordinates
            },
            'properties': {
                'title': location.title,
                'description': location.description,
                'bays': location.baysAvailable + '/' + location.bays + ' spots'
            }
        }
        POIs.push(POI)
    })
    return POIs
}