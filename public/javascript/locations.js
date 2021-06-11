let map, POIs, locations
let mapMode = true

$(document).ready(() => {
    $('.brand-logo').text('Locations')
    appendBtns()

    // Show the preloader
    $('.preloader').show()
    navigator.geolocation.getCurrentPosition((position) => {
        userCoordinates = position.coords
        // Mapbox API token
        const accessToken = 'pk.eyJ1IjoiZXJpY2thbyIsImEiOiJja25qMzhldmgwYThwMm5tZjh2bjBsdmQxIn0.3z4PTxSU8z0A_ggSYH3FCQ'
        map = new Mapbox(accessToken)
        if (typeof userSettings != 'undefined' && userSettings['Dark mode']) {
            map.showMap('dark-v10')
        } else {
            map.showMap('streets-v11')
        }
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
            let url = 'https://www.google.com/maps/dir/?api=1&destination=' + coordinates[1] + ',' + coordinates[0] + '&travelmode=driving'
            html += '<a onclick="openLink(this)" targetURL=' + url + ' targetID=' + id + '  target="_blank"><i class="fas fa-route"></i></a>'
            iconClass = e.features[0].properties.icon == 'pin' ? 'far fa-heart' : 'fas fa-heart'
            html += '<a href="#" style="float:right"><i class="' + iconClass + '" targetID=' + id + ' onclick="updateFav(this)"></i></a>'
            html += '</div>'
            return html
        }
        refreshLocations()
        if (typeof userSettings != 'undefined' && userSettings['Refresh locations every minute']) {
            setInterval(() => {
                refreshLocations()
            }, 60000)
        }
    }, () => {
        M.toast({
            html: 'Failed to get user location, please allow location access!',
            completeCallback: () => {
                $('#NoGPSModal').modal('open')
            }
        })
    }, {
        enableHighAccuracy: true
    })

    window.onfocus = () => {
        const lastOpenLocation = Utility.getItemFromLocalStorage('lastOpenLocation')
        if (!lastOpenLocation) {
            return
        }
        $.post(DATA_URL, {}, (data) => {
            if (!data.success) {
                M.toast({ html: 'Location server under maintence, please come back later!' })
                return
            }
            if (data.locations.length == 0) {
                return
            }
            let location = data.locations.find((location) => location.id == lastOpenLocation)
            if (!location) {
                return
            }
            if (location.baysAvailable == 0) {
                M.toast({ html: 'Last opened location no longer available' })
                // TODO: Remove window & refresh the locations
            }
            Utility.removeItemFromLocalStorage('lastOpenLocation')
        })
    }
})

/**
 * @summary Refresh locations
 * @todo Request parameter should includes current position
 * The server should only return parking bays around the user
 */
const refreshLocations = () => {
    $('.mapboxgl-popup-close-button').trigger('click')
    $('.preloader').show()
    $.post(DATA_URL, { hideUnavailable: typeof userSettings != 'undefined' && userSettings['Hide unavailable locations'] }, (data) => {
        if (!data.success) {
            // Cannot retrieve locations
            M.toast({ html: 'Location server under maintenance, please come back later!' })
            return
        }
        if (data.locations.length == 0) {
            // TODO: Add notification - no available locations
            return
        }
        // Hide the preloader
        $('.preloader').hide()

        locations = data.locations

        // Convert data into POIs
        createPOIs()

        // Get favourite location IDs from local storage
        let favIDs = Utility.getItemFromLocalStorage('favIDs')
        if (favIDs) {
            favIDs.forEach(id => {
                const POI = POIs.find(POI => POI.properties.id == id)
                if (POI) POI.properties.icon = 'pin-favourite'
                const location = locations.find(location => location.id == id)
                if (location) location.isFavourite = true
            })
        }
        map.updatePOIs(POIs)

        locations.forEach((location) => {
            location.distance = Utility.getDistance(userCoordinates.latitude, userCoordinates.longitude, location.coordinates[1], location.coordinates[0])
            if (!location.isFavourite) location.isFavourite = false
        })
        // Sort locations by distance and favourite then display them
        sortLocations()
        showLocations()
    })
}

