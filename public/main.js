import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPANXxcst3YgWr1hFTia8RTeQgHRAhEZM",
  authDomain: "animix-ui.firebaseapp.com",
  projectId: "animix-ui",
  storageBucket: "animix-ui.firebasestorage.app",
  messagingSenderId: "153931486089",
  appId: "1:153931486089:web:d8d423ca1efec24077c758",
  measurementId: "G-F3KME3GDQY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentActiveElement = null;
let currentActiveLang = "html";
let authMode = "login";
let uiElements = [];

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
    desc: "Oyna va dialoglar dizayn",
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
const copyNotice = document.getElementById("copyNotice");

async function loginWithGoogle() {
  try {
    if (authError) authError.style.display = "none";
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const googleUserData = {
      username: user.displayName || user.email.split("@")[0],
      email: user.email,
    };
    localStorage.setItem("activeUser", JSON.stringify(googleUserData));
    authModal?.classList.remove("active");
    window.location.reload();
  } catch (err) {
    console.error("Google orqali kirishda xatolik:", err);
    if (authError) {
      authError.innerText = "Google orqali kirish muvaffaqiyatsiz tugadi!";
      authError.style.display = "block";
    }
  }
}

async function loadElementsFromServer() {
  try {
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

createElementForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("elName")?.value;
  const category = document.getElementById("elCategory")?.value;
  const html = document.getElementById("elHtml")?.value;
  const css = document.getElementById("elCss")?.value;
  const js = document.getElementById("elJs")?.value || "";

  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!sessionUser || sessionUser.email !== "suxroberkinov438@gmail.com") {
    alert("Sizda element qo'shish huquqi yo'q! Admin profil bilan kiring.");
    return;
  }

  const payload = { name, category, html, css, js, email: sessionUser.email };

  try {
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

closeCreateBtn?.addEventListener("click", () =>
  createModal?.classList.remove("active"),
);
closeCodeBtn?.addEventListener("click", () =>
  codeModal?.classList.remove("active"),
);

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
        .addEventListener("click", async () => {
          if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
            try {
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

function checkSession() {
  const sessionUser = JSON.parse(localStorage.getItem("activeUser"));

  if (!sessionUser) {
    // Landing page ko'rsat
    if (landingPage) {
      landingPage.style.display = "flex";
      landingPage.style.visibility = "visible";
      landingPage.style.opacity = "1";
    }
    if (mainDashboard) {
      mainDashboard.style.display = "none";
      mainDashboard.style.visibility = "hidden";
    }
    if (headerSaveBtn) headerSaveBtn.style.display = "none";
    if (openCreateModalBtn) openCreateModalBtn.style.display = "none";
    return;
  }

  // Dashboard ko'rsat
  const isRealAdmin = sessionUser.email === "suxroberkinov438@gmail.com";

  if (landingPage) {
    landingPage.style.display = "none";
    landingPage.style.visibility = "hidden";
  }
  if (mainDashboard) {
    mainDashboard.style.display = "block";
    mainDashboard.style.visibility = "visible";
    mainDashboard.style.opacity = "1";
  }
  if (headerSaveBtn) headerSaveBtn.style.display = "inline-block";
  if (openCreateModalBtn)
    openCreateModalBtn.style.display = isRealAdmin ? "inline-block" : "none";

  if (profilKonteyner) {
    profilKonteyner.innerHTML = `
      <div id="profileTrigger" style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.04); padding: 5px 15px; border-radius: 20px; border: 1px solid #00f3ff; box-shadow: 0 0 10px rgba(0, 243, 255, 0.25); cursor: pointer;">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${sessionUser.username}" alt="Avatar" style="width: 26px; height: 26px; border-radius: 50%; background: #0b0c10; border: 2px solid #ff007c;">
        <span style="color: #00ff99; font-weight: bold; font-size: 14px;">${sessionUser.username}</span>
        <span style="color: #72789f; font-size: 10px; margin-left: 2px;">▼</span>
      </div>
    `;

    document
      .getElementById("profileTrigger")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown?.classList.toggle("active");
      });
  }

  const savedIndex = localStorage.getItem("activeMenuIndex");
  updateContent(savedIndex !== null ? parseInt(savedIndex) : 0);
}

logoutBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  localStorage.removeItem("activeUser");
  localStorage.removeItem("activeMenuIndex");
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
  if (activeIndex === 5) renderElements("saved", searchInput.value);
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("animix-cyber-bg");
  if (!container) return;
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const totalNodesCount = 350;
  const nodes = [];
  let mouse = { x: undefined, y: undefined, radius: 220 };
  let rippleWaves = [];

  class OrbitNode {
    constructor() {
      this.pctX = Math.random();
      this.pctY = Math.random();
      this.orbitRadius = Math.random() * 14 + 6;
      this.angle = Math.random() * Math.PI * 2;
      this.orbitSpeed =
        (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
      this.x = this.pctX * width;
      this.y = this.pctY * height;
      this.radius = 1.4;
    }
    get currentBaseX() {
      return this.pctX * width;
    }
    get currentBaseY() {
      return this.pctY * height;
    }

    update() {
      this.angle += this.orbitSpeed;
      let currentOrbitX =
        this.currentBaseX + Math.cos(this.angle) * this.orbitRadius;
      let currentOrbitY =
        this.currentBaseY + Math.sin(this.angle) * this.orbitRadius;
      let targetX = currentOrbitX;
      let targetY = currentOrbitY;

      if (mouse.x !== undefined && mouse.y !== undefined) {
        let dx = mouse.x - currentOrbitX;
        let dy = mouse.y - currentOrbitY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let superShiftX = (dx / dist) * force * 140 * (dist / mouse.radius);
          let superShiftY = (dy / dist) * force * 140 * (dist / mouse.radius);
          targetX += superShiftX;
          targetY += superShiftY;
        }
      }

      for (let w = 0; w < rippleWaves.length; w++) {
        let wave = rippleWaves[w];
        let wDx = this.x - wave.x;
        let wDy = this.y - wave.y;
        let wDist = Math.sqrt(wDx * wDx + wDy * wDy);
        if (wDist < wave.radius && wDist > wave.radius - wave.wavelength) {
          let fade = 1 - wave.radius / wave.maxRadius;
          let angle = ((wDist - wave.radius) / wave.wavelength) * Math.PI * 2;
          let waveForce = Math.sin(angle) * wave.amplitude * fade;
          if (wDist > 0) {
            targetX += (wDx / wDist) * waveForce;
            targetY += (wDy / wDist) * waveForce;
          }
        }
      }
      this.x += (targetX - this.x) * 0.2;
      this.y += (targetY - this.y) * 0.2;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 243, 255, 0.4)";
      ctx.fill();
    }
  }

  for (let i = 0; i < totalNodesCount; i++) nodes.push(new OrbitNode());

  setInterval(() => {
    let isMobile = width < 768;
    rippleWaves.push({
      x: width / 2,
      y: height / 2,
      radius: 0,
      maxRadius: Math.max(width, height) * (isMobile ? 0.9 : 1.3),
      speed: isMobile ? 10 : 12,
      amplitude: isMobile ? 40 : 60,
      wavelength: isMobile ? 80 : 120,
    });
  }, 3000);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    mouse.radius = width < 768 ? 130 : 220;
  });
  window.addEventListener("mousemove", (e) => {
    if (width < 768 && e.movementX === 0 && e.movementY === 0) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });
  window.addEventListener("mousedown", (e) => {
    let isMobile = width < 768;
    rippleWaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: Math.max(width, height) * (isMobile ? 0.8 : 1.2),
      speed: isMobile ? 12 : 14,
      amplitude: isMobile ? 35 : 55,
      wavelength: isMobile ? 70 : 100,
    });
  });

  function render() {
    ctx.fillStyle = "#03040a";
    ctx.fillRect(0, 0, width, height);
    for (let w = rippleWaves.length - 1; w >= 0; w--) {
      rippleWaves[w].radius += rippleWaves[w].speed;
      if (rippleWaves[w].radius > rippleWaves[w].maxRadius)
        rippleWaves.splice(w, 1);
    }
    let currentConnectionDist = width < 768 ? 75 : 95;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < currentConnectionDist) {
          let alpha = (1 - dist / currentConnectionDist) * 0.07;
          ctx.beginPath();
          if (mouse.x !== undefined && mouse.y !== undefined) {
            let mDx = mouse.x - nodes[i].x;
            let mDy = mouse.y - nodes[i].y;
            let mDist = Math.sqrt(mDx * mDx + mDy * mDy);
            if (mDist < mouse.radius) {
              alpha = (1 - dist / currentConnectionDist) * 0.25;
              let isTight = mDist < mouse.radius * 0.4;
              ctx.strokeStyle = isTight
                ? `rgba(255, 0, 124, ${alpha})`
                : `rgba(0, 243, 255, ${alpha})`;
              ctx.lineWidth = isTight ? 0.6 : 0.4;
            } else {
              ctx.strokeStyle = `rgba(114, 120, 159, ${alpha * 0.5})`;
              ctx.lineWidth = 0.3;
            }
          } else {
            ctx.strokeStyle = `rgba(0, 243, 255, ${alpha * 0.4})`;
            ctx.lineWidth = 0.3;
          }
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
});

document.addEventListener("DOMContentLoaded", () => {
  const features = [
    "Takrorlanmas Buttonlar",
    "Eng zor Yuklanish animatsiyalari",
    "Maftunkor Inputlar",
    "Eng chiroyli Modallar",
    "Kontrastli Kartalar",
    "Jozibali Formlar",
  ];
  let featureIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const featureElement = document.getElementById("dynamic-feature-text");

  function typeFeatures() {
    if (!featureElement) return;
    const currentFeature = features[featureIndex];
    if (isDeleting) {
      featureElement.innerText = currentFeature.substring(0, charIndex - 1);
      charIndex--;
    } else {
      featureElement.innerText = currentFeature.substring(0, charIndex + 1);
      charIndex++;
    }
    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === currentFeature.length) {
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      featureIndex = (featureIndex + 1) % features.length;
      speed = 400;
    }
    setTimeout(typeFeatures, speed);
  }
  typeFeatures();
});

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

document.addEventListener("click", () => {
  profileDropdown?.classList.remove("active");
});
openCreateModalBtn?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  loadElementsFromServer();

  const googleBtn = document.getElementById("googleAuthBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await loginWithGoogle();
    });
  }
});
