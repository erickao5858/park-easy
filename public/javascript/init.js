// TODO: Migrate to listView.js and mapView.js
let userCoordinates
let currentUser
const DEV_MODE = false
const API_URL = {
    'PRO':'https://park-easy-api.mybluemix.net/',
    'DEV':'http://localhost:3001/'
}
const DATA_URL = 'https://1b662c15.us-south.apigw.appdomain.cloud/park-easy-data/location'

$(document).ready(() => {
    // Initialize materializecss components
    M.AutoInit()

    // Retrieve current user from local storage
    currentUser = Utility.getItemFromLocalStorage('currentUser')
    if (currentUser) appendUserInfo()
})
$('.fixed-action-btn').click(() => {
    // Let the button triggers side navigator
    $('.sidenav').sidenav('open')
})

appendUserInfo = () => {
    // TODO: Log in with passport
    const userInfoElement = $('#slide-out').children().first()
    userInfoElement.click(() => {
        // Logout user
        Utility.removeItemFromLocalStorage('currentUser')
        $(location).attr('href', '/login')
    })
    userInfoElement.html('<a class="waves-effect" href="#"><i class="material-icons">person</i> Sign out</a>')
}

$(document).ajaxError((event, jqxhr, settings, thrownError) => {
    // TODO: NOT IN MVP
    // Add a service unavailable control that covers the whole page
    // and add a button that allows the user to refresh the page
    // TODO: Extract this as a function and let other similar errors call this function
    M.toast({ html: 'Service unavailable, please check your network status!' })
})
  // TODO: Disable drag and select with jquery functions