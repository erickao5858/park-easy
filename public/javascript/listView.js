// TODO: Implement setting variance
$(document).ready(() => {
    showLocations(data)
})

const showLocations = (data) => {
    // TODO: NOT IN MAP
    // add loading effect
    
    // Wait for user location data
    if (!userCoordinates) {
        setTimeout(() => {
            showLocations(data)
        }, 200)
        return
    }
    data.locations.forEach(location => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('img').click(zoomImage)
        element.find('span').html(location.title)
        element.find('p').html(
            location.baysAvailable + '/' + location.bays + ' spots' +
            '<br>' +
            getDistance(location.coordinates[1], location.coordinates[0])
        )
        element.find('a').attr('href', 'https://www.google.com/maps/dir/?api=1&destination=' + location.coordinates[1] + ',' + location.coordinates[0] + '&travelmode=driving')
    })
}