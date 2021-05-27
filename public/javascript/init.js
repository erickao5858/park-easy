// TODO: Migrate to listView.js and mapView.js
let userCoordinates
let currentUser
const DEV_MODE = false
const API_URL = {
    'PRO': 'https://park-easy-api.mybluemix.net/',
    'DEV': 'http://localhost:3001/'
}
const url = DEV_MODE ? API_URL['DEV'] : API_URL['PRO']
const DATA_URL = 'https://1b662c15.us-south.apigw.appdomain.cloud/park-easy-data/location'

$(document).ready(() => {
    // Initialize materializecss components
    M.AutoInit()

    detectBrowserType()

    // Retrieve current user from local storage
    currentUser = Utility.getItemFromLocalStorage('currentUser')
    if (currentUser) appendUserInfo()
})

$('.fixed-action-btn').click(() => {
    // Let the button triggers side navigator
    $('.sidenav').sidenav('open')
})

detectBrowserType = () => {
    const browserCheck = Utility.getItemFromLocalStorage('browserCheck')
    if (browserCheck) return
    var ua = navigator.userAgent
    console.log(ua)
    ua = ua.toLowerCase()

    //Check User Agent string for 'mobi' and if not route to Desktop page
    if (!ua.includes('mobi')) {
        alert('This website is incompitable with desktop environment, some functions might not work properly.')
        Utility.setItemToLocalStorage('browserCheck', true)
    }
}

appendUserInfo = () => {
    // TODO: Log in with passport
    const userInfoElement = $('#slide-out').children().first()
    userInfoElement.click(() => {
        // Logout user
        Utility.removeItemFromLocalStorage('currentUser')
        $(location).attr('href', url + 'logout')
    })
    userInfoElement.html('<a class="waves-effect" href="#"><i class="material-icons">person</i>Sign out</a>')
}

$(document).ajaxError((event, jqxhr, settings, thrownError) => {
    // TODO: NOT IN MVP
    // Add a service unavailable control that covers the whole page
    // and add a button that allows the user to refresh the page
    // TODO: Extract this as a function and let other similar errors call this function
    M.toast({ html: 'Service unavailable, please check your network status!', completeCallback: function () { if (confirm('Please Refresh the page')) { location.reload(); } } })
})
  // TODO: Disable drag and select with jquery functions