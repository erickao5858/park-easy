// TODO: Migrate to listView.js and mapView.js
let userCoordinates
$(document).ready(() => {
    // Initialize side navigator
    $('.sidenav').sidenav()

    // Initialize modal
    $('.modal').modal()

    // TODO: Extract as a function
    // Called only in list view and map view pages
    // Get user location
    navigator.geolocation.getCurrentPosition((position) => {
        userCoordinates = position.coords
    }, () => {
        M.toast({ html: 'Failed to get user location, please allow location access!' })
        $('#map').remove()
    }, {
        enableHighAccuracy: true
    })
})
$('.fixed-action-btn').click(() => {
    // Let the button triggers side navigator
    $('.sidenav').sidenav('open')
})

// TODO: Disable drag and select with jquery functions