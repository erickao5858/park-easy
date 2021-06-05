// TODO: Implement setting variance

/*const HIDE = true, REFRESH = true*/
$(document).ready(() => {
    $('.brand-logo').text('List')
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
        M.toast({ html: 'Failed to get user location, please allow location access!' ,
        completeCallback: function () {
            $(document.body).after(
                `<div id="NoGPSModal" class="modal">              
                <div class="modal-content">
                <h5>Location is unavailable</h4>
                <p>We're unable to access your location. If this was unintended you can find help in the links below</p>
                <h6>Android users</h6>  
                <a href="https://support.google.com/accounts/answer/3467281?hl=en">Click here</a>  
                <h6>iPhone users</h6>  
                <a href="https://support.apple.com/en-au/HT203080">Click here</a>
                </div>     
                <div class="modal-footer" id="modalFooter">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat" id="modalClose">Back</a>
                </div>
                </div>`)
        $('#NoGPSModal').modal()
        $('#NoGPSModal').modal('open')
        }})
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
        if (data.locations.length == 0) {
            // TODO: Add notification - no available locations
            return
        }
        $('#listLoader').hide()
        showLocations(data.locations)
    })
}

const showLocations = (locations) => {
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