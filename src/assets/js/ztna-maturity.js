/**
 * CISA Zero Trust Maturity Model 2.0 explorer (/maturity-model).
 *
 * The whole matrix is rendered by Jekyll from _data/maturity.yml
 * (_includes/maturity/explorer.html), so it is readable and indexable without
 * JS. This script adds:
 *   - collapsible groups (one open by default: `default_open` in the data file)
 *   - stage focus: widens one column, dims the others, shows its key points
 *   - capability trace: opens every group and highlights one capability's rows
 *   - example organisation: NOW tags, later stages outlined, MOSTLY HERE
 *
 * State is written to the root element (classes and data attributes) and the
 * stylesheet does the rest. Every control is a real <button> with
 * aria-expanded / aria-pressed kept in sync; the note bar and the stage panel
 * are aria-live regions.
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-mm]");
  if (!root) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var groups = toArray(root.querySelectorAll("[data-mm-group]")).map(function (el) {
    return {
      el: el,
      id: el.getAttribute("data-mm-group"),
      toggle: el.querySelector("[data-mm-toggle]"),
      body: el.querySelector(".mm-group__body")
    };
  });
  var stageButtons = toArray(root.querySelectorAll("[data-mm-stage]"));
  var capButtons = toArray(root.querySelectorAll("[data-mm-cap]")).filter(function (el) {
    return el.tagName === "BUTTON";
  });
  var capRows = toArray(root.querySelectorAll(".mm-fn[data-mm-cap]"));
  var exampleButton = root.querySelector("[data-mm-example]");
  var noteRegion = root.querySelector("[data-mm-note]");
  var focusRegion = root.querySelector("[data-mm-focus]");

  var defaultOpen = root.getAttribute("data-default-open");
  var state = {
    open: groups.map(function (g) {
      return g.id === defaultOpen;
    }),
    focus: null, // stage index 0-3
    cap: null, // capability id
    example: false
  };

  var shownNote = null;
  var shownFocus = null;

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  function setPressed(el, on) {
    el.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function render() {
    var tracing = state.cap !== null;

    root.classList.toggle("is-example", state.example);
    if (state.focus === null) root.removeAttribute("data-focus");
    else root.setAttribute("data-focus", String(state.focus));
    if (tracing) root.setAttribute("data-cap", state.cap);
    else root.removeAttribute("data-cap");

    // Tracing a capability opens every group without forgetting which
    // groups the reader had open.
    groups.forEach(function (g, i) {
      var expanded = state.open[i] || tracing;
      g.body.hidden = !expanded;
      g.toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });

    capRows.forEach(function (row) {
      row.classList.toggle("is-lit", row.getAttribute("data-mm-cap") === state.cap);
    });

    stageButtons.forEach(function (btn, i) {
      setPressed(btn, state.focus === i);
    });
    capButtons.forEach(function (btn) {
      setPressed(btn, btn.getAttribute("data-mm-cap") === state.cap);
    });
    setPressed(exampleButton, state.example);

    renderNote();
    renderFocus();
  }

  // The capability note takes priority over the example note.
  function renderNote() {
    var source = null;
    if (state.cap !== null) {
      source = capButtons.filter(function (btn) {
        return btn.getAttribute("data-mm-cap") === state.cap;
      })[0];
    } else if (state.example) {
      source = exampleButton;
    }
    if (source === shownNote) return;
    shownNote = source;

    noteRegion.textContent = "";
    if (!source) return;
    var box = document.createElement("div");
    box.className = "mm-note__box";
    var title = document.createElement("span");
    title.className = "mm-note__title";
    title.textContent = source.getAttribute("data-mm-note-title");
    var text = document.createElement("span");
    text.className = "mm-note__text";
    text.textContent = source.getAttribute("data-mm-note-text");
    box.appendChild(title);
    box.appendChild(text);
    noteRegion.appendChild(box);
  }

  function renderFocus() {
    if (state.focus === shownFocus) return;
    shownFocus = state.focus;

    focusRegion.textContent = "";
    if (state.focus === null) return;
    var tpl = root.querySelector('template[data-mm-points="' + state.focus + '"]');
    if (tpl) focusRegion.appendChild(document.importNode(tpl.content, true));
  }

  function setFocus(index, returnFocus) {
    var previous = state.focus;
    state.focus = index;
    render();
    // The Clear button disappears with the panel, so hand focus back to
    // the stage header that opened it.
    if (returnFocus && index === null && previous !== null) {
      stageButtons[previous].focus();
    }
  }

  function toggleGroup(i) {
    var expanded = state.open[i] || state.cap !== null;
    state.open[i] = !expanded;
    state.cap = null;
    render();
  }

  root.addEventListener("click", function (event) {
    var target = event.target;
    var el;

    if ((el = target.closest("[data-mm-stage]"))) {
      var index = Number(el.getAttribute("data-mm-stage"));
      setFocus(state.focus === index ? null : index, false);
    } else if ((el = target.closest("[data-mm-clear]"))) {
      setFocus(null, true);
    } else if ((el = target.closest("button[data-mm-cap]"))) {
      var cap = el.getAttribute("data-mm-cap");
      state.cap = state.cap === cap ? null : cap;
      render();
    } else if ((el = target.closest("[data-mm-example]"))) {
      state.example = !state.example;
      render();
    } else if ((el = target.closest("[data-mm-all]"))) {
      var open = el.getAttribute("data-mm-all") === "open";
      state.open = groups.map(function () {
        return open;
      });
      state.cap = null;
      render();
    } else if ((el = target.closest("[data-mm-toggle], [data-mm-toggle-proxy]"))) {
      // Summary cells are a larger click target for the group's own
      // toggle button, which is what keyboard users reach.
      var group = el.closest("[data-mm-group]");
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].el === group) toggleGroup(i);
      }
    }
  });

  // Escape steps back: first the stage focus, then the capability trace.
  root.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (state.focus !== null) {
      var inPanel = focusRegion.contains(document.activeElement);
      setFocus(null, inPanel);
    } else if (state.cap !== null) {
      state.cap = null;
      render();
    }
  });

  // Start up.
  root.classList.add("is-js");
  render();

  if (reducedMotion.matches) {
    root.classList.add("is-mounted", "is-intro-done");
  } else {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.add("is-mounted");
      });
    });
    setTimeout(function () {
      root.classList.add("is-intro-done");
    }, groups.length * 70 + 600);
  }
})();
