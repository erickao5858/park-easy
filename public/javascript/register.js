$(document).ready(() => {
    // TODO: Redirect user in server-side
    if(currentUser) $(location).attr('href', '/')
    // Bind click event to register button
    $('#btn-register').click(register)
})

const register = () => {
    // Validate input fields
    if (!$('form')[0].reportValidity()) return

    // Get username and password
    const username = $('#username').val()
    const password = $('#password').val()
    // TODO: Extract url as constant
    // Write a function to switch development and production mode
    $.post('https://park-easy-api.mybluemix.net/register', { username: username, password: password }, (data) => {
        if (!data.success) {
            // Register failed
            M.toast({ html: 'User exist!' })
            return
        }
        $('form').trigger('reset')
        M.toast({ html: 'Register successfully!' })
    })
}