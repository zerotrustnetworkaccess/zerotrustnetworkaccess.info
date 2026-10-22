/**
 * Zero Trust Maturity Model explorer (/maturity-model).
 *
 * The grid, bands and stage descriptions are rendered by Jekyll from
 * _data/maturity.yml (see _includes/maturity/explorer.html), so the page works
 * without JS. This adds the interactions: selecting a pillar, stage, cell or
 * capability band shows its detail in the panel, and the view toggle switches
 * between the model and an example organisation's profile.
 *
 * Every control is a real <button>; state is mirrored to aria-pressed /
 * aria-expanded, and the panel is an aria-live region.
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-mm]");
  if (!root) return;

  var data = JSON.parse(root.querySelector("[data-mm-data]").textContent);
  var panel = root.querySelector("[data-mm-panel]");
  var stackedQuery = window.matchMedia("(max-width: 1199px)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var STAGE_INDEX = {};
  data.stages.forEach(function (stage, i) {
    STAGE_INDEX[stage.id] = i;
  });
  var stagesTopDown = data.stages.slice().reverse();

  var state = {
    view: "model",
    pillar: null, // set for pillar and cell selections
    stage: null, // set for stage and cell selections
    band: null,
    chip: null, // index of the expanded function chip
  };
  var lastTrigger = null;

  root.classList.add("mm--js");

  // Lookups

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function stageName(id) {
    return byId(data.stages, id).name;
  }

  function isCellSelection() {
    return state.pillar !== null && state.stage !== null;
  }

  function profileStage(pillarId) {
    return state.view === "example" ? data.example.profile[pillarId] : null;
  }

  // DOM helpers

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function each(selector, fn) {
    Array.prototype.forEach.call(root.querySelectorAll(selector), fn);
  }

  // State changes

  function reset() {
    state.pillar = null;
    state.stage = null;
    state.band = null;
    state.chip = null;
  }

  function select(next, trigger) {
    var same =
      next.pillar === state.pillar && next.stage === state.stage && next.band === state.band;
    reset();
    if (!same) {
      state.pillar = next.pillar || null;
      state.stage = next.stage || null;
      state.band = next.band || null;
      lastTrigger = trigger;
    }
    render();
    if (!same) revealPanel();
  }

  // When the panel is stacked under the grid, bring it into view.
  function revealPanel() {
    if (!stackedQuery.matches) return;
    var rect = panel.getBoundingClientRect();
    if (rect.top > window.innerHeight - 80) {
      panel.scrollIntoView({
        block: "nearest",
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    }
  }

  // Grid state

  function renderGrid() {
    root.setAttribute("data-view", state.view);
    if (state.band) {
      root.setAttribute("data-band", byId(data.capabilities, state.band).colour);
    } else {
      root.removeAttribute("data-band");
    }

    each("[data-mm-view]", function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-mm-view") === state.view));
    });

    each(".mm-pillar", function (button) {
      var id = button.getAttribute("data-mm-pillar");
      button.setAttribute("aria-pressed", String(id === state.pillar && !isCellSelection()));
      button.classList.toggle("is-dimmed", state.pillar !== null && id !== state.pillar);
    });

    each(".mm-stage", function (button) {
      var id = button.getAttribute("data-mm-stage");
      var stageOnly = state.stage !== null && state.pillar === null;
      button.setAttribute("aria-pressed", String(stageOnly && id === state.stage));
      button.classList.toggle("is-dimmed", stageOnly && id !== state.stage);
    });

    each(".mm-cell", function (button) {
      var pillar = button.getAttribute("data-mm-pillar");
      var stage = button.getAttribute("data-mm-stage");
      var stageOnly = state.stage !== null && state.pillar === null;

      button.setAttribute(
        "aria-pressed",
        String(isCellSelection() && pillar === state.pillar && stage === state.stage)
      );
      button.classList.toggle(
        "is-dimmed",
        (state.pillar !== null && pillar !== state.pillar) || (stageOnly && stage !== state.stage)
      );

      var current = profileStage(pillar);
      var ahead = current !== null && STAGE_INDEX[stage] > STAGE_INDEX[current];
      var now = current !== null && stage === current;
      button.classList.toggle("is-ahead", ahead);
      button.classList.toggle("is-now", now);

      var status = button.querySelector(".mm-cell__status");
      if (!status) {
        status = el("span", "mm-sr mm-cell__status");
        button.appendChild(status);
      }
      status.textContent = now ? " (current stage)" : ahead ? " (not reached yet)" : "";
    });

    each(".mm-band", function (button) {
      var id = button.getAttribute("data-mm-band");
      button.setAttribute("aria-pressed", String(id === state.band));
      button.classList.toggle("is-dimmed", state.band !== null && id !== state.band);
    });
  }

  // Panel content

  function header(eyebrow, title) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el("p", "mm-eyebrow", eyebrow));
    var h = el("h2", "mm-panel__title", title);
    h.id = "mm-panel-title";
    h.tabIndex = -1;
    frag.appendChild(h);
    return frag;
  }

  function backButton() {
    var button = el("button", "mm-back", "← Back to overview");
    button.type = "button";
    button.setAttribute("data-mm-back", "");
    return button;
  }

  function subhead(text) {
    return el("h3", "mm-panel__subhead", text);
  }

  function ladderItem(stageId, heading, label, current) {
    var item = el("li", "mm-ladder__item" + (current ? " is-current" : ""));
    var marker = el("span", "mm-ladder__marker mm-marker--" + stageId);
    marker.setAttribute("aria-hidden", "true");
    item.appendChild(marker);
    item.appendChild(el("span", "mm-ladder__stage", heading));
    item.appendChild(el("span", "mm-ladder__label", label));
    return item;
  }

  function renderOverview(frag) {
    if (state.view === "example") {
      var example = data.example;
      frag.appendChild(header("Example", example.title));
      example.paragraphs.forEach(function (text) {
        frag.appendChild(el("p", "mm-panel__text", text));
      });

      var list = el("ul", "mm-ladder");
      data.pillars.forEach(function (pillar) {
        var stage = example.profile[pillar.id];
        list.appendChild(
          ladderItem(stage, pillar.name + " · " + stageName(stage), pillar.cells[stage], false)
        );
      });
      frag.appendChild(list);
      frag.appendChild(el("p", "mm-panel__text mm-panel__text--strong", example.legend));
      return;
    }

    var guide = data.how_to_read;
    frag.appendChild(header(guide.label, guide.title));
    guide.paragraphs.forEach(function (text) {
      frag.appendChild(el("p", "mm-panel__text", text));
    });
    frag.appendChild(el("p", "mm-panel__text mm-panel__text--strong", guide.prompt));
  }

  function renderPillar(frag) {
    var pillar = byId(data.pillars, state.pillar);
    var current = state.stage || profileStage(pillar.id);
    var now = profileStage(pillar.id);

    frag.appendChild(backButton());
    frag.appendChild(header("Pillar", pillar.name));
    frag.appendChild(el("p", "mm-panel__text", pillar.question));

    frag.appendChild(subhead("Four stages"));
    var ladder = el("ol", "mm-ladder");
    stagesTopDown.forEach(function (stage) {
      var heading = stage.name + (stage.id === now ? " · Now" : "");
      ladder.appendChild(ladderItem(stage.id, heading, pillar.cells[stage.id], stage.id === current));
    });
    frag.appendChild(ladder);

    frag.appendChild(subhead("Functions"));
    var chips = el("div", "mm-chips");
    pillar.functions.forEach(function (fn, i) {
      var chip = el("button", "mm-chip", fn.name);
      chip.type = "button";
      chip.setAttribute("data-mm-chip", String(i));
      chip.setAttribute("aria-expanded", String(state.chip === i));
      chip.setAttribute("aria-controls", "mm-compare");
      chips.appendChild(chip);
    });
    frag.appendChild(chips);

    var compare = el("div", "mm-compare");
    compare.id = "mm-compare";
    fillCompare(compare, pillar);
    frag.appendChild(compare);
  }

  // The From / To comparison for the expanded function chip, if any.
  function fillCompare(compare, pillar) {
    compare.textContent = "";
    compare.hidden = state.chip === null;
    if (state.chip === null) return;

    var fn = pillar.functions[state.chip];
    [
      ["From (" + stageName("traditional") + ")", fn.from],
      ["To (" + stageName("optimal") + ")", fn.to],
    ].forEach(function (pair) {
      var row = el("div", "mm-compare__row");
      row.appendChild(el("span", "mm-compare__label", pair[0]));
      row.appendChild(el("span", "mm-compare__text", pair[1]));
      compare.appendChild(row);
    });
  }

  function renderStage(frag) {
    var stage = byId(data.stages, state.stage);

    frag.appendChild(backButton());
    frag.appendChild(header("Stage", stage.name));
    frag.appendChild(el("p", "mm-panel__text", stage.description));

    frag.appendChild(subhead("Across the pillars"));
    var list = el("ul", "mm-ladder");
    data.pillars.forEach(function (pillar) {
      list.appendChild(ladderItem(stage.id, pillar.name, pillar.cells[stage.id], false));
    });
    frag.appendChild(list);
  }

  function renderBand(frag) {
    var capability = byId(data.capabilities, state.band);

    frag.appendChild(backButton());
    frag.appendChild(header("Cross-cutting capability", capability.name));
    frag.appendChild(el("p", "mm-panel__text", capability.summary));

    frag.appendChild(subhead("Why it matters"));
    var why = el("p", "mm-panel__text mm-why mm-cap--" + capability.colour, capability.why);
    frag.appendChild(why);

    frag.appendChild(subhead("How it matures"));
    var ladder = el("ol", "mm-ladder");
    stagesTopDown.forEach(function (stage) {
      ladder.appendChild(ladderItem(stage.id, stage.name, capability.stages[stage.id], false));
    });
    frag.appendChild(ladder);
  }

  function renderPanel() {
    var frag = document.createDocumentFragment();
    if (state.band) renderBand(frag);
    else if (state.pillar) renderPillar(frag);
    else if (state.stage) renderStage(frag);
    else renderOverview(frag);

    panel.textContent = "";
    panel.appendChild(frag);
  }

  function render() {
    renderGrid();
    renderPanel();
  }

  // Events

  root.addEventListener("click", function (event) {
    var target = event.target.closest("button");
    if (!target || !root.contains(target)) return;

    if (target.hasAttribute("data-mm-view")) {
      state.view = target.getAttribute("data-mm-view");
      state.chip = null;
      render();
    } else if (target.classList.contains("mm-cell")) {
      select(
        { pillar: target.getAttribute("data-mm-pillar"), stage: target.getAttribute("data-mm-stage") },
        target
      );
    } else if (target.classList.contains("mm-pillar")) {
      select({ pillar: target.getAttribute("data-mm-pillar") }, target);
    } else if (target.classList.contains("mm-stage")) {
      select({ stage: target.getAttribute("data-mm-stage") }, target);
    } else if (target.classList.contains("mm-band")) {
      select({ band: target.getAttribute("data-mm-band") }, target);
    } else if (target.hasAttribute("data-mm-chip")) {
      // Only the chips and comparison change, so the live region announces
      // just the comparison rather than the whole panel again.
      var index = Number(target.getAttribute("data-mm-chip"));
      state.chip = state.chip === index ? null : index;
      Array.prototype.forEach.call(panel.querySelectorAll("[data-mm-chip]"), function (chip, i) {
        chip.setAttribute("aria-expanded", String(i === state.chip));
      });
      fillCompare(panel.querySelector("#mm-compare"), byId(data.pillars, state.pillar));
    } else if (target.hasAttribute("data-mm-back")) {
      goBack();
    }
  });

  root.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && (state.pillar || state.stage || state.band)) {
      goBack();
    }
  });

  function goBack() {
    reset();
    render();
    if (lastTrigger && document.body.contains(lastTrigger)) {
      lastTrigger.focus();
    } else {
      panel.querySelector(".mm-panel__title").focus();
    }
  }

  // The panel's overview is already rendered server-side; re-rendering it here
  // would make screen readers announce it on page load.
  renderGrid();
})();
