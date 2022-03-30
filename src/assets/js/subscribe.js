const subscribeButton = document.getElementById("subscription");
const closePopup = document.getElementById("close-popup");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");

subscribeButton.onclick = () => {
  overlay.style.display = "block";
  popup.style.display = "block";
};

closePopup.onclick = () => {
  overlay.style.display = "none";
  popup.style.display = "none";
};
