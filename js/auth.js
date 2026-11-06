const USERS_KEY = "users";
const SESSION_KEY = "currentUser";
const AUTH_API = "http://localhost:3000/api";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function showMsg(text) {
  const el = document.getElementById("form-msg");
  if (el) el.textContent = text;
}

async function register(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (password.length < 6) return showMsg("Password minimal 6 karakter.");
  if (password !== confirm) return showMsg("Konfirmasi password tidak sama.");

  try {
    const res = await fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) return showMsg(data.message || "Gagal mendaftar.");

    alert("Registrasi berhasil! Data tersimpan di server. Silakan login.");
    location.href = "login.html";
  } catch {
    // Fallback ke localStorage jika server.js sedang mati
    const users = getUsers();
    if (users.some(u => u.email === email)) return showMsg("Email sudah terdaftar.");
    users.push({ name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    alert("Registrasi berhasil! Silakan login.");
    location.href = "login.html";
  }
}

async function login(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return showMsg(data.message || "Email atau password salah.");

    localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
    const next = new URLSearchParams(location.search).get("next") || "";
    location.href = /^[a-z-]+\.html$/.test(next) ? next : "../index.html";
  } catch {
    // Fallback ke localStorage jika server.js sedang mati
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) return showMsg("Email atau password salah.");
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
    const next = new URLSearchParams(location.search).get("next") || "";
    location.href = /^[a-z-]+\.html$/.test(next) ? next : "../index.html";
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  location.reload();
}

document.getElementById("register-form")?.addEventListener("submit", register);
document.getElementById("login-form")?.addEventListener("submit", login);