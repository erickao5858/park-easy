$(document).ready(() => {
    // TODO: Redirect user in server-side
    if (currentUser) $(location).attr('href', '/')
    // Bind click event to register button
    $('#btn-register').click(register)
})

const register = () => {
    // Validate input fields
    if (!$('form')[0].reportValidity()) return

    // Get username and password
    const username = $('#username').val()
    const password = $('#password').val()

    const url = DEV_MODE ? API_URL['DEV'] : API_URL['PRO']
    $.post(url + 'register', { username: username, password: password }, (data) => {
        if (!data.success) {
            // Register failed
            M.toast({ html: 'User exist!' })
            return
        }
        $('form').trigger('reset')
        M.toast({ html: 'Register successfully!' })
    })
}