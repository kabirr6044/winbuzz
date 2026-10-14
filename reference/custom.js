jQuery(document).ready(function ($) {

    function appHeight() {
        document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
        const header = document.querySelector("header");
        document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    }
    appHeight();

    $(window).resize(function () {
        appHeight();
    });

    // Toggle navigation
    $('.navigation-toggler').on('click', function () {
        $('body').toggleClass('is-nav-open');
    });

    // Close navigation on overlay click
    $('.nav-overlay, .nav-wrap nav ul li a').on('click', function () {
        $('body').removeClass('is-nav-open');
    });

    // Sticky header
    $(window).on('scroll', function () {
        if (window.pageYOffset > 100) {
            $('body').addClass('is-header-sticky');
        } else {
            $('body').removeClass('is-header-sticky');
        }
    });

    // Sub Menu
    $(".header ul>li:has(ul)").prepend('');

    $(".arrow").click(function (e) {
        e.stopPropagation(); // Prevent click event from bubbling up
        var submenu = $(this).siblings("ul");
        var isVisible = submenu.is(":visible");

        // Close other open submenus
        $(this).parent().siblings().find("ul:visible").slideUp().siblings(".arrow").removeClass("arrow-open");

        // Toggle the current submenu
        submenu.slideToggle();
        $(this).toggleClass("arrow-open", !isVisible); // Set class based on visibility

        // Handle nested arrows
        submenu.find(".arrow").each(function () {
            $(this).removeClass("arrow-open"); // Remove arrow-open from all nested arrows
        });
    });

    // Open first FAQ on load
    $('.faq-item').first().addClass('active')
        .find('.faq-answer').stop(true, true).slideDown(300);

    $('.faq-question').on('click', function () {

        const parent = $(this).closest('.faq-item');

        // If already active → do nothing
        if (parent.hasClass('active')) {
            return;
        }

        // Close active item smoothly
        $('.faq-item.active')
            .removeClass('active')
            .find('.faq-answer')
            .stop(true, true)
            .slideUp(300);

        // Open clicked item smoothly
        parent
            .addClass('active')
            .find('.faq-answer')
            .stop(true, true)
            .slideDown(300);
    });



    $('details').first().attr('open', true);



    $('details summary').on('click', function () {



        const current = $(this).parent('details');



        if (!current.attr('open')) {

            $('details').not(current).removeAttr('open');

        }



    });





    jQuery(document).on('click', 'a[href*="wa.link"]', function (e) {

        e.preventDefault();

        window.open(jQuery(this).attr('href'), '_blank');

    });


});
