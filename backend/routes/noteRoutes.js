const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// GET /api/notes - Lấy danh sách toàn bộ ghi chú, sắp xếp mới nhất lên đầu
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// POST /api/notes - Tạo ghi chú mới dựa trên dữ liệu gửi lên từ req.body
router.post('/notes', async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;

    // Validate bắt buộc title
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title là trường bắt buộc' });
    }

    const newNote = new Note({
      title: title.trim(),
      content: content || '',
      isPinned: Boolean(isPinned)
    });

    const savedNote = await newNote.save();
    return res.status(201).json(savedNote);
  } catch (error) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
});

module.exports = router;

