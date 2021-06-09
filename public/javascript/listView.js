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
        M.toast({
            html: 'Failed to get user location, please allow location access!',
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
            }
        })
    }, {
        enableHighAccuracy: true
    })
})

$('#btnListRefresh').on('click', function () {
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

        const locations = data.locations
        // Get favourite location IDs from local storage
        let favIDs = Utility.getItemFromLocalStorage('favIDs')
        if (favIDs) {
            favIDs.forEach(id => {
                const location = locations.find(location => location.id == id)
                if (location) location.isFavourite = true
                else location.isFavourite = false
            })
        }

        showLocations(locations)
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
        const favBtn = $('<i/>')
        favBtn.attr('class', location.isFavourite == true ? 'fas fa-heart' : 'far fa-heart')
        favBtn.attr('targetID', location.id)
        favBtn.on('click', (event) => {
            updateFav(event.target)
        })
        element.find('span').append(favBtn)
        element.find('p').html(
            location.baysAvailable + '/' + location.bays + ' spots' +
            '<br>' +
            Utility.getDistance(userCoordinates.latitude, userCoordinates.longitude, location.coordinates[1], location.coordinates[0])
        )
        element.find('a').attr('href', 'https://www.google.com/maps/dir/?api=1&destination=' + location.coordinates[1] + ',' + location.coordinates[0] + '&travelmode=driving')
    })
}

const updateFav = (originate) => {
    const id = $(originate).attr('targetID')

    let favIDs = Utility.getItemFromLocalStorage('favIDs')
    if (!favIDs) favIDs = []

    const index = favIDs.indexOf(id)
    if (index == -1) {
        // Change icon
        $(originate).attr('class','fas fa-heart')
        favIDs.push(id)
    }
    else {
        $(originate).attr('class','far fa-heart')
        favIDs.splice(index, 1)
    }
    
    Utility.setItemToLocalStorage('favIDs', favIDs)
}