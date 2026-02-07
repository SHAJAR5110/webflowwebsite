/* Main site JS: moved from inline export to external file for clarity. */
(function (o, c) {
    var n = c.documentElement, t = ' w-mod-';
    n.className += t + 'js';
    try {
        if ('ontouchstart' in o || (o.DocumentTouch && c instanceof DocumentTouch)) {
            n.className += t + 'touch';
        }
    } catch (e) {
        // ignore errors while feature-detecting
    }
    // Add a minimal IX flag to match Webflow's original runtime class so
    // styles that rely on `html.w-mod-ix` don't leave elements hidden.
    // This is safe: it only mirrors Webflow's class naming and does not
    // reintroduce the original runtime script.
    try {
        if (!n.className.includes(t + 'ix')) n.className += t + 'ix';
    } catch (e) {
        // ignore
    }
})(window, document);

/* Load animations file (kept separate for GSAP/interaction logic). */
(function () {
    var s = document.createElement('script');
    s.src = 'js/animations.js';
    s.defer = true;
    document.head.appendChild(s);
})();
