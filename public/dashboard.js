(function () {
  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));
  const isRealAdmin =
    sessionUser && sessionUser.email === "suxroberkinov438@gmail.com";

  if (!isRealAdmin) {
    window.location.replace("index.html");
  }
})();

const BACKEND_URL = "https://animix-ui.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const adminCreateForm = document.getElementById("adminCreateForm");
  const submitMessage = document.getElementById("submitMessage");

  if (adminCreateForm) {
    adminCreateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validatsiya
      const name = document.getElementById("adminElName").value.trim();
      const category = document.getElementById("adminElCategory").value;
      const html = document.getElementById("adminElHtml").value.trim();
      const css = document.getElementById("adminElCss").value.trim();
      const js = document.getElementById("adminElJs").value.trim();

      if (!name || !html || !css) {
        showMessage("Barcha maydonlar to'ldirilishi shart! ❌", "error");
        return;
      }

      const sessionUser = JSON.parse(localStorage.getItem("activeUser"));

      const payload = {
        name: name,
        category: category,
        html: html,
        css: css,
        js: js,
        email: sessionUser.email,
      };

      try {
        // Tugmani disable qilish
        const submitBtn = adminCreateForm.querySelector(".add-component-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Yuborilmoqda...";

        const response = await fetch(`${BACKEND_URL}/api/elements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          showMessage("Element muvaffaqiyatli bazaga qo'shildi! ✅", "success");
          adminCreateForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = "Elementni Ro'yxatga Qo'shish ✨";

          // 2 sekunddan keyin sahifani yangilash
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          showMessage(
            "Xatolik: " + (data.error || "Element qo'shib bo'lmadi!"),
            "error",
          );
          submitBtn.disabled = false;
          submitBtn.textContent = "Elementni Ro'yxatga Qo'shish ✨";
        }
      } catch (err) {
        console.error("Error:", err);
        showMessage(
          "Serverga ulanishda xatolik! Internetni tekshiring.",
          "error",
        );
        const submitBtn = adminCreateForm.querySelector(".add-component-btn");
        submitBtn.disabled = false;
        submitBtn.textContent = "Elementni Ro'yxatga Qo'shish ✨";
      }
    });
  }

  // Message ko'rsatish funksiyasi
  function showMessage(text, type) {
    if (!submitMessage) return;

    submitMessage.textContent = text;
    submitMessage.className = `submit-message ${type}`;

    if (type === "success") {
      setTimeout(() => {
        submitMessage.className = "submit-message";
      }, 5000);
    }
  }
});
