// Credential
mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2thbyIsImEiOiJja25qMzhldmgwYThwMm5tZjh2bjBsdmQxIn0.3z4PTxSU8z0A_ggSYH3FCQ'

// Initialize map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    maxZoom: 15,
    minZoom: 13,
    zoom: 14,
    center: [145.114641, -37.849003]
}).addControl(
    // Activate geolocate function
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showAccuracyCircle: false
    })
).on('load',
    // Fires when map fully loaded
    () => {
        // Add an image to use as a custom marker
        map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (err, image) => {
            if (err) throw err
            map.addImage('custom-marker', image)

            // TODO: Request data from api server

            // TODO: NOT IN MVP
            // Request parameter includes current position
            // The server only returns parking bays around the user

            // Format data for POI
            const POIs = createPOIs(data)

            // Refresh map POIs
            refreshPOI(POIs)
        })
    }
)

// Center map to user location
// navigator.geolocation.getCurrentPosition((position) => map.setCenter([position.coords.longitude, position.coords.latitude]))

// Append POIs to map
const appendPOIs = (POIs) => {
    // Bind POI data to map
    map.addSource('points', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': POIs
        }
    })
    // Add a POI layer to map
    map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
            'icon-image': 'custom-marker',
            'text-field': ['get', 'title'],
            'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
            ],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
        }
    })
    // Bind click event
    map.on('click', 'points', (e) => {
        var coordinates = e.features[0].geometry.coordinates.slice()
        var description = generateLinkHTML(e.features[0].properties.title, e.features[0].geometry.coordinates, e.features[0].properties.bays)

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map)
    })
    // TODO: NOT IN MVP 
    // Add data expiry
}

const generateLinkHTML = (title, coordinates, bays) => {
    // TODO: NOT IN MVP
    // Use jquery to formulate html
    return '<b>' + title + '</b>' + '<div>' +
        getDistance(coordinates[1], coordinates[0]) + '<br>' +
        bays + '<br>' +
        '<a href="https://www.google.com/maps/dir/?api=1&destination=' +
        coordinates[1] + ',' + coordinates[0] + '&travelmode=driving" target="_blank">Navi to here</a>' +
        '</div>'
}

// Remove POIs from map
const removePOIs = () => {
    if (!map.getLayer('points')) return
    map.removeLayer('points')
    map.removeSource('points')
}

// Remove POIs and append new POIs
const refreshPOI = (POIs) => {
    removePOIs()
    appendPOIs(POIs)
}

// Convert rawdata into POI data
const createPOIs = (data) => {
    let POIs = []
    data.locations.forEach(location => {
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