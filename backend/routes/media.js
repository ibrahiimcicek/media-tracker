// backend/routes/media.js
const express = require("express");
const router = express.Router();
const Media = require("../models/Media"); // Model dosyanın yeri doğru olmalı
const authMiddleware = require("../middleware/authMiddleware");

// 1. TÜM LİSTEYİ GETİR (GET)
// http://localhost:5000/api/media adresine istek gelince çalışır

//  ADMİN ROTASI: Tüm kullanıcıların medyalarını getir
router.get("/admin/all", async (req, res) => {
  try {
    // Tüm medyaları bul ve 'userId' referansından kullanıcının adını/emailini çek
    // Not: Modelindeki kullanıcı referansının adının 'userId' veya 'user' olduğuna dikkat et.
    const allMedia = await Media.find().populate("userId", "username email");
    res.status(200).json(allMedia);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    const media = await Media.find({ user: req.user.id });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. YENİ MEDYA EKLE (POST)
router.post("/", authMiddleware, async (req, res) => {
  const media = new Media({
    ...req.body,
    user: req.user.id,
  });

  const newMedia = await media.save();
  res.status(201).json(newMedia);
});
// 3. SİLME (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(req.params.id);
    if (!deletedMedia) {
      return res.status(404).json({ message: "Kayıt bulunamadı" });
    }
    res.json({ message: "Kayıt başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      req.body, // Formdan gelen yeni veriler
      { new: true }, // Bize eski halini değil, güncellenmiş halini döndür
    );
    res.json(updatedMedia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
