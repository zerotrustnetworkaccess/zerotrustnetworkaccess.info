const subscribeButton = document.querySelectorAll(".subscription");
const closePopup = document.getElementById("close-popup");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const body = document.getElementsByTagName("body")[0];

subscribeButton.forEach(
  (el) =>
    (el.onclick = async () => {
      const url =
        "https://enclave-networks.activehosted.com/proc.php?u=8&f=8&s=&c=0&m=0&act=sub&v=2&or=99d0a5901dfe9737d4076db8322acd47&email=ivan.s@dashbouquet.com&jsonp=true";
      // const data = { username: 'example' };

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Ответ сети был не ok.");
        }

        const json = await response();
        console.log("Успех:", JSON.stringify(json));
        overlay.style.display = "block";
        popup.style.display = "block";
        body.style.overflowY = "hidden";
      } catch (error) {
        console.error("Ошибка:", error);
      }
    })
);

closePopup.onclick = (e) => {
  overlay.style.display = "none";
  popup.style.display = "none";
  body.style.overflowY = "auto";
};
