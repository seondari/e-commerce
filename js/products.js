async function loadProducts() {
  const list = document.getElementById("product-list");
  try {
    const res = await fetch("../data/products.json");
    const products = await res.json();

    list.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.category}</p>
          <p class="price">Rp ${p.price.toLocaleString("id-ID")}</p>
        </div>
      </div>
    `).join("");
  } catch (err) {
    list.innerHTML = "<p>Gagal memuat produk.</p>";
    console.error(err);
  }
}

loadProducts();