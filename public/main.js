let currentActiveElement = null;
let currentActiveLang = "html";
let authMode = "login";

let uiElements = [];

const menuStyles = [
  {
    key: "button",
    baseText: "🔘 Buttonlar",
    activeText: "🟢 🔘 Buttonlar",
    title: "Buttonlar",
    desc: "Zamonaviy tugmalar to'plami",
  },
  {
    key: "loader",
    baseText: "⏳ Loaderlar",
    activeText: "🟢 ⏳ Loaderlar",
    title: "Loaderlar",
    desc: "Yuklanish effektlari",
  },
  {
    key: "input",
    baseText: "⌨️ Inputlar",
    activeText: "🟢 ⌨️ Inputlar",
    title: "Inputlar",
    desc: "Ajoyib matn kiritish maydonlari",
  },
  {
    key: "modal",
    baseText: "🪟 Modallar",
    activeText: "🟢 🪟 Modallar",
    title: "Modallar",
    desc: "Oyna va dialoglar dizayni",
  },
  {
    key: "card",
    baseText: "𗂂 Kartalar",
    activeText: "🟢 𗂂 Kartalar",
    title: "Kartalar",
    desc: "Kontent uchun zamonaviy bloklar",
  },
  {
    key: "saved",
    baseText: "⭐ Saqlanganlar",
    activeText: "🟢 ⭐ Saqlanganlar",
    title: "Saqlanganlar",
    desc: "Siz saqlagan shaxsiy elementlar ro'yxati",
  },
];

const landingPage = document.getElementById("landingPage");
const mainDashboard = document.getElementById("mainDashboard");
const authModal = document.getElementById("authModal");
const authModalTitle = document.getElementById("authModalTitle");
const authForm = document.getElementById("authForm");
const authUsername = document.getElementById("authUsername");
const authPassword = document.getElementById("authPassword");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authError = document.getElementById("authError");
const authEmailGroup = document.getElementById("emailFormGroup");
const authEmailInput = document.getElementById("authEmail");

const sidebarItems = document.querySelectorAll(".sidebar__item");
const contentTitle = document.querySelector(".content__header h2");
const contentDesc = document.querySelector(".content__header p");
const elementsGrid = document.getElementById("elementsGrid");
const searchInput = document.getElementById("searchInput");

const createModal = document.getElementById("createModal");
const openCreateModalBtn = document.getElementById("openCreateModalBtn");
const closeCreateBtn = document.getElementById("closeCreateBtn");
const createElementForm = document.getElementById("createElementForm");

const codeModal = document.getElementById("codeModal");
const closeCodeBtn = document.getElementById("closeCodeBtn");
const modalElementPreview = document.getElementById("modalElementPreview");
const codeDisplay = document.getElementById("codeDisplay");
const modalCopyBtn = document.getElementById("modalCopyBtn");
const tabButtons = document.querySelectorAll(".uiverse-tabs .tab-btn");

const headerSaveBtn = document.getElementById("headerSaveBtn");
const profilKonteyner = document.getElementById("profil-konteyner");
const profileDropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");
const modalSaveBtn = document.getElementById("modalSaveBtn");
const copyNotice = document.getElementById("copyNotice");

function openAuth(mode) {
  authMode = mode;
  authError.style.display = "none";
  authForm.reset();

  const existingConfirmField = document.getElementById("confirmPasswordGroup");
  if (existingConfirmField) existingConfirmField.remove();

  if (mode === "login") {
    authModalTitle.innerText = "Tizimga Kirish";
    authSubmitBtn.innerText = "Kirish";
    if (authEmailGroup) authEmailGroup.style.display = "none";
    if (authEmailInput) authEmailInput.required = false;
  } else {
    authModalTitle.innerText = "Yangi Hisob Yaratish";
    authSubmitBtn.innerText = "Hisob yaratish ✨";
    if (authEmailGroup) authEmailGroup.style.display = "block";
    if (authEmailInput) authEmailInput.required = true;

    const confirmGroup = document.createElement("div");
    confirmGroup.className = "form-group";
    confirmGroup.id = "confirmPasswordGroup";
    confirmGroup.innerHTML = `
      <label for="authConfirmPassword">Parolni tasdiqlang</label>
      <input type="password" id="authConfirmPassword" required />
    `;
    authForm.insertBefore(confirmGroup, authError);
  }
  authModal.classList.add("active");
}

document
  .getElementById("showLoginBtn")
  ?.addEventListener("click", () => openAuth("login"));
