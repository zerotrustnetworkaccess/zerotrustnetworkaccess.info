/**
 * Opens Tally forms as a popup in the bottom-right corner of the page.
 *
 * Any link with a `data-tally-form` attribute (the form ID) opens that form.
 * While it's open the body gets OPEN_CLASS, which hides the pinned "Talk to
 * Enclave" button that would otherwise sit underneath. Tally's embed script is only fetched on the first click, so visitors
 * who never use the form don't load anything from tally.so. If the script
 * can't be loaded, the browser goes to the link's own href (the hosted form).
 */
(function () {
  "use strict";

  var EMBED_SRC = "https://tally.so/widgets/embed.js";
  var OPEN_CLASS = "tally-popup-open";
  var loading = null;

  function loadTally() {
    if (window.Tally) return Promise.resolve(window.Tally);
    if (loading) return loading;

    loading = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = EMBED_SRC;
      script.async = true;
      script.onload = function () {
        window.Tally ? resolve(window.Tally) : reject();
      };
      script.onerror = function () {
        loading = null;
        reject();
      };
      document.head.appendChild(script);
    });

    return loading;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-tally-form]");
    if (!link) return;

    event.preventDefault();

    // Set straight away rather than in Tally's onOpen, which only fires once
    // the form has finished loading.
    document.body.classList.add(OPEN_CLASS);

    loadTally().then(
      function (Tally) {
        Tally.openPopup(link.getAttribute("data-tally-form"), {
          width: 320,
          emoji: { text: "👋", animation: "wave" },
          // Fills the form's "page" hidden field, if it has one, so submissions
          // show which page the visitor was reading.
          hiddenFields: { page: window.location.pathname },
          onClose: function () {
            document.body.classList.remove(OPEN_CLASS);
          },
        });
      },
      function () {
        window.location.href = link.href;
      }
    );
  });
})();
