const closePopup = document.querySelectorAll("#close-popup");
const overlay = document.getElementById("overlay");
const popUpOk = document.getElementById("popup-ok");
const popUpError = document.getElementById("popup-error");
const body = document.getElementsByTagName("body")[0];

const bodyForm = document.getElementById("body-subscription");
const footerForm = document.getElementById("footer-subscription");

const handleError = () => {
  overlay.style.display = "block";
  popUpError.style.display = "block";
  body.style.overflowY = "hidden";
};

const _show_thank_you = (code, msg, link, mail) => {
  console.log(msg);
  overlay.style.display = "block";
  popUpOk.style.display = "block";
  body.style.overflowY = "hidden";
};

const _show_error = (code, msg) => {
  console.log(msg);
  handleError();
};

function subscribe(e) {
  e.preventDefault();
  let mail;
  (function getMail() {
    document.getElementById("body-form-mail")
      ? (mail = document.getElementById("body-form-mail").value)
      : (mail = document.getElementById("footer-form-mail").value);
  })();

  let subscriptionScript = document.createElement("script");
  subscriptionScript.src = `https://enclave-networks.activehosted.com/proc.php?u=8&f=8&s=&c=0&m=0&act=sub&v=2&or=99d0a5901dfe9737d4076db8322acd47&email=${mail}&jsonp=true`;
  document.body.appendChild(subscriptionScript);

  subscriptionScript.onerror = function () {
    handleError();
  };
}
if (bodyForm) {
  bodyForm.addEventListener("submit", subscribe);
}

footerForm.addEventListener("submit", subscribe);

closePopup.forEach(
  (el) =>
    (el.onclick = () => {
      overlay.style.display = "none";
      popUpOk.style.display = "none";
      popUpError.style.display = "none";
      body.style.overflowY = "auto";
    })
);
