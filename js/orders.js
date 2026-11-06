function rupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser"));
  } catch {
    return null;
  }
}

async function fetchUserOrders(email) {
  const cleanEmail = (email || "").trim().toLowerCase();
  let serverOrders = [];
  let localOrders = [];

  try {
    const res = await fetch(`http://localhost:3000/api/orders/${encodeURIComponent(cleanEmail)}`);
    if (res.ok) serverOrders = await res.json();
  } catch (err) {
    console.warn("Server backend tidak terhubung:", err);
  }

  try {
    const allLocal = JSON.parse(localStorage.getItem("orders")) || [];
    localOrders = allLocal.filter(o => !o.email || o.email.trim().toLowerCase() === cleanEmail);
  } catch (err) {
    console.warn("Gagal baca localStorage orders:", err);
  }

  const map = new Map();
  [...localOrders, ...serverOrders].forEach(o => {
    if (o && o.id) map.set(o.id, o);
  });
  return Array.from(map.values());
}

async function cancelOrder(id) {
  if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

  try {
    await fetch(`http://localhost:3000/api/orders/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  } catch {}

  try {
    const all = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify(all.filter(o => o.id !== id)));
  } catch {}

  if (window.showToast) showToast("Pesanan berhasil dibatalkan");
  renderOrders();
}

async function renderOrders() {
  const box = document.getElementById("orders-list");
  if (!box) return;

  box.innerHTML = "<p class='muted'>Memuat riwayat pesanan...</p>";

  const user = getLoggedUser();
  if (!user || !user.email) {
    box.innerHTML = `<p class="empty">Silakan <a href="login.html?next=orders.html" style="color:var(--price);font-weight:600;">Login</a> untuk melihat riwayat pesanan.</p>`;
    return;
  }

  const orders = await fetchUserOrders(user.email);
  if (orders.length === 0) {
    box.innerHTML = `<p class="empty">Belum ada riwayat pesanan untuk akun <strong>${user.email}</strong>. <a href="products.html" style="color:var(--price);font-weight:600;">Mulai belanja</a>.</p>`;
    return;
  }

  box.innerHTML = orders.slice().reverse().map(o => `
    <div class="cart-item" style="flex-direction:column; align-items:stretch; gap:10px;">
      <div style="display:flex; justify-content:space-between; flex-wrap:wrap; border-bottom:1px solid var(--border); padding-bottom:8px;">
        <div>
          <strong>#${o.id}</strong>
          <span class="muted" style="font-size:0.85rem; margin-left:8px;">${new Date(o.date).toLocaleString("id-ID")}</span>
        </div>
        <span class="tag" style="background:color-mix(in srgb, var(--primary) 18%, transparent); color:var(--price); font-weight:600;">${o.status || "Diproses"}</span>
      </div>
      <div style="font-size:0.92rem;">
        <p><strong>Penerima:</strong> ${o.name} (${o.phone})</p>
        <p><strong>Alamat:</strong> ${o.address}</p>
        <p><strong>Metode Pembayaran:</strong> ${o.payment}</p>
      </div>
      <div style="border-top:1px dashed var(--border); padding-top:8px;">
        ${(o.items || []).map(i => `
          <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:4px;">
            <span>${i.name} x ${i.qty}</span>
            <span>${rupiah(i.price * i.qty)}</span>
          </div>
        `).join("")}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px;">
        <strong class="price">Total: ${rupiah(o.total)}</strong>
        <button class="remove" onclick="cancelOrder('${o.id}')">
          <i class="fa-solid fa-trash"></i> Batalkan Pesanan
        </button>
      </div>
    </div>
  `).join("");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderOrders);
} else {
  renderOrders();
}