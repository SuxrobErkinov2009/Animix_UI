(function () {
  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));
  const isRealAdmin =
    sessionUser && sessionUser.email === "suxroberkinov438@gmail.com";

  if (!isRealAdmin) {
    window.location.replace("index.html");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const adminCreateForm = document.getElementById("adminCreateForm");

  if (adminCreateForm) {
    adminCreateForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("adminElName").value;
      const category = document.getElementById("adminElCategory").value;
      const html = document.getElementById("adminElHtml").value;
      const css = document.getElementById("adminElCss").value;
      const js = document.getElementById("adminElJs").value;

      const newElement = {
        id: "el_" + Date.now(), // Unikal ID
        category: category,
        name: name,
        html: html,
        css: css,
        js: js,
        author: "Admin",
      };

      // Brauzer xotirasidan eskilarni olamiz
      let customElements =
        JSON.parse(localStorage.getItem("customUiElements")) || [];
      customElements.push(newElement);

      // Xotiraga qayta yozamiz (bunda ma'lumot hech qayerga yo'qolmaydi)
      localStorage.setItem("customUiElements", JSON.stringify(customElements));

      alert(
        "Komponent muvaffaqiyatli saqlandi! Sahifadan o'tib tekshirishingiz mumkin. ✅",
      );
      adminCreateForm.reset();
    });
  }
});
