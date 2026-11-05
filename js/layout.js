(function () {
  const THEME_KEY = "shopTheme";
  const inPages = location.pathname.includes("/pages/");
  const root = inPages ? "../" : "";
  const pages = inPages ? "" : "pages/";

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Tema (diterapkan segera supaya tidak berkedip) ----------
  function getTheme() {
    try {
      const t = localStorage.getItem(THEME_KEY);
      if (t === "dark" || t === "light") return t;
    } catch {}
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
  }
  applyTheme(getTheme());

  // ---------- Font Awesome ----------
  const fa = document.createElement("link");
  fa.rel = "stylesheet";
  fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
  document.head.appendChild(fa);

  // ---------- Helper ----------
  function getUser() {
    try { return JSON.parse(localStorage.getItem("currentUser")); }
    catch { return null; }
  }

  function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    let count = 0;
    try {
      count = (JSON.parse(localStorage.getItem("cart")) || [])
        .reduce((sum, i) => sum + i.qty, 0);
    } catch {}
    badge.textContent = count;
    badge.hidden = count === 0;
  }
  window.updateCartBadge = updateCartBadge;

  function showToast(msg, type) {
    let box = document.getElementById("toast-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast-box";
      document.body.appendChild(box);
    }
    const t = document.createElement("div");
    t.className = "toast " + (type || "success");
    t.innerHTML = '<i class="fa-solid ' +
      (type === "error" ? "fa-circle-xmark" : "fa-circle-check") + '"></i><span></span>';
    t.querySelector("span").textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add("hide"), 2200);
    setTimeout(() => t.remove(), 2600);
  }
  window.showToast = showToast;

  function paintToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.innerHTML = dark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    btn.title = dark ? "Ganti ke tema terang" : "Ganti ke tema gelap";
  }

  // ---------- Navbar & footer ----------
  function render() {
    const user = getUser();

    const nav = document.querySelector("nav.navbar");
    if (nav) {
      nav.innerHTML = `
        <a href="${root}index.html" class="logo"><i class="fa-solid fa-bag-shopping"></i> Toko Kita</a>
        <ul>
          <li><a href="${root}index.html"><i class="fa-solid fa-house"></i> Beranda</a></li>
          <li><a href="${pages}products.html"><i class="fa-solid fa-store"></i> Produk</a></li>
          <li><a href="${pages}cart.html"><i class="fa-solid fa-cart-shopping"></i> Keranjang <span id="cart-badge" class="badge" hidden>0</span></a></li>
          <li>${user
            ? `<a href="#" id="logout-link"><i class="fa-solid fa-right-from-bracket"></i> Logout (${esc(user.name)})</a>`
            : `<a href="${pages}login.html"><i class="fa-solid fa-right-to-bracket"></i> Login</a>`}</li>
          <li><button id="theme-toggle" class="icon-btn" type="button" aria-label="Ganti tema"></button></li>
        </ul>`;

      document.getElementById("theme-toggle").addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch {}
        paintToggle();
      });

      const out = document.getElementById("logout-link");
      if (out) out.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        location.href = root + "index.html";
      });
    }

    const foot = document.querySelector("footer");
    if (foot) {
      foot.innerHTML = `
        <div class="footer-links">
          <span><i class="fa-solid fa-truck-fast"></i> Pengiriman cepat</span>
          <span><i class="fa-solid fa-shield-halved"></i> Pembayaran aman</span>
          <span><i class="fa-solid fa-headset"></i> Layanan pelanggan</span>
        </div>
        <p>&copy; 2026 Toko Kita - Tugas Pemrograman Web</p>`;
    }

    updateCartBadge();
    paintToggle();
  }

  document.addEventListener("DOMContentLoaded", render);
})();