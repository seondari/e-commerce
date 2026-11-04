async function loadProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;
  try {
    const res = await fetch("../data/products.json");
    const products = await res.json();

    list.innerHTML = products.map(p => `
      <a class="product-card" href="product-detail.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.category}</p>
          <p class="price">Rp ${p.price.toLocaleString("id-ID")}</p>
        </div>
      </a>
    `).join("");
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
      <img src="${p.image}" alt="${p.name}">
      <div class="detail-info">
        <h2>${p.name}</h2>
        <p>${p.category}</p>
        <p class="price">Rp ${p.price.toLocaleString("id-ID")}</p>
        <p>${p.description}</p>
        <button class="btn" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
      </div>
    `;
  } catch (err) {
    box.innerHTML = "<p>Gagal memuat produk.</p>";
    console.error(err);
  }
}

loadProducts();
loadDetail();