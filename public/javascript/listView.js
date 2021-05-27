// TODO: Implement setting variance
// TODO: NOT IN MAP
// add loading effect

/*const HIDE = true, REFRESH = true*/
$(document).ready(() => {
    // TODO: NOT IN MVP
    // Display a button allows user to refresh the page
    $('#listLoader').show()
    navigator.geolocation.getCurrentPosition((position) => {
        userCoordinates = position.coords
        refreshLocations()
        /*
        if (REFRESH) {
            setInterval(() => {
                refreshLocations()
            }, 1000)
        }*/
    }, () => {
        M.toast({ html: 'Failed to get user location, please allow location access!' })
    }, {
        enableHighAccuracy: true
    })
})

$('#btnListRefresh').on('click',function(){
    $('.collection').html('')
    $('#listLoader').show()
    refreshLocations()
}) 

const refreshLocations = () => {
    $.post(DATA_URL, { /*hideunavailable: HIDE*/ }, (data) => {
        if (!data.success) {
            // Cannot retrieve locations
            M.toast({ html: 'Location server under maintenance, please come back later!' })
            return
        }
        $('#listLoader').hide()
        showLocations(data.locations)
    })
}

const showLocations = (locations) => {
    // TODO: NOT IN MAP
    // add loading effect
    $('.collection').html('')
    locations.forEach(location => {
        $('.collection').append($('#template-collection-item').html())
        let element = $('.collection').children().last()
        element.find('img').click((obj) => {
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