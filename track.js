/* ==========================================
       ANALYTICS SCRIPTS
    ========================================== */

/* Injabulo — silent visit tracking */
(function () {
    'use strict';
    const ENDPOINT = 'https://galela-solution-backend.onrender.com/api/analytics/visit/';

    let sid = '';
    try {
        sid = sessionStorage.getItem('inj_sid');
        if (!sid) {
            sid = (crypto.randomUUID && crypto.randomUUID()) || ('gs-' + Date.now());
            sessionStorage.setItem('inj_sid', sid);
        }
    } catch (e) {}

    fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            site:       'injabulo', // <--- THIS IS THE MAGIC KEY
            path:       window.location.pathname,
            referrer:   document.referrer || '',
            session_id: sid,
        }),
        keepalive: true,
    }).catch(() => {});
})();