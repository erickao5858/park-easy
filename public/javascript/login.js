$(document).ready(() => {
    $('.brand-logo').text('Login')
    // Bind click event to login button
    $('form').attr('action', url + 'auth/local')
    $('.btn-login-google').attr('href', url + 'auth/google')
    $('.btn-login-facebook').attr('href', url + 'auth/facebook')
    const data = JSON.parse(Utility.getUrlParam('data'))
    if (data) handleLoginData(data)
})

const handleLoginData = (data) => {
    if (!data.success) {
        // User not found
        M.toast({ html: data.err.message })
        return
    }
    const user = {
        username: data.username,
        token: data.token
    }
    Utility.setItemToLocalStorage('currentUser', user)
    $(location).attr('href', '/settings')
}