document
  .getElementById("showRegisterBtn")
  ?.addEventListener("click", () => openAuth("register"));
document
  .getElementById("exploreBtn")
  ?.addEventListener("click", () => openAuth("login"));
document
  .getElementById("closeAuthBtn")
  ?.addEventListener("click", () => authModal.classList.remove("active"));

authForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = authUsername.value.trim();
  const password = authPassword.value;

  if (username === "suxroberkinov438@gmail.com" && password === "Suxrob09*.") {
    const adminData = {
      username: "Suxrob",
      email: "suxroberkinov438@gmail.com",
    };
    localStorage.setItem("activeUser", JSON.stringify(adminData));
    authModal.classList.remove("active");
    window.location.href = "dashboard.html";
    return;
  }

  if (authMode === "register") {
    const confirmPassword = document.getElementById(
      "authConfirmPassword",
    )?.value;
    if (password !== confirmPassword) {
      authError.innerText = "Kiritilgan parollar bir-biriga mos kelmadi! ❌";
      authError.style.display = "block";
      return;
    }
  }

  const endpoint = authMode === "login" ? "/api/login" : "/api/register";
  const emailVal = authEmailInput ? authEmailInput.value.trim() : "";

  try {
    const payload =
      authMode === "login"
        ? { username, password }
        : { username, email: emailVal, password };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      authError.innerText = data.error || "Xatolik yuz berdi!";
      authError.style.display = "block";
      return;
    }

    if (authMode === "login") {
      localStorage.setItem(
        "activeUser",
        JSON.stringify({ username: data.username, email: data.email || "" }),
      );
      authModal.classList.remove("active");
      checkSession();
    } else {
      alert(
        "Hisobingiz muvaffaqiyatli yaratildi! Profilingiz bilan tizimga kiring.",
      );
      openAuth("login");
    }
  } catch (err) {
    localStorage.setItem(
      "activeUser",
      JSON.stringify({ username: username, email: "user@example.com" }),
    );
    authModal.classList.remove("active");
    checkSession();
  }
});

