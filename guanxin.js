(function () {
    var nav = document.querySelector('.a-nav');
    var toggle = document.querySelector('.a-navtoggle');
    if (!nav || !toggle) return;

    var firstDrawerLink = document.querySelector('.a-navdrawer .a-navlinks a');

    function openDrawer() {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        if (firstDrawerLink) firstDrawerLink.focus();
    }

    function closeDrawer(returnFocus) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
            closeDrawer(false);
        } else {
            openDrawer();
        }
    });

    nav.querySelectorAll('.a-navlinks a').forEach(function (link) {
        link.addEventListener('click', function () {
            closeDrawer(false);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            closeDrawer(true);
        }
    });
})();
