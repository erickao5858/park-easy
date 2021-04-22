// TODO: Implement setting variance
// TODO: NOT IN MAP
// add loading effect
$(document).ready(() => {
    // TODO: NOT IN MVP
    // Display a button allows user to refresh the page
    navigator.geolocation.getCurrentPosition((position) => {
        userCoordinates = position.coords
    }, () => {
        M.toast({ html: 'Failed to get user location, please allow location access!' })
        $('#map').remove()
    }, {
        enableHighAccuracy: true
    })
    $.get(DATA_URL, (data) => {
        if (!data.success) {
            // Cannot retrieve locations
            M.toast({ html: 'Location server undre maintenance, please come back later!' })
            return
        }
        showLocations(data.locations)
    })
})

const showLocations = (locations) => {
    // TODO: NOT IN MAP
    // add loading effect
    // Wait for user location data
    if (!userCoordinates) {
        setTimeout(() => {
            showLocations(locations)
        }, 100)
        return
    }
    locations.forEach(location => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('img').click((obj)=>{
            $('.modal').find('img').attr('src', obj.target.currentSrc).css('width', '100%')
            $('.modal').modal('open')
        })
        element.find('span').html(location.title)
        element.find('p').html(
            location.baysAvailable + '/' + location.bays + ' spots' +
            '<br>' +
            Utility.getDistance(userCoordinates.latitude, userCoordinates.longitude, location.coordinates[1], location.coordinates[0])
        )
        element.find('a').attr('href', 'https://www.google.com/maps/dir/?api=1&destination=' + location.coordinates[1] + ',' + location.coordinates[0] + '&travelmode=driving')
    })
}