function renderElements(categoryFilter = "button", searchQuery = "") {
  if (!elementsGrid) return;
  elementsGrid.innerHTML = "";

  const urlParams = new URLSearchParams(window.location.search);
  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));

  const isAdminMode =
    urlParams.get("mode") === "admin" &&
    sessionUser &&
    sessionUser.email === "suxroberkinov438@gmail.com";

  const activeMenuIndex = parseInt(
    localStorage.getItem("activeMenuIndex") || "0",
  );
  const isSavedPage = categoryFilter === "saved" || activeMenuIndex === 5;

  const customElements =
    JSON.parse(localStorage.getItem("customUiElements")) || [];
  const allCurrentElements = [...uiElements, ...customElements];

  let displayElements = [];
  if (isSavedPage) {
    displayElements = JSON.parse(localStorage.getItem("savedElements")) || [];
  } else {
    displayElements = allCurrentElements.filter(
      (item) =>
        item.category === categoryFilter &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (displayElements.length === 0) {
    elementsGrid.innerHTML = `<p style="color: #72789f; grid-column: 1/-1; text-align: center; padding-top: 20px;">Hech narsa topilmadi...</p>`;
    return;
  }

  displayElements.forEach((item) => {
    const card = document.createElement("div");
    card.className = "element-card";
    const uniqueCardId = "card_preview_" + item.id;

    let leftButtonHtml = "";
    if (isAdminMode) {
      leftButtonHtml = `<button class="admin-delete-btn" style="background: #ff007c; color: #fff; border: none; padding: 0 15px; font-size: 13px; font-weight: 700; cursor: pointer; height: 36px; border-radius: 6px; transition: 0.2s; box-shadow: 0 0 10px rgba(255, 0, 124, 0.4);">O'chirish 🗑️</button>`;
    } else if (isSavedPage) {
      leftButtonHtml = `<button class="delete-card-btn" style="background: transparent; color: #ff007c; border: 1px solid rgba(255, 0, 124, 0.2); padding: 0 15px; font-size: 13px; font-weight: 500; cursor: pointer; height: 36px; border-radius: 6px; transition: all 0.2s;">O'chirish 🗑️</button>`;
    } else {
      leftButtonHtml = `<button class="save-card-btn" style="background: transparent; color: #72789f; border: none; padding: 0; font-size: 14px; font-weight: 500; cursor: pointer; height: 36px; transition: color 0.2s;">Saqlash ⭐</button>`;
    }

    card.innerHTML = `
      <div class="element-preview" id="${uniqueCardId}">
        ${item.html}
        <style>${item.css || ""}</style>
      </div>
      <div class="element-footer">
        ${leftButtonHtml}
        <button class="copy-btn">Kodni olish</button>
      </div>
    `;

    if (item.js && item.js.trim() !== "") {
      setTimeout(() => {
        try {
          const cardScope = document.getElementById(uniqueCardId);
          if (cardScope) {
            const runUserJs = new Function(
              "container",
              `try { ${item.js} } catch(e) { console.error(e); }`,
            );
            runUserJs(cardScope);
          }
        } catch (err) {}
      }, 50);
    }

    card
      .querySelector(".copy-btn")
      .addEventListener("click", () => openCodeModal(item));

    if (isAdminMode) {
      card.querySelector(".admin-delete-btn")?.addEventListener("click", () => {
        let currentCustoms =
          JSON.parse(localStorage.getItem("customUiElements")) || [];
        currentCustoms = currentCustoms.filter((el) => el.id !== item.id);
        localStorage.setItem(
          "customUiElements",
          JSON.stringify(currentCustoms),
        );

        let savedItems =
          JSON.parse(localStorage.getItem("savedElements")) || [];
        savedItems = savedItems.filter((el) => el.id !== item.id);
        localStorage.setItem("savedElements", JSON.stringify(savedItems));

        alert("Element muvaffaqiyatli o'chirildi! 🗑️");
        renderElements(categoryFilter, searchQuery);
      });
    } else {
      if (isSavedPage) {
        card
          .querySelector(".delete-card-btn")
          ?.addEventListener("click", () => toggleSaveElement(item));
      } else {
        const saveBtn = card.querySelector(".save-card-btn");
        saveBtn?.addEventListener(
          "mouseover",
          () => (saveBtn.style.color = "#ff007c"),
        );
        saveBtn?.addEventListener(
          "mouseout",
          () => (saveBtn.style.color = "#72789f"),
        );
        saveBtn?.addEventListener("click", () => toggleSaveElement(item));
      }
    }

    elementsGrid.appendChild(card);
  });
}

function checkSession() {
  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));
  const currentFilename = window.location.pathname.split("/").pop();

  // 1. Agar foydalanuvchi tizimga mutlaqo kirmagan bo'lsa
  if (!sessionUser) {
    if (currentFilename === "dashboard.html") {
      window.location.href = "index.html";
      return;
    }

    if (landingPage) landingPage.style.display = "flex";
    if (mainDashboard) mainDashboard.style.display = "none";
    if (headerSaveBtn) headerSaveBtn.style.display = "none";

    // O'G'RILIKDAN HIMOYA: Agar foydalanuvchi kirmagan bo'lsa, tugmani aniq yashiramiz!
    if (openCreateModalBtn) openCreateModalBtn.style.display = "none";
    return;
  }

  // 2. Agar foydalanuvchi tizimga kirgan bo'lsa, lekin u ADMIN bo'lmasa
  const isRealAdmin = sessionUser.email === "suxroberkinov438@gmail.com";

  if (currentFilename === "dashboard.html" && !isRealAdmin) {
    window.location.href = "index.html";
    return;
  }

  // 3. Agar hamma tekshiruvlardan muvaffaqiyatli o'tsa, asosiy oynalarni ochamiz
  if (landingPage) landingPage.style.display = "none";
  if (mainDashboard) mainDashboard.style.display = "block";
  if (headerSaveBtn) headerSaveBtn.style.display = "inline-block";

  // 🔒 TUGMANI FAQAT VA FAQAT ASIL ADMIN UCHUN KO'RSATISH MANTIQI:
  if (openCreateModalBtn) {
    if (isRealAdmin) {
      openCreateModalBtn.style.display = "inline-block"; // Faqat Suxrobga ko'rinadi
      openCreateModalBtn.onclick = () => {
        window.location.href = "dashboard.html";
      };
    } else {
      openCreateModalBtn.style.display = "none"; // Oddiy kirgan foydalanuvchilarga ham yashiriladi!
    }
  }

  if (profilKonteyner) {
    profilKonteyner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.04); padding: 5px 15px; border-radius: 20px; border: 1px solid #00f3ff; box-shadow: 0 0 10px rgba(0, 243, 255, 0.25); cursor: pointer;">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${sessionUser.username}" alt="Avatar" style="width: 26px; height: 26px; border-radius: 50%; background: #0b0c10; border: 2px solid #ff007c;">
        <span style="color: #00ff99; font-weight: bold; font-size: 14px;">${sessionUser.username}</span>
        <span style="color: #72789f; font-size: 10px; margin-left: 2px;">▼</span>
      </div>
    `;
  }

  const savedIndex = localStorage.getItem("activeMenuIndex");
  updateContent(savedIndex !== null ? parseInt(savedIndex) : 0);
}

document.addEventListener("click", () => {
  if (profileDropdown) profileDropdown.style.display = "none";
});

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  window.location.reload();
});

function toggleSaveElement(item) {
  let savedItems = JSON.parse(localStorage.getItem("savedElements")) || [];
  const index = savedItems.findIndex((el) => el.id === item.id);

  if (index === -1) {
    savedItems.push(item);
    localStorage.setItem("savedElements", JSON.stringify(savedItems));
    alert("Element muvaffaqiyatli saqlandi! ⭐");
  } else {
    savedItems.splice(index, 1);
    localStorage.setItem("savedElements", JSON.stringify(savedItems));
    alert("Element saqlanganlardan olib tashlandi.");
  }

  const activeIndex = parseInt(localStorage.getItem("activeMenuIndex") || "0");
  if (activeIndex === 5) {
    renderElements("saved", searchInput.value);
  }
}

function openCodeModal(item) {
  currentActiveElement = item;
  currentActiveLang = "html";

  tabButtons.forEach((btn) => btn.classList.remove("active"));
  const initialActiveTab = document.querySelector(
    ".uiverse-tabs [data-lang='html']",
  );
  if (initialActiveTab) initialActiveTab.classList.add("active");

  if (modalElementPreview) {
    modalElementPreview.innerHTML = `${item.html}<style>${item.css || ""}</style>`;
  }
  if (codeDisplay) {
    codeDisplay.innerText = item.html || "HTML kod mavjud emas";
  }

  if (copyNotice) copyNotice.style.display = "none";
  codeModal?.classList.add("active");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentActiveElement) return;
    const lang = button.getAttribute("data-lang");
    if (!lang) return;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    currentActiveLang = lang;
    if (codeDisplay) {
      codeDisplay.innerText = currentActiveElement[lang] || "Kod mavjud emas";
    }
    if (copyNotice) copyNotice.style.display = "none";
  });
});

modalCopyBtn?.addEventListener("click", () => {
  if (!currentActiveElement) return;
  const codeText = currentActiveElement[currentActiveLang] || "";

  navigator.clipboard.writeText(codeText).then(() => {
    if (copyNotice) {
      copyNotice.style.display = "inline-block";
      setTimeout(() => {
        if (copyNotice) copyNotice.style.display = "none";
      }, 2000);
    }
  });
});

modalSaveBtn?.addEventListener("click", () => {
  if (currentActiveElement) toggleSaveElement(currentActiveElement);
});

closeCodeBtn?.addEventListener("click", () =>
  codeModal?.classList.remove("active"),
);

function updateContent(index) {
  sidebarItems.forEach((el, idx) => {
    if (menuStyles[idx]) {
      el.classList.remove("active");
      el.innerText = menuStyles[idx].baseText;
    }
  });

  if (sidebarItems[index] && menuStyles[index]) {
    sidebarItems[index].classList.add("active");
    sidebarItems[index].innerText = menuStyles[index].activeText;
    if (contentTitle) contentTitle.innerText = menuStyles[index].title;
    if (contentDesc) contentDesc.innerText = menuStyles[index].desc;

    localStorage.setItem("activeMenuIndex", index);
    renderElements(menuStyles[index].key, searchInput ? searchInput.value : "");
  }
}

sidebarItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    updateContent(index);
  });
});

searchInput?.addEventListener("input", (e) => {
  const activeIndex = parseInt(localStorage.getItem("activeMenuIndex") || "0");
  if (menuStyles[activeIndex]) {
    renderElements(menuStyles[activeIndex].key, e.target.value);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  const urlParams = new URLSearchParams(window.location.search);
  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));
  const isRealAdmin =
    sessionUser && sessionUser.email === "suxroberkinov438@gmail.com";

  // Agar URL'da ?mode=admin bo'lsa
  if (urlParams.get("mode") === "admin") {
    if (!isRealAdmin) {
      // Hackerlik qilmoqchi bo'lgan odamni toza index.html ga otib yuboramiz
      window.location.href = "index.html";
      return;
    }

    const activeIndex = parseInt(
      localStorage.getItem("activeMenuIndex") || "0",
    );
    const categories = ["button", "loader", "input", "modal", "card", "saved"];
    renderElements(categories[activeIndex], "");
  }
});
