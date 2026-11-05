const CART_KEY = "cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  if (window.updateCartBadge) updateCartBadge();
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  showToast("Produk ditambahkan ke keranjang");
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart();
}

async function renderCart() {
  const box = document.getElementById("cart-items");
  if (!box) return; // halaman ini bukan halaman keranjang

  const totalEl = document.getElementById("cart-total");
  const cart = getCart();

  if (cart.length === 0) {
    box.innerHTML = "<p>Keranjang masih kosong.</p>";
    totalEl.textContent = "Rp 0";
    return;
  }

  try {
    const res = await fetch("../data/products.json");
    const products = await res.json();
    let total = 0;

    box.innerHTML = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      if (!p) return "";
      const subtotal = p.price * item.qty;
      total += subtotal;
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-info">
            <h3>${p.name}</h3>
            <p class="price">Rp ${p.price.toLocaleString("id-ID")}</p>
          </div>
          <div class="cart-qty">
            <button onclick="changeQty(${p.id}, -1)"><i class="fa-solid fa-minus"></i></button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)"><i class="fa-solid fa-plus"></i></button>
          </div>
          <p class="subtotal">Rp ${subtotal.toLocaleString("id-ID")}</p>
          <button class="remove" onclick="removeItem(${p.id})"><i class="fa-solid fa-trash"></i></button>        </div>`;
    }).join("");

    totalEl.textContent = "Rp " + total.toLocaleString("id-ID");
  } catch (err) {
    box.innerHTML = "<p>Gagal memuat keranjang.</p>";
    console.error(err);
  }
}

renderCart();