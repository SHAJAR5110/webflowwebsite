/* animations.js
   Place GSAP-powered animations and interaction logic here. Kept separate
   from `main.js` so behavior is easy to find and maintain.

   NOTE: The original export did not include a separate GSAP file. If there
   are Webflow interactions or GSAP timelines embedded elsewhere, we'll
   reproduce them here (preserving behavior) in subsequent iterative updates.
*/

/* Example placeholder: keep this file intentionally minimal until we
   re-create Webflow interactions with GSAP to guarantee parity. */
function initAnimations() {
    // Ensure elements exported with inline `style="opacity:0"` are
    // not permanently hidden if animations fail to run. Clear inline
    // opacity for Webflow IX targets so content remains visible.
    try {
        Array.prototype.slice.call(document.querySelectorAll('[data-w-id]')).forEach(function (el) {
            try {
                if (el.style && (el.style.opacity === '0' || el.style.opacity === 0)) {
                    el.style.opacity = '';
                }
            } catch (e) { /* ignore per-element errors */ }
        });
    } catch (e) { /* ignore overall failure */ }
    // Read More functionality (migrated from inline HTML)
    (function () {
        var wrapper = document.querySelector('.about-read-more');
        if (!wrapper) return;
        var hidden = wrapper.querySelector('.hidden-box');
        var btn = wrapper.querySelector('.button-group.is--read-more .button');
        if (!hidden || !btn) return;

        // ensure collapsed start
        if (!hidden.style.height) hidden.style.height = '0px';
        wrapper.setAttribute('aria-expanded', 'false');

        var openPanel = function () {
            wrapper.classList.add('expanded');
            wrapper.setAttribute('aria-expanded', 'true');
            hidden.style.display = 'block';
            var h = hidden.scrollHeight + 'px';
            hidden.style.height = '0px';
            hidden.getBoundingClientRect();
            hidden.style.transition = 'height 260ms ease';
            hidden.style.height = h;
            hidden.addEventListener('transitionend', function te() {
                hidden.style.transition = '';
                hidden.style.height = '';
                hidden.removeEventListener('transitionend', te);
            });
        };

        var closePanel = function () {
            wrapper.classList.remove('expanded');
            wrapper.setAttribute('aria-expanded', 'false');
            hidden.style.height = hidden.scrollHeight + 'px';
            hidden.getBoundingClientRect();
            hidden.style.transition = 'height 260ms ease';
            hidden.style.height = '0px';
            hidden.addEventListener('transitionend', function te() {
                hidden.style.transition = '';
                hidden.style.display = 'none';
                hidden.removeEventListener('transitionend', te);
            });
        };

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = wrapper.classList.contains('expanded');
            if (isOpen) closePanel(); else openPanel();
        });
    })();

    // Navigation toggle (mobile) and dropdown handlers
    // (function () {
    //     var nav = document.querySelector('.w-nav');
    //     var navButtons = Array.prototype.slice.call(document.querySelectorAll('.w-nav-button, .menu-button'));

    //     navButtons.forEach(function (btn) {
    //         btn.addEventListener('click', function (e) {
    //             e.preventDefault();
    //             if (nav) nav.classList.toggle('w--open');
    //             btn.classList.toggle('w--open');
    //             document.documentElement.classList.toggle('nav-open');
    //         });
    //     });

    //     // Dropdown toggles — toggle the list's `w--open` class so CSS shows the menu
    //     var dropdownToggles = Array.prototype.slice.call(document.querySelectorAll('.w-dropdown .dropdown-toggle'));
    //     dropdownToggles.forEach(function (toggle) {
    //         toggle.addEventListener('click', function (e) {
    //             e.preventDefault();
    //             e.stopPropagation();
    //             var dd = toggle.closest('.w-dropdown');
    //             if (!dd) return;
    //             var list = dd.querySelector('.w-dropdown-list');
    //             if (list) {
    //                 list.classList.toggle('w--open');
    //                 // // Prevent body scroll when dropdown is open
    //                 // if (list.classList.contains('w--open')) {
    //                 //     document.body.style.overflow = 'hidden';
    //                 // } else {
    //                 //     document.body.style.overflow = '';
    //                 // }
    //             }
    //             dd.classList.toggle('w--open');
    //         });
    //     });

    //     // Close nav / dropdowns when clicking outside
    //     document.addEventListener('click', function (e) {
    //         if (e.target.closest && (e.target.closest('.w-nav') || e.target.closest('.w-dropdown'))) return;
    //         // close nav
    //         if (nav && nav.classList.contains('w--open')) nav.classList.remove('w--open');
    //         navButtons.forEach(function (b) { b.classList.remove('w--open'); });
    //         // close dropdowns - remove w--open from both .w-dropdown and .w-dropdown-list
    //         Array.prototype.slice.call(document.querySelectorAll('.w-dropdown.w--open')).forEach(function (d) {
    //             d.classList.remove('w--open');
    //             var list = d.querySelector('.w-dropdown-list');
    //             if (list) {
    //                 list.classList.remove('w--open');
    //                 // Restore body scroll when closing dropdown
    //                 document.body.style.overflow = '';
    //             }
    //         });
    //     });
    // })();
    (function () {
        // =========================
        // ELEMENTS
        // =========================
        const nav = document.querySelector('.w-nav');
        const navButton = document.querySelector('.w-nav-button');
        const dropdowns = document.querySelectorAll('.w-dropdown');

        // =========================
        // MOBILE NAV TOGGLE
        // (Only for mobile menu)
        // =========================
        if (navButton && nav) {
            navButton.addEventListener('click', function () {
                nav.classList.toggle('w--open');
                navButton.classList.toggle('w--open');
            });
        }

        // =========================
        // DROPDOWN HANDLING
        // =========================
        dropdowns.forEach(function (dropdown) {
            const toggle = dropdown.querySelector('.w-dropdown-toggle');
            const list = dropdown.querySelector('.w-dropdown-list');

            if (!toggle || !list) return;

            toggle.addEventListener('click', function (e) {
                // Let Webflow open it — we only manage clean state
                e.stopPropagation();

                // Close other open dropdowns
                dropdowns.forEach(function (d) {
                    if (d !== dropdown) {
                        d.classList.remove('w--open');
                        const l = d.querySelector('.w-dropdown-list');
                        if (l) l.classList.remove('w--open');
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('w--open');
                list.classList.toggle('w--open');
            });
        });

        // =========================
        // CLOSE ON OUTSIDE CLICK
        // =========================
        document.addEventListener('click', function (e) {
            if (e.target.closest('.w-nav') || e.target.closest('.w-dropdown')) return;

            // Close dropdowns
            dropdowns.forEach(function (dropdown) {
                dropdown.classList.remove('w--open');
                const list = dropdown.querySelector('.w-dropdown-list');
                if (list) list.classList.remove('w--open');
            });

            // Close mobile nav
            if (nav) nav.classList.remove('w--open');
            if (navButton) navButton.classList.remove('w--open');
        });

        // =========================
        // WINDOW RESIZE FIX
        // =========================
        window.addEventListener('resize', function () {
            if (window.innerWidth > 991) {
                // Reset mobile nav on desktop
                if (nav) nav.classList.remove('w--open');
                if (navButton) navButton.classList.remove('w--open');
            }
        });
    })();


    // FAQ accordion behaviour: attach direct handlers to each toggle for reliability
    (function () {
        var toggles = Array.prototype.slice.call(document.querySelectorAll('.faq-dropdown-toggle'));
        if (!toggles.length) return;

        toggles.forEach(function (toggle) {
            var item = toggle.closest('.dropdown-item');
            if (!item) return;
            var panel = item.querySelector('.dropdown-panel');
            if (!panel) return;

            // initialize ARIA and collapsed state
            toggle.setAttribute('role', 'button');
            toggle.setAttribute('tabindex', '0');
            item.classList.remove('is--open');
            toggle.setAttribute('aria-expanded', 'false');
            panel.style.overflow = 'hidden';
            // normalize start height to 0 if not explicitly open
            if (!item.classList.contains('is--open')) {
                panel.style.height = '0px';
                panel.style.display = 'none';
            }

            var close = function () {
                item.classList.remove('is--open');
                toggle.setAttribute('aria-expanded', 'false');
                panel.style.height = panel.scrollHeight + 'px';
                panel.getBoundingClientRect();
                panel.style.transition = 'height 260ms ease';
                panel.style.height = '0px';
                panel.addEventListener('transitionend', function te() {
                    panel.style.transition = '';
                    panel.style.display = 'none';
                    panel.removeEventListener('transitionend', te);
                });
            };

            var open = function () {
                // close siblings
                var siblings = item.parentElement && Array.prototype.slice.call(item.parentElement.querySelectorAll('.dropdown-item.is--open')) || [];
                siblings.forEach(function (s) {
                    if (s === item) return;
                    var sPanel = s.querySelector('.dropdown-panel');
                    var sToggle = s.querySelector('.faq-dropdown-toggle');
                    if (sPanel) {
                        s.classList.remove('is--open');
                        if (sToggle) sToggle.setAttribute('aria-expanded', 'false');
                        sPanel.style.height = sPanel.scrollHeight + 'px';
                        sPanel.getBoundingClientRect();
                        sPanel.style.transition = 'height 260ms ease';
                        sPanel.style.height = '0px';
                        sPanel.addEventListener('transitionend', function te() {
                            sPanel.style.transition = '';
                            sPanel.style.display = 'none';
                            sPanel.removeEventListener('transitionend', te);
                        });
                    }
                });

                item.classList.add('is--open');
                toggle.setAttribute('aria-expanded', 'true');
                panel.style.display = 'block';
                var h = panel.scrollHeight + 'px';
                panel.style.height = '0px';
                panel.getBoundingClientRect();
                panel.style.transition = 'height 260ms ease';
                panel.style.height = h;
                panel.addEventListener('transitionend', function te() {
                    panel.style.transition = '';
                    panel.style.height = '';
                    panel.removeEventListener('transitionend', te);
                });
            };

            var toggleFn = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (item.classList.contains('is--open')) close(); else open();
            };

            toggle.addEventListener('click', toggleFn);
            toggle.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFn(e);
                }
            });
        });
    })();

    // Load GSAP (if not included) and run simple reveal animations that
    // match the original Webflow fades for elements with `data-w-id`.
    (function loadGsapAndAnimate() {
        var GSAP_CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js';
        var loadScript = function (src, cb) {
            var s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = cb;
            s.onerror = cb;
            document.head.appendChild(s);
        };

        var runAnimations = function () {
            try {
                var gsap = window.gsap;
                if (!gsap) return;

                var mm = window.matchMedia('(min-width: 992px)');

                var reveal = function (el) {
                    // Only animate if element is currently invisible
                    var style = window.getComputedStyle(el);
                    var curOpacity = parseFloat(style.opacity || 1);
                    if (curOpacity === 0) {
                        gsap.fromTo(el, { y: 12, opacity: 0 }, { duration: 0.7, y: 0, opacity: 1, ease: 'power2.out' });
                    }
                };

                // Only target elements that Webflow often marks for IX animations
                var items = Array.prototype.slice.call(document.querySelectorAll('[data-w-id]'));
                if (mm.matches) {
                    // stagger animations for a nicer entrance on large screens
                    gsap.fromTo(items, { y: 12, opacity: 0 }, { duration: 0.7, y: 0, opacity: 1, stagger: 0.06, ease: 'power2.out' });
                } else {
                    // on small screens, reveal without translation
                    items.forEach(function (el) { reveal(el); });
                }

                // Setup marquee (logos slider) animation if present
                var logosList = document.querySelector('.logos-slider_list');
                if (logosList) {
                    try {
                        // Ensure content is long enough for looping
                        if (logosList.dataset._cloned !== '1') {
                            logosList.dataset._cloned = '1';
                            logosList.innerHTML += logosList.innerHTML;
                        }
                        var totalWidth = logosList.scrollWidth / 2 || logosList.offsetWidth;
                        // duration proportional to width for consistent speed
                        var duration = Math.max(8, totalWidth / 120);
                        gsap.to(logosList, { x: -totalWidth, duration: duration, ease: 'none', repeat: -1 });
                    } catch (err) {
                        // ignore marquee failures
                    }
                }
            } catch (e) {
                // silently fail — animations are progressive enhancement
                // console.warn('GSAP animation error', e);
            }
        };

        if (!window.gsap) {
            loadScript(GSAP_CDN, runAnimations);
        } else {
            runAnimations();
        }
    })();
}

// If the document is already parsed, run init immediately; otherwise wait for DOMContentLoaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    try { initAnimations(); } catch (e) { console.warn('animations init failed', e); }
}
