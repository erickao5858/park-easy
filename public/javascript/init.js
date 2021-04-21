// TODO: Migrate to listView.js and mapView.js
let userCoordinates
let currentUser
$(document).ready(() => {
    // Initialize materializecss components
    M.AutoInit()

    // Retrieve current user from local storage
    currentUser = Utility.getItemFromLocalStorage('currentUser')
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
    Utility.removeItemFromLocalStorage('currentUser')
    $(location).attr('href', '/login')
}

$(document).ajaxError((event, jqxhr, settings, thrownError) => {
    // TODO: NOT IN MVP
    // Add a service unavailable control that covers the whole page
    // and add a button that allows the user to refresh the page
    // TODO: Extract this as a function and let other similar errors call this function
    M.toast({ html: 'Service unavailable, please check your network status!' })
})
  // TODO: Disable drag and select with jquery functions