/**
 * @summary Convert location data into POI data
 */
const createPOIs = () => {
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

const appendBtns = () => {
    const btnRefresh = $('<div/>')
    btnRefresh.attr('id', 'btnRefresh')
    $('#btnMenu').after(btnRefresh)
    btnRefresh.append('<a class="btn-floating btn-large waves-effect waves-light blue"><i class="fas fa-redo"></i></a>')
    btnRefresh.on('click', function () {
        refreshLocations()
    })

    const btnSwitch = $('<div/>')
    btnSwitch.attr('id', 'btnSwitch')
    $('#btnRefresh').after(btnSwitch)
    btnSwitch.append('<a class="btn-floating btn-large waves-effect waves-light green"><i class="fas fa-list-ul"></i></a>')
    btnSwitch.on('click', function () {
        if (mapMode) {
            $('.mapboxgl-popup-close-button').trigger('click')
            $('#map').hide()
            $('.collection').show()
            $('#btnSwitch').find('i').attr('class', 'fas fa-map-marked-alt')
            mapMode = false
        }
        else {
            $('#map').show()
            $('.collection').hide()
            $('#btnSwitch').find('i').attr('class', 'fas fa-list-ul')
            mapMode = true
        }
    })
}

const showLocations = () => {
    $('.collection').html('')
    locations.forEach(location => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('img').click((obj) => {
            $('#ThumbnailModal').find('img').attr('src', obj.target.currentSrc).css('width', '100%')
            $('#ThumbnailModal').modal('open')
        })
        element.find('span').html(location.title)
        const favBtn = $('<i/>')
        favBtn.attr('class', location.isFavourite == true ? 'fas fa-heart' : 'far fa-heart')
        favBtn.attr('targetID', location.id)
        favBtn.on('click', (event) => { updateFav(event.target) })
        element.find('span').append(favBtn)
        element.find('p').html(
            location.baysAvailable + '/' + location.bays + ' spots' +
            '<br>' +
            Utility.getDistance(userCoordinates.latitude, userCoordinates.longitude, location.coordinates[1], location.coordinates[0])
        )
        element.find('a').attr('href', 'https://www.google.com/maps/dir/?api=1&destination=' + location.coordinates[1] + ',' + location.coordinates[0] + '&travelmode=driving')
    })
}

const openLink = (originate) => {
    let url = $(originate).attr('targetURL')
    let lastOpenLocation = $(originate).attr('targetID')
    Utility.setItemToLocalStorage('lastOpenLocation', lastOpenLocation);
    window.open(url, "_blank")
}

const updateFav = (originate) => {
    const id = $(originate).attr('targetID')
    const POI = POIs.find(POI => POI.properties.id == id)

    let favIDs = Utility.getItemFromLocalStorage('favIDs')
    if (!favIDs) favIDs = []

    const index = favIDs.indexOf(id)
    if (index == -1) {
        POI.properties.icon = 'pin-favourite'
        locations.find(location => location.id == id).isFavourite = true
        $('.fa-heart[targetID=' + id + ']').attr('class', 'fas fa-heart')
        favIDs.push(id)
    }
    else {
        POI.properties.icon = 'pin'
        locations.find(location => location.id == id).isFavourite = false
        $('.fa-heart[targetID=' + id + ']').attr('class', 'far fa-heart')
        favIDs.splice(index, 1)
    }

    Utility.setItemToLocalStorage('favIDs', favIDs)
    map.updatePOIs(POIs)
    sortLocations()
    showLocations()
}

const sortLocations = () => {
    locations.sort((a, b) => {
        return a.distance > b.distance
    })
    locations.sort((a, b) => {
        return Number(b.isFavourite) - Number(a.isFavourite)
    })
}