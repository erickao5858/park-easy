$(document).ready(function () {
    // Initialize side navigator
    $('.sidenav').sidenav();
});

$('.fixed-action-btn').click(() => {
    // Let the button triggers side navigator
    $('.sidenav').sidenav('open')
})