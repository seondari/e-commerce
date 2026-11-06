function rupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function getWishItems() {
  try {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch {
    return [];
  }
}

function removeFromWishlistPage(id) {
  const numId = Number(id);
  const updated = getWishItems().filter(item => Number(item) !== numId);
  localStorage.setItem("wishlist", JSON.stringify(updated));
  if (window.updateWishlistBadge) updateWishlistBadge();
  if (window.showToast) showToast("Dihapus dari wishlist");
  renderWishlist();
}

async function renderWishlist() {
  const box = document.getElementById("wishlist-items");
  if (!box) return;

  const ids = getWishItems().map(Number);
  if (ids.length === 0) {
    box.innerHTML = `<p class="empty"><i class="fa-regular fa-heart"></i> Wishlist masih kosong. <a href="products.html" style="color:var(--price);font-weight:600;">Cari produk</a>.</p>`;
    return;
  }

  try {
    const res = await fetch("../data/products.json");
    const products = await res.json();
    const items = products.filter(p => ids.includes(Number(p.id)));

    if (items.length === 0) {
      box.innerHTML = `<p class="empty">Wishlist masih kosong.</p>`;
      return;
    }

    box.innerHTML = items.map(p => `
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
            <i class="fa-solid fa-cart-plus"></i> + Keranjang
          </button>
          <button class="remove" style="border-radius:0; padding:0 14px;" onclick="removeFromWishlistPage(${p.id})" title="Hapus dari Wishlist">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `).join("");
  } catch (err) {
    box.innerHTML = "<p>Gagal memuat wishlist.</p>";
    console.error(err);
  }
}

renderWishlist();