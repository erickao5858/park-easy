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
    $.post('/login', { username: username, password: password }, (data) => {
        const user = data[0]
        if (!user) {
            // User not found
            M.toast({ html: 'Incorrect username or password' })
            return
        }
        const currentUser = {
            username: user.username,
            userID: user._id
        }
        setItemToLocalStorage('currentUser', currentUser)
        $(location).attr('href', '/settings')
    })
}