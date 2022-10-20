// svg icons support ie11
(function () {
    svg4everybody();
})();


$(document).ready(function () {
    $('.select').niceSelect();
});



// toggle body theme
(function () {
    var switchTheme = $('.js-switch-theme'),
        body = $('body');

    switchTheme.on('change', function () {
        if (!body.hasClass('dark')) {
            body.addClass('dark');
            localStorage.setItem('darkMode', "on");
        } else {
            body.removeClass('dark');
            localStorage.setItem('darkMode', "off");
        }
    });
})();

$(window).on('resize orientationchange', function () {
    $('.js-slider-resize').slick('resize');
});