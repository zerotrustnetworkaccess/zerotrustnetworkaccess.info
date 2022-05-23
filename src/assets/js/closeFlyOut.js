window.onkeydown = function (event) {
  if (event.keyCode == 27) {
    document.querySelector(".offcanvas-info").classList.remove("open");
  }
};
