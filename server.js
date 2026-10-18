const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARES ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api', noteRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Note App API đang chạy 🚀' });
});

// ─── KẾT NỐI DATABASE VÀ KHỞI ĐỘNG SERVER ───────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/note_app';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Đã kết nối MongoDB thành công');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`📋 API GET  : http://localhost:${PORT}/api/notes`);
      console.log(`📋 API POST : http://localhost:${PORT}/api/notes`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    console.error('👉 Hãy chạy MongoDB local hoặc set MONGO_URI trong file .env');
    process.exit(1);
  });
