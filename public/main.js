let currentActiveElement = null;
let currentActiveLang = "html";
let authMode = "login";
let uiElements = [];

// API uchun asosiy backend manzili (Render servering manzili)
const BACKEND_URL = "https://animix-ui.onrender.com";

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

// --- BACKENDDAN DATA YUKLASH ---
async function loadElementsFromServer() {
  try {
    // To'liq URL manziliga o'zgartirildi
    const response = await fetch(`${BACKEND_URL}/api/elements`);
    if (response.ok) {
      uiElements = await response.json();
      const activeIndex = parseInt(
        localStorage.getItem("activeMenuIndex") || "0",
      );
      renderElements(
        menuStyles[activeIndex].key,
        searchInput ? searchInput.value : "",
      );
    }
  } catch (err) {
    console.error("Ma'lumot yuklashda xatolik:", err);
  }
}

// --- ADMIN FORM: ELEMENT QO'SHISH INTEGRATSIYASI ---
createElementForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("elementName")?.value;
  const category = document.getElementById("elementCategory")?.value;
  const html = document.getElementById("elementHtml")?.value;
  const css = document.getElementById("elementCss")?.value;
  const js = document.getElementById("elementJs")?.value || "";

  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));

  if (!sessionUser || sessionUser.email !== "suxroberkinov438@gmail.com") {
    alert("Sizda element qo'shish huquqi yo'q! Admin profil bilan kiring.");
    return;
  }

  const payload = { name, category, html, css, js, email: sessionUser.email };

  try {
    // To'liq URL manziliga o'zgartirildi
    const response = await fetch(`${BACKEND_URL}/api/elements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Element muvaffaqiyatli bazaga saqlandi va hammaga ko'rindi! 🎉");
      createElementForm.reset();
      createModal?.classList.remove("active");
      await loadElementsFromServer();
    } else {
      alert("Server xatoligi: " + (data.error || "Qo'shib bo'lmadi"));
    }
  } catch (err) {
    console.error(err);
    alert("Serverga ulanishda texnik xatolik!");
  }
});

// --- MODAL BOSHQARIUVI ---
openCreateModalBtn?.addEventListener("click", () =>
  createModal?.classList.add("active"),
);
closeCreateBtn?.addEventListener("click", () =>
  createModal?.classList.remove("active"),
);
closeCodeBtn?.addEventListener("click", () =>
  codeModal?.classList.remove("active"),
);

// --- AUTH OYNASI ---
function openAuth(mode) {
  authMode = mode;
  if (authError) authError.style.display = "none";
  authForm?.reset();

  const existingConfirmField = document.getElementById("confirmPasswordGroup");
  if (existingConfirmField) existingConfirmField.remove();

  if (mode === "login") {
    if (authModalTitle) authModalTitle.innerText = "Tizimga Kirish";
    if (authSubmitBtn) authSubmitBtn.innerText = "Kirish";
    if (authEmailGroup) authEmailGroup.style.display = "none";
    if (authEmailInput) authEmailInput.required = false;
  } else {
    if (authModalTitle) authModalTitle.innerText = "Yangi Hisob Yaratish";
    if (authSubmitBtn) authSubmitBtn.innerText = "Hisob yaratish ✨";
    if (authEmailGroup) authEmailGroup.style.display = "block";
    if (authEmailInput) authEmailInput.required = true;

    const confirmGroup = document.createElement("div");
    confirmGroup.className = "form-group";
    confirmGroup.id = "confirmPasswordGroup";
    confirmGroup.innerHTML = `
      <label for="authConfirmPassword">Parolni tasdiqlang</label>
      <input type="password" id="authConfirmPassword" required />
    `;
    if (authForm && authError) authForm.insertBefore(confirmGroup, authError);
  }
  authModal?.classList.add("active");
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
  ?.addEventListener("click", () => authModal?.classList.remove("active"));

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
    authModal?.classList.remove("active");
    window.location.reload();
    return;
  }

  if (authMode === "register") {
    const confirmPassword = document.getElementById(
      "authConfirmPassword",
    )?.value;
    if (password !== confirmPassword) {
      if (authError) {
        authError.innerText = "Kiritilgan parollar bir-biriga mos kelmadi! ❌";
        authError.style.display = "block";
      }
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

    // To'liq URL manziliga o'zgartirildi
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      if (authError) {
        authError.innerText = data.error || "Xatolik yuz berdi!";
        authError.style.display = "block";
      }
      return;
    }

    if (authMode === "login") {
      localStorage.setItem(
        "activeUser",
        JSON.stringify({ username: data.username, email: data.email || "" }),
      );
      authModal?.classList.remove("active");
      checkSession();
    } else {
      alert(
        "Hisobingiz muvaffaqiyatli yaratildi! Profilingiz bilan tizimga kiring.",
      );
      openAuth("login");
    }
  } catch (err) {
    console.error(err);
  }
});

// --- COMPONENTLARNI RENDER QILISH ---
function renderElements(categoryFilter = "button", searchQuery = "") {
  if (!elementsGrid) return;
  elementsGrid.innerHTML = "";

  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));
  const isAdminMode =
    sessionUser && sessionUser.email === "suxroberkinov438@gmail.com";

  const activeMenuIndex = parseInt(
    localStorage.getItem("activeMenuIndex") || "0",
  );
  const isSavedPage = categoryFilter === "saved" || activeMenuIndex === 5;

  let displayElements = [];
  if (isSavedPage) {
    displayElements = JSON.parse(localStorage.getItem("savedElements")) || [];
  } else {
    displayElements = uiElements.filter(
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
    const uniqueCardId = "card_preview_" + item._id;

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
      card
        .querySelector(".admin-delete-btn")
        ?.addEventListener("click", async () => {
          if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
            try {
              // To'liq URL manziliga o'zgartirildi
              const response = await fetch(
                `${BACKEND_URL}/api/elements/${item._id}`,
                {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: sessionUser.email }),
                },
              );
              if (response.ok) {
                alert("Element o'chirildi!");
                await loadElementsFromServer();
              }
            } catch (err) {
              console.error(err);
            }
          }
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

// --- SESSIYANI TEKSHIRISH ---
function checkSession() {
  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));

  if (!sessionUser) {
    if (landingPage) landingPage.style.display = "flex";
    if (mainDashboard) mainDashboard.style.display = "none";
    if (headerSaveBtn) headerSaveBtn.style.display = "none";
    if (openCreateModalBtn) openCreateModalBtn.style.display = "none";
    return;
  }

  const isRealAdmin = sessionUser.email === "suxroberkinov438@gmail.com";

  if (landingPage) landingPage.style.display = "none";
  if (mainDashboard) mainDashboard.style.display = "block";
  if (headerSaveBtn) headerSaveBtn.style.display = "inline-block";

  if (openCreateModalBtn) {
    openCreateModalBtn.style.display = isRealAdmin ? "inline-block" : "none";
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

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  window.location.reload();
});

function toggleSaveElement(item) {
  let savedItems = JSON.parse(localStorage.getItem("savedElements")) || [];
  const index = savedItems.findIndex((el) => el._id === item._id);

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

  if (modalElementPreview)
    modalElementPreview.innerHTML = `${item.html}<style>${item.css || ""}</style>`;
  if (codeDisplay) codeDisplay.innerText = item.html || "Kod yo'q";
  if (copyNotice) copyNotice.style.display = "none";
  codeModal?.classList.add("active");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentActiveElement) return;
    const lang = button.getAttribute("data-lang");
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentActiveLang = lang;
    if (codeDisplay)
      codeDisplay.innerText = currentActiveElement[lang] || "Kod yo'q";
  });
});

modalCopyBtn?.addEventListener("click", () => {
  if (!currentActiveElement) return;
  navigator.clipboard
    .writeText(currentActiveElement[currentActiveLang] || "")
    .then(() => {
      if (copyNotice) {
        copyNotice.style.display = "inline-block";
        setTimeout(() => {
          if (copyNotice) copyNotice.style.display = "none";
        }, 2000);
      }
    });
});

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
  renderElements(menuStyles[activeIndex].key, e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  loadElementsFromServer();
});
