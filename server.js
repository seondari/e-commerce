const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, "data");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

function writeJson(filename, data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// 1. Ambil daftar produk
app.get("/api/products", (req, res) => {
  res.json(readJson("products.json"));
});

// 2. Registrasi akun baru -> tersimpan di data/users.json
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua kolom wajib diisi." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = readJson("users.json");

  if (users.some(u => u.email === cleanEmail)) {
    return res.status(400).json({ message: "Email sudah terdaftar." });
  }

  users.push({ name: name.trim(), email: cleanEmail, password });
  writeJson("users.json", users);
  res.json({ message: "Registrasi berhasil!" });
});

// 3. Login user -> cek dari data/users.json
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = (email || "").trim().toLowerCase();
  const users = readJson("users.json");

  const user = users.find(u => u.email === cleanEmail && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Email atau password salah." });
  }

  res.json({ user: { name: user.name, email: user.email } });
});

// 4. Buat pesanan baru (Checkout) -> tersimpan di data/orders.json
app.post("/api/orders", (req, res) => {
  const order = req.body;
  const orders = readJson("orders.json");
  orders.push(order);
  writeJson("orders.json", orders);
  res.json({ message: "Pesanan berhasil disimpan di server!", order });
});

// 5. Ambil riwayat pesanan milik user berdasarkan email
app.get("/api/orders/:email", (req, res) => {
  const email = req.params.email.trim().toLowerCase();
  const orders = readJson("orders.json");
  const userOrders = orders.filter(o => (o.email || "").toLowerCase() === email);
  res.json(userOrders);
});

// 6. Batalkan / hapus pesanan berdasarkan ID
app.delete("/api/orders/:id", (req, res) => {
  const orderId = req.params.id;
  let orders = readJson("orders.json");
  orders = orders.filter(o => o.id !== orderId);
  writeJson("orders.json", orders);
  res.json({ message: "Pesanan berhasil dibatalkan." });
});

app.listen(PORT, () => {
  console.log(`Server Backend Toko Kita aktif di http://localhost:${PORT}`);
});