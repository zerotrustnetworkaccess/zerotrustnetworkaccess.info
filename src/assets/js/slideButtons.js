const buttonRight = document.getElementById("slideRight");
const buttonLeft = document.getElementById("slideLeft");

buttonRight.onclick = function () {
  document.getElementById("container").scrollLeft += 200;
};
buttonLeft.onclick = function () {
  document.getElementById("container").scrollLeft -= 200;
};

window.onkeydown = function (event) {
  if (event.keyCode == 27) {
    document.querySelector(".offcanvas-info").classList.remove("open");
  }
};
