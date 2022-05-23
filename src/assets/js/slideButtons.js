const buttonRight = document.getElementById("slideRight");
const buttonLeft = document.getElementById("slideLeft");

if (buttonRight) {
  buttonRight.onclick = function () {
    document.getElementById("container").scrollLeft += 200;
  };
}

if (buttonLeft) {
  buttonLeft.onclick = function () {
    document.getElementById("container").scrollLeft -= 200;
  };
}
