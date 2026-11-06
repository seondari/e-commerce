const API_BASE = "http://localhost:3000/api";

async function fetchProductsData() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) return await res.json();
  } catch {}
  const inPages = location.pathname.includes("/pages/");
  const fallbackRes = await fetch((inPages ? "../" : "") + "data/products.json");
  return await fallbackRes.json();
}

function getWishlist() {
  try {
    return (JSON.parse(localStorage.getItem("wishlist")) || []).map(Number);
  } catch {
    return [];
  }
}

function isWishlisted(id) {
  return getWishlist().includes(Number(id));
}

function toggleWishlist(id) {
  const numId = Number(id);
  let list = getWishlist();
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
  return !exists;
}