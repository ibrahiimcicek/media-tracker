const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Bir önceki adımda oluşturduğumuz model

// 🟢 KAYIT OL (REGISTER)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Bu e-posta ile daha önce kayıt olunmuş mu?
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Bu e-posta zaten kullanımda." });

    // 2. Şifreyi Güvenli Hale Getir (Hash'le)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Yeni Kullanıcıyı Veritabanına Kaydet
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu!" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});

// 🔵 GİRİŞ YAP (LOGIN)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Veritabanında böyle bir kullanıcı var mı?
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    // 2. Şifre Doğru mu? (Kullanıcının girdiği ile veritabanındaki hash'lenmiş şifreyi karşılaştır)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Geçersiz şifre." });

    // 3. Şifre doğruysa Dijital Kimlik Kartını (JWT Token) oluştur
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, // .env dosyanızdaki mühür
      { expiresIn: '1d' } // Token 1 gün geçerli olsun
    );

    // 4. Giriş Başarılı! Token'ı ve kullanıcı bilgilerini Frontend'e gönder
    res.status(200).json({ 
        token, 
        user: { id: user._id, username: user.username, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});

module.exports = router;