const savedElementsGrid = document.getElementById("savedElementsGrid");
const codeModal = document.getElementById("codeModal");
const closeCodeBtn = document.getElementById("closeCodeBtn");
const modalElementPreview = document.getElementById("modalElementPreview");
const codeDisplay = document.getElementById("codeDisplay");
const modalCopyBtn = document.getElementById("modalCopyBtn");
const tabButtons = document.querySelectorAll(".uiverse-tabs .tab-btn");
const copyNotice = document.getElementById("copyNotice");

let currentActiveElement = null;
let currentActiveLang = "html";

function renderSavedPage() {
  savedElementsGrid.innerHTML = "";
  const savedItems = JSON.parse(localStorage.getItem("savedElements")) || [];

  if (savedItems.length === 0) {
    savedElementsGrid.innerHTML = `
      <p style="color: #72789f; grid-column: 1/-1; text-align: center; padding-top: 40px; font-size: 16px; font-weight: 600;">
        Sizda hali saqlangan elementlar mavjud emas... 🌌
      </p>`;
    return;
  }

  savedItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "element-card";

    card.innerHTML = `
      <div class="element-preview">
        ${item.html}
        <style>${item.css || ""}</style>
      </div>
      <div class="element-footer">
        <button class="delete-card-btn">
          O'chirish 🗑️
        </button>
        <button class="copy-btn">
          Kodni olish
        </button>
      </div>
    `;

    card.querySelector(".copy-btn").addEventListener("click", () => {
      openSavedCodeModal(item);
    });

    card.querySelector(".delete-card-btn").addEventListener("click", () => {
      removeElementFromSaved(item.id);
    });

    savedElementsGrid.appendChild(card);
  });
}

function openSavedCodeModal(item) {
  currentActiveElement = item;
  currentActiveLang = "html";

  tabButtons.forEach((btn) => btn.classList.remove("active"));
  const htmlTab = document.querySelector(".uiverse-tabs [data-lang='html']");
  if (htmlTab) htmlTab.classList.add("active");

  modalElementPreview.innerHTML = `${item.html}<style>${item.css || ""}</style>`;
  codeDisplay.innerText = item.html || "HTML kod mavjud emas";

  if (copyNotice) copyNotice.style.display = "none";
  codeModal.classList.add("active");
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentActiveElement) return;
    const lang = button.getAttribute("data-lang");
    if (!lang) return;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    currentActiveLang = lang;
    codeDisplay.innerText =
      currentActiveElement[lang] || "Ushbu tilda kod kiritilmagan.";
    if (copyNotice) copyNotice.style.display = "none";
  });
});

modalCopyBtn.addEventListener("click", () => {
  if (!currentActiveElement) return;
  const textToCopy = currentActiveElement[currentActiveLang] || "";

  navigator.clipboard.writeText(textToCopy).then(() => {
    if (copyNotice) {
      copyNotice.style.display = "inline-block";
      setTimeout(() => {
        if (copyNotice) copyNotice.style.display = "none";
      }, 2000);
    }
  });
});

function removeElementFromSaved(id) {
  let savedItems = JSON.parse(localStorage.getItem("savedElements")) || [];
  savedItems = savedItems.filter((el) => el.id !== id);
  localStorage.setItem("savedElements", JSON.stringify(savedItems));
  renderSavedPage();
}

closeCodeBtn.addEventListener("click", () => {
  codeModal.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", renderSavedPage);
