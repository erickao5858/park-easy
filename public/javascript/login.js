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

    $.post(url + 'login', { username: username, password: password }, (data) => {
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
    })
}