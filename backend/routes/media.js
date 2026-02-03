// backend/routes/media.js
const express = require('express');
const router = express.Router();
const Media = require('../models/Media'); // Model dosyanın yeri doğru olmalı

// 1. TÜM LİSTEYİ GETİR (GET)
// http://localhost:5000/api/media adresine istek gelince çalışır
router.get('/', async (req, res) => {
  try {
    // En yeni eklenen en üstte gelsin diye sort kullanıyoruz
    const mediaList = await Media.find().sort({ createdAt: -1 });
    res.json(mediaList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. YENİ MEDYA EKLE (POST)
router.post('/', async (req, res) => {
  console.log("POST İsteği Geldi:", req.body); // Hata ayıklamak için log

  const { title, type, status, rating, imageUrl } = req.body;

  // Basit doğrulama: Başlık yoksa kaydetme
  if (!title) {
    return res.status(400).json({ message: "Başlık alanı zorunludur!" });
  }

  const newMedia = new Media({
    title,
    type,
    status,
    rating,
    imageUrl
  });

  try {
    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. SİLME (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(req.params.id);
    if (!deletedMedia) {
        return res.status(404).json({ message: "Kayıt bulunamadı" });
    }
    res.json({ message: 'Kayıt başarıyla silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      req.body, // Formdan gelen yeni veriler
      { new: true } // Bize eski halini değil, güncellenmiş halini döndür
    );
    res.json(updatedMedia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;