// TODO: Migrate to listView.js and mapView.js
let userCoordinates
let currentUser
$(document).ready(() => {
    // Initialize materializecss components
    M.AutoInit()

    // Retrieve current user from local storage
    currentUser = getItemFromLocalStorage('currentUser')
    if (currentUser) appendUserInfo()

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

appendUserInfo = () => {
    // TODO: Log in with passport
    const userInfoElement = $('#slide-out').children().first()
    userInfoElement.click(logout)
    userInfoElement.html('<a class="waves-effect" href="#"><i class="material-icons">person</i> Sign out</a>')
}

logout = () => {
    $.get('/logout', (data) => {
        console.log(data)
        if (!data.success) {
            M.toast({ html: 'Connection failed!' })
            return
        }
        removeItemFromLocalStorage('currentUser')
        $(location).attr('href', '/login')
    })
}
// TODO: Disable drag and select with jquery functions
