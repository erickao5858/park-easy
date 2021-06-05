$(document).ready(() => {
    $('.brand-logo').text('Feedback')
    // Bind click event to register button
    $('#btn-submit').click(submitFeedback)
})

const submitFeedback = () => {
    // Validate input fields
    if (!$('form')[0].reportValidity()) return

    // Get username and password
    const name = $('#name').val()
    const email = $('#email').val()
    const feedback = $('#feedback').val()

    $.post(url + 'feedback', { name: name, email: email, feedback: feedback }, (data) => {
        if (!data.success) {
            // Feedbaack failed
            M.toast({ html: 'Action failed: ' + data.err.message })
            return
        }
        $('form').trigger('reset')
        M.toast({ html: 'Feedback submitted succesfully!' })
    })
}
$('#feedback').val('')
M.textareaAutoResize($('#feedback'))