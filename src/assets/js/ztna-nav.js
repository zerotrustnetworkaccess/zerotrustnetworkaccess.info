/**
 * Mobile navigation drawer.
 *
 * Replaces the vendored theme's offcanvas handlers in scripts.js, which toggled
 * an `.open` class and nothing else: no scrim, no scroll lock, no Escape key, no
 * focus management, and a hamburger whose `.active` state was tracked separately
 * from the panel's so the two could drift apart.
 *
 * Events are delegated from the document and each drawer is resolved from the
 * clicked element, so this keeps working if the header is ever duplicated (the
 * bundled Headhesive sticky-header plugin clones its target).
 */
(function () {
  "use strict";

  var OPEN_CLASS = "is-open";
  var BODY_CLASS = "ztna-mnav-open";
  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  var DESKTOP_BREAKPOINT = 992;

  var openDrawer = null;
  var lastToggle = null;

  function drawerFor(el) {
    var nav = el.closest(".navbar");
    return nav ? nav.querySelector("[data-ztna-mnav]") : null;
  }

  function toggleFor(drawer) {
    var nav = drawer.closest(".navbar");
    return nav ? nav.querySelector("[data-ztna-mnav-open]") : null;
  }

  function open(drawer, toggle) {
    drawer.classList.add(OPEN_CLASS);
    document.body.classList.add(BODY_CLASS);
    if (toggle) toggle.setAttribute("aria-expanded", "true");

    openDrawer = drawer;
    lastToggle = toggle;

    var first = drawer.querySelector(FOCUSABLE);
    if (first) first.focus();
  }

  function close() {
    if (!openDrawer) return;

    openDrawer.classList.remove(OPEN_CLASS);
    document.body.classList.remove(BODY_CLASS);

    var toggle = lastToggle || toggleFor(openDrawer);
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      // Only pull focus back if it is still inside the drawer we are closing —
      // clicking a nav link should let the browser follow it, not steal focus.
      if (openDrawer.contains(document.activeElement)) toggle.focus();
    }

    openDrawer = null;
    lastToggle = null;
  }

  // Keeps Tab inside the panel while it is open.
  function trapFocus(e) {
    var items = Array.prototype.filter.call(
      openDrawer.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null; }
    );
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-ztna-mnav-open]");
    if (opener) {
      e.preventDefault();
      e.stopPropagation();
      var drawer = drawerFor(opener);
      if (!drawer) return;
      if (drawer.classList.contains(OPEN_CLASS)) close();
      else open(drawer, opener);
      return;
    }

    if (e.target.closest("[data-ztna-mnav-close]")) {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }

    // Following a link should dismiss the drawer behind it.
    if (openDrawer && e.target.closest(".ztna-mnav__link")) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!openDrawer) return;
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      trapFocus(e);
    }
  });

  // The drawer is hidden above the lg breakpoint; make sure the scroll lock and
  // aria state do not survive a rotate or resize into desktop layout.
  window.addEventListener("resize", function () {
    if (openDrawer && window.innerWidth >= DESKTOP_BREAKPOINT) close();
  });
})();
