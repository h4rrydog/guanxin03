(function () {
    // file:// has no directory index, so any relative link that points at a directory
    // ("./", "../", "de/", "de/#Labs", "contact/", …) 404s when the site is opened straight
    // off disk. Rewrite those to include index.html explicitly. No-op when served over
    // http(s), where the server resolves the directory itself.
    if (location.protocol !== 'file:') return;

    document.querySelectorAll('a[href]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return; // absolute URL, mailto:, tel:, …

        var hash = href.indexOf('#');
        var dir = hash === -1 ? href : href.slice(0, hash);
        if (dir && dir.slice(-1) === '/') {
            link.setAttribute('href', dir + 'index.html' + (hash === -1 ? '' : href.slice(hash)));
        }
    });
})();

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

    nav.querySelectorAll('.a-lang a[hreflang]').forEach(function (link) {
        // Read the (possibly already file://-rewritten) href once, then append the
        // reader's current section hash on click so switching language keeps their place.
        var base = link.getAttribute('href');
        link.addEventListener('click', function () {
            link.setAttribute('href', base + location.hash);
        });
    });
})();

(function () {
    var form = document.querySelector('.a-form');
    if (!form) return;

    var status = form.querySelector('.a-form-status');
    var submit = form.querySelector('button[type="submit"]');
    var msg = form.dataset;

    // Fields JS alone can fill in: load timestamp (for the min-fill-time spam check) and
    // a "js=1" flag the no-JS fallback on the server never sees.
    if (form.elements.t) form.elements.t.value = String(Date.now());
    if (form.elements.js) form.elements.js.value = '1';

    function fieldMessage(field) {
        if (field.type === 'email' && !field.validity.valueMissing) return msg.msgEmail;
        return msg.msgRequired;
    }

    function clearErrors() {
        form.querySelectorAll('.a-field-err').forEach(function (el) {
            el.remove();
        });
        form.querySelectorAll('[aria-invalid]').forEach(function (el) {
            el.removeAttribute('aria-invalid');
            el.removeAttribute('aria-describedby');
        });
    }

    function showError(field) {
        var err = document.createElement('span');
        err.className = 'a-field-err';
        err.id = field.id + '-err';
        err.textContent = fieldMessage(field);
        field.insertAdjacentElement('afterend', err);
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', err.id);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        var invalid = Array.prototype.filter.call(form.elements, function (field) {
            return field.willValidate && !field.checkValidity();
        });

        if (invalid.length) {
            invalid.forEach(showError);
            invalid[0].focus();
            return;
        }

        var endpoint = form.getAttribute('action');
        if (endpoint === 'REPLACE_WITH_APPS_SCRIPT_URL') {
            status.textContent = msg.msgError;
            status.dataset.state = 'error';
            return;
        }

        submit.disabled = true;
        status.textContent = msg.msgSending;
        delete status.dataset.state;

        fetch(endpoint, {
            method: 'POST',
            body: new URLSearchParams(new FormData(form))
        }).then(function (res) {
            if (!res.ok) throw new Error('bad status');
            return res.json();
        }).then(function (data) {
            if (!data || !data.ok) throw new Error('server rejected submission');
            status.textContent = msg.msgSuccess;
            form.reset();
            form.querySelectorAll('.a-field, .a-hp, .a-req, .a-cta, .a-form-note').forEach(function (el) {
                el.hidden = true;
            });
        }).catch(function () {
            status.textContent = msg.msgError;
            status.dataset.state = 'error';
            submit.disabled = false;
        });
    });
})();
