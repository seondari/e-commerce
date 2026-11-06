let allProducts = [];

function rupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function getWishLocal() {
  try {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch {
    return [];
  }
}

function checkWish(id) {
  return getWishLocal().includes(Number(id));
}

function handleWish(id, btn) {
  const numId = Number(id);
  let list = getWishLocal();
  const exists = list.includes(numId);

  if (exists) {
    list = list.filter(item => item !== numId);
    if (window.showToast) showToast("Dihapus dari wishlist");
  } else {
    list.push(numId);
    if (window.showToast) showToast("Ditambahkan ke wishlist");
  }

  localStorage.setItem("wishlist", JSON.stringify(list));
  if (window.updateWishlistBadge) updateWishlistBadge();

  const active = !exists;
  const icon = btn.querySelector("i");
  if (icon) {
    icon.className = (active ? "fa-solid" : "fa-regular") + " fa-heart";
    icon.style.color = active ? "var(--danger)" : "";
  }
}

function cardHTML(p) {
  const wished = checkWish(p.id);
  return `
    <div class="product-card">
      <a href="product-detail.html?id=${p.id}" class="card-link">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="info">
          <span class="tag">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="price">${rupiah(p.price)}</p>
        </div>
      </a>
      <div style="display:flex; border-top:1px solid var(--border);">
        <button class="btn" style="flex:1;" onclick="addToCart(${p.id})">
          <i class="fa-solid fa-cart-plus"></i> Tambah
        </button>
        <button type="button" class="icon-btn" style="margin:0; border:none; border-radius:0; width:46px; height:auto;" onclick="handleWish(${p.id}, this)" title="Tambah ke Wishlist">
          <i class="${wished ? "fa-solid" : "fa-regular"} fa-heart" style="${wished ? "color:var(--danger);" : ""}"></i>
        </button>
      </div>
    </div>`;
}

function applyFilters() {
  const list = document.getElementById("product-list");
  const q = document.getElementById("search").value.trim().toLowerCase();
  const cat = document.getElementById("category").value;
  const sort = document.getElementById("sort").value;

  const result = allProducts.filter(p =>
    (cat === "all" || p.category === cat) &&
    (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  );

  if (sort === "low") result.sort((a, b) => a.price - b.price);
  if (sort === "high") result.sort((a, b) => b.price - a.price);
  if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));

  document.getElementById("result-count").textContent = result.length + " produk";
  list.innerHTML = result.length
    ? result.map(cardHTML).join("")
    : '<p class="empty"><i class="fa-regular fa-face-frown"></i> Produk tidak ditemukan.</p>';
}

async function loadProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;
  try {
    const res = await fetch("../data/products.json");
    allProducts = await res.json();

    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById("category").innerHTML =
      '<option value="all">Semua kategori</option>' +
      cats.map(c => `<option value="${c}">${c}</option>`).join("");

    ["search", "category", "sort"].forEach(id =>
      document.getElementById(id).addEventListener("input", applyFilters));
    applyFilters();
  } catch (err) {
    list.innerHTML = "<p>Gagal memuat produk.</p>";
    console.error(err);
  }
}

async function loadDetail() {
  const box = document.getElementById("product-detail");
  if (!box) return;
  const id = Number(new URLSearchParams(location.search).get("id"));
  try {
    const res = await fetch("../data/products.json");
    const products = await res.json();
    const p = products.find(x => x.id === id);

    if (!p) {
      box.innerHTML = "<p>Produk tidak ditemukan.</p>";
      return;
    }

    const wished = checkWish(p.id);
    box.innerHTML = `
      <div>
        <a href="products.html" class="back"><i class="fa-solid fa-arrow-left"></i> Kembali ke produk</a><br>
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="detail-info">
        <span class="tag">${p.category}</span>
        <h2>${p.name}</h2>
        <p class="price">${rupiah(p.price)}</p>
        <p>${p.description}</p>
        <div style="display:flex; gap:10px; align-items:center; margin-top:16px;">
          <button class="btn" style="margin-top:0;" onclick="addToCart(${p.id})">
            <i class="fa-solid fa-cart-plus"></i> Tambah ke Keranjang
          </button>
          <button type="button" class="icon-btn" style="width:44px; height:44px; border-radius:10px; margin:0;" onclick="handleWish(${p.id}, this)" title="Tambah ke Wishlist">
            <i class="${wished ? "fa-solid" : "fa-regular"} fa-heart" style="${wished ? "color:var(--danger);" : ""}"></i>
          </button>
        </div>
      </div>`;
  } catch (err) {
    box.innerHTML = "<p>Gagal memuat produk.</p>";
    console.error(err);
  }
}

loadProducts();
loadDetail();