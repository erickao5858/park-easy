$(document).ready(() => {
    // Bind click event to login button
    $('#btn-login').click(login)
})

const login = () => {
    // Validate input fields
    if (!$('form')[0].reportValidity()) return

    // Get username and password
    const username = $('#username').val()
    const password = $('#password').val()
    $.post('https://park-easy-api.mybluemix.net/login', { username: username, password: password }, (data) => {
        if (!data.success) {
            // User not found
            M.toast({ html: 'Incorrect username or password' })
            return
        }
        const user = {
            userID: data.userID,
            username: data.username
        }
        Utility.setItemToLocalStorage('currentUser', user)
        $(location).attr('href', '/settings')
    })
}