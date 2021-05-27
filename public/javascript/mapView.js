// TODO: Implement setting variance
let map, POIs

/*const HIDE = true, REFRESH = true*/
$(document).ready(() => {
    // TODO: NOT IN MVP
    // Display a component that covers the whole page
    // and a button allows user to refresh the page
    $('#mapLoader').show()
    navigator.geolocation.getCurrentPosition((position) => {
        userCoordinates = position.coords
        // Mapbox API token
        const accessToken = 'pk.eyJ1IjoiZXJpY2thbyIsImEiOiJja25qMzhldmgwYThwMm5tZjh2bjBsdmQxIn0.3z4PTxSU8z0A_ggSYH3FCQ'
        map = new Mapbox(accessToken)
        map.showMap()

        map.loadCustomImage('../assets/pin.png', 'pin')
        map.loadCustomImage('../assets/pin_favorite.png', 'pin-favourite')
        // Center map to user location
        // navigator.geolocation.getCurrentPosition((position) => map.setCenter([position.coords.longitude, position.coords.latitude]))

        // Activate geolocate function
        map.activateGeolocateControl()

        // Implement function required
        map.generateLinkHTML = (e) => {
            title = e.features[0].properties.title
            coordinates = e.features[0].geometry.coordinates
            bays = e.features[0].properties.bays
            id = e.features[0].properties.id

            let html = ''
            html += '<b>' + title + '</b>'
            html += '<div>'
            html += Utility.getDistance(userCoordinates.latitude, userCoordinates.longitude, coordinates[1], coordinates[0]) + '<br>'
            html += bays + '<br>'
            html += '<a href="https://www.google.com/maps/dir/?api=1&destination=' + coordinates[1] + ',' + coordinates[0] + '&travelmode=driving" target="_blank">Navi to here</a>'
            // TODO: Change style
            html += '<a href="#" style="float:right" id=' + id + ' onclick="updateFav(this)">Fav</a>'
            html += '</div>'
            return html
        }
        refreshPOIs()
        /*
        if (REFRESH) {
            setInterval(() => {
                refreshPOIs()
            }, 60000)
        }*/
    }, () => {
        M.toast({ html: 'Failed to get user location, please allow location access!' })
    }, {
        enableHighAccuracy: true
    })
})

const updateFav = (originate) => {
    const id = $(originate).attr('id')
    const POI = POIs.find(POI => POI.properties.id == id)

    let favIDs = Utility.getItemFromLocalStorage('favIDs')
    if (!favIDs) favIDs = []

    const index = favIDs.indexOf(POI.properties.id)
    if (index == -1) {
        POI.properties.icon = 'pin-favourite'
        favIDs.push(POI.properties.id)
    }
    else {
        POI.properties.icon = 'pin'
        favIDs.splice(index, 1)
    }

    Utility.setItemToLocalStorage('favIDs', favIDs)
    map.updatePOIs(POIs)
}

/**
 * @summary RefreshPOIs in map
 * @todo Request parameter should includes current position
 * The server should only return parking bays around the user
 */
const refreshPOIs = () => {
    $('#mapLoader').show()
    $.post(DATA_URL, { /*hideUnavailable: HIDE*/ }, (data) => {
        if (!data.success) {
            // Cannot retrieve locations
            M.toast({ html: 'Location server under maintenance, please come back later!' })
            return
        }
        if (data.locations.length == 0) {
            // TODO: Add notification - no available locations
            return
        }
        // Hide the loader
        $('#mapLoader').hide()

        $('.mapboxgl-popup-close-button').trigger('click')
        // Convert data into POIs
        createPOIs(data.locations)

        // Get favourite location IDs from local storage
        let favIDs = Utility.getItemFromLocalStorage('favIDs')
        if (favIDs) {
            favIDs.forEach(id => {
                const POI = POIs.find(POI => POI.properties.id == id)
                if (POI) POI.properties.icon = 'pin-favourite'
            })
        }
        map.updatePOIs(POIs)
    })
}

/**
 * @summary Convert location data into POI data
 * @param {JSON} locations location data
 */
const createPOIs = (locations) => {
    POIs = []
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
                'bays': location.baysAvailable + '/' + location.bays + ' spots',
                'icon': 'pin',
                'id': location.id
            }
        }
        POIs.push(POI)
    })
}

$('#btnMapRefresh').on('click',function(){
    refreshPOIs()
})