(function () {
    var nav = document.querySelector('.a-nav');
    var toggle = document.querySelector('.a-navtoggle');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('.a-navlinks a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
})();
