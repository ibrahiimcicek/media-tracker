// backend/models/Media.js
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['Movie', 'Book', 'Game'], // Sadece bu türler kabul edilir
    required: true 
  },
  status: { 
    type: String, 
    enum: ['To Do', 'In Progress', 'Completed'], 
    default: 'To Do' 
  },
  rating: { 
    type: Number, 
    min: 0, 
    max: 10,
    default: 0
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true }); // Kayıt ve güncelleme tarihini otomatik tutar

module.exports = mongoose.model('Media', MediaSchema);