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
    $.post('http://localhost:3001/login', { username: username, password: password }, (data) => {
        const user = data
        if (!user.username) {
            // User not found
            M.toast({ html: 'Incorrect username or password' })
            return
        }
        setItemToLocalStorage('currentUser', user)
        $(location).attr('href', '/settings')
    })
}