const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Atlas ulanishi
const MONGO_URI =
  "mongodb+srv://suxroberkinov438_db_user:g7H0iKjPZS5zS4oc@animixcluster.gk2nwfg.mongodb.net/animixDB?retryWrites=true&w=majority&appName=AnimixCluster";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("🔥 Global MongoDB Atlas muvaffaqiyatli ulandi!"))
  .catch((err) => console.error("❌ Bazaga ulanishda xatolik:", err));

// Sxemalar
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  savedElements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Element" }],
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

const elementSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["button", "loader", "input", "modal", "card"],
  },
  html: { type: String, required: true },
  css: { type: String, required: true },
  js: { type: String, default: "" },
  author: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now },
});
const Element = mongoose.model("Element", elementSchema);

// --- API ROUTES ---

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Barcha maydonlarni to'ldiring!" });

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res.status(400).json({ error: "Bu username yoki email band!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      savedElements: [],
    });
    await newUser.save();

    res.status(201).json({ message: "Ro'yxatdan muvaffaqiyatli o'tdingiz!" });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik yuz berdi." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user)
      return res.status(400).json({ error: "Foydalanuvchi topilmadi!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Parol noto'g'ri!" });

    res.json({
      message: "Xush kelibsiz!",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Serverda xatolik yuz berdi." });
  }
});

app.get("/api/elements", async (req, res) => {
  try {
    const elements = await Element.find().sort({ createdAt: -1 });
    res.json(elements);
  } catch (error) {
    res.status(500).json({ error: "Elementlarni yuklashda xatolik." });
  }
});

app.post("/api/elements", async (req, res) => {
  try {
    const { name, category, html, css, js, email } = req.body;
    if (email !== "suxroberkinov438@gmail.com")
      return res.status(403).json({ error: "Sizda huquq yo'q!" });

    const newElement = new Element({ name, category, html, css, js: js || "" });
    await newElement.save();
    res
      .status(201)
      .json({ message: "Yangi komponent saqlandi!", element: newElement });
  } catch (error) {
    res.status(500).json({ error: "Elementni saqlashda xatolik." });
  }
});

app.delete("/api/elements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    if (email !== "suxroberkinov438@gmail.com")
      return res.status(403).json({ error: "Sizda huquq yo'q!" });

    await Element.findByIdAndDelete(id);
    res.json({ message: "Element o'chirildi!" });
  } catch (error) {
    res.status(500).json({ error: "O'chirishda xatolik." });
  }
});

// --- STATIC ASSETS & FRONTEND PAGES ---
// Render xostingida fayllar to'g'ri ochilishi uchun static assetlar eng pastda yuklanadi
const PUBLIC_PATH = path.join(__dirname, "public");
app.use(express.static(PUBLIC_PATH));

app.get("/dashboard.html", (req, res) =>
  res.sendFile(path.join(PUBLIC_PATH, "dashboard.html")),
);
app.get("/save.html", (req, res) =>
  res.sendFile(path.join(PUBLIC_PATH, "save.html")),
);

// Agar yuqoridagilardan boshqa URL yozilsa (va u api bo'lmasa) index.html ochiladi
app.get(/^\/(?!api).*/, (req, res) =>
  res.sendFile(path.join(PUBLIC_PATH, "index.html")),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
