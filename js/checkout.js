async function initCheckout() {
  const summary = document.getElementById("checkout-summary");
  if (!summary) return;

  const user = getCurrentUser();
  if (!user) {
    alert("Silakan login dulu untuk checkout.");
    location.href = "login.html?next=checkout.html";
    return;
  }
  document.getElementById("c-name").value = user.name;

  const cart = getCart();
  const area = document.getElementById("checkout-area");
  if (cart.length === 0) {
    area.innerHTML = '<p>Keranjang kosong. <a href="products.html">Belanja dulu</a>.</p>';
    return;
  }

  let items = [];
  let total = 0;
  try {
    const res = await fetch("../data/products.json");
    const products = await res.json();
    items = cart.map(c => {
      const p = products.find(x => x.id === c.id);
      return p ? { id: p.id, name: p.name, price: p.price, qty: c.qty } : null;
    }).filter(Boolean);
    total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    summary.innerHTML = items.map(i => `
      <div class="summary-row">
        <span>${i.name} x ${i.qty}</span>
        <span>Rp ${(i.price * i.qty).toLocaleString("id-ID")}</span>
      </div>`).join("");
    document.getElementById("checkout-total").textContent = "Rp " + total.toLocaleString("id-ID");
  } catch (err) {
    summary.innerHTML = "<p>Gagal memuat ringkasan pesanan.</p>";
    console.error(err);
    return;
  }

  document.getElementById("checkout-form").addEventListener("submit", async e => {
    e.preventDefault();
    const order = {
      id: "ORD-" + Date.now(),
      email: user.email,
      name: document.getElementById("c-name").value.trim(),
      phone: document.getElementById("c-phone").value.trim(),
      address: document.getElementById("c-address").value.trim(),
      payment: document.getElementById("c-payment").value,
      items,
      total,
      date: new Date().toISOString(),
      status: "Diproses"
    };

    // 1. Simpan ke localStorage
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem("orders")) || []; } catch {}
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // 2. Simpan juga ke Backend Server (data/orders.json)
    try {
      await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
    } catch {}

    saveCart([]);

    area.innerHTML = `
      <div class="success">
        <h2>Pesanan Berhasil!</h2>
        <p>Nomor pesanan: <strong>${order.id}</strong></p>
        <p style="margin-top:8px;">
          <a href="orders.html" class="btn">Lihat Riwayat Pesanan</a>
          <a href="products.html" class="btn">Lanjut Belanja</a>
        </p>
      </div>`;
  });
}

initCheckout();