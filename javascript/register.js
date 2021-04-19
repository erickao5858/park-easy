$(document).ready(() => {
    // Bind click event to register button
    $('#btn-register').click(register)
})

const register = () => {
    // Validate input fields
    if (!$('form')[0].reportValidity()) return

    // Get username and password
    const username = $('#username').val()
    const password = $('#password').val()
    $.post('/register', { username: username, password: password }, (data) => {
        if (!data.success) {
            // Register failed
            M.toast({ html: 'User exist!' })
            return
        }
        $('form').trigger('reset')
        M.toast({ html: 'Register successfully!' })
    })
}