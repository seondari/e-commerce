let allProducts = [];

function rupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function cardHTML(p) {
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
      <button class="btn" onclick="addToCart(${p.id})">
        <i class="fa-solid fa-cart-plus"></i> Tambah
      </button>
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
        <button class="btn" onclick="addToCart(${p.id})">
          <i class="fa-solid fa-cart-plus"></i> Tambah ke Keranjang
        </button>
      </div>`;
  } catch (err) {
    box.innerHTML = "<p>Gagal memuat produk.</p>";
    console.error(err);
  }
}

loadProducts();
loadDetail();