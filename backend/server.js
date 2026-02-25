const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const authRoutes = require('./routes/auth');
const mediaRoutes = require("./routes/media");

app.use(express.json()); // JSON verilerini okuyabilmek için
app.use("/api/media", mediaRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Bağlantısı
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB bağlantısı başarılı!"))
.catch((err) => console.error("Bağlantı hatası:", err));

// Test Rotası
app.get("/", (req, res) => {
  res.send("Media Tracker API çalışıyor!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda yayında.`);
});
