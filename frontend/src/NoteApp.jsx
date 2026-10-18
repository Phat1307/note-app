import React, { useState, useEffect } from 'react';

// Dùng đường dẫn tương đối /api/notes (vite proxy sẽ forward sang backend :5000)
const API_URL = '/api/notes';

function NoteApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ─── 1. HIỂN THỊ DỮ LIỆU ───────────────────────────────────────────────────
  // useEffect với dependency [] → chỉ chạy 1 lần khi component mount lần đầu
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách ghi chú:', err);
      setError('Không thể kết nối server. Hãy kiểm tra backend đang chạy.');
    } finally {
      setLoading(false);
    }
  };

  // ─── 2. THÊM MỚI DỮ LIỆU ──────────────────────────────────────────────────
  // Gọi POST /api/notes khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim(), content }),
      });

      if (response.ok) {
        const createdNote = await response.json();

        // ─── 3. CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC ─────────────────────────────
        // Prepend ghi chú mới lên đầu mảng state → hiển thị ngay, KHÔNG reload trang
        setNotes((prevNotes) => [createdNote, ...prevNotes]);

        // Reset form về trạng thái trống
        setTitle('');
        setContent('');
      } else {
        const errData = await response.json();
        alert('Lỗi: ' + (errData.message || 'Không thể tạo ghi chú'));
      }
    } catch (err) {
      console.error('Lỗi khi tạo ghi chú:', err);
      alert('Lỗi kết nối. Kiểm tra backend đang chạy.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '640px', margin: '30px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '8px' }}>
        📝 Ứng dụng Quản lý Ghi chú
      </h2>

      {/* ── FORM THÊM MỚI ── */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
            Tiêu đề <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập tiêu đề ghi chú..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
            Nội dung
          </label>
          <textarea
            placeholder="Nhập nội dung ghi chú..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', fontSize: '14px' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          style={{
            padding: '8px 20px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {submitting ? 'Đang lưu...' : 'Thêm Ghi Chú'}
        </button>
      </form>

      {/* ── DANH SÁCH GHI CHÚ ── */}
      <div>
        <h3 style={{ marginBottom: '12px' }}>
          Danh sách ghi chú{' '}
          <span style={{ color: '#666', fontSize: '14px' }}>({notes.length})</span>
        </h3>

        {/* Trạng thái loading */}
        {loading && <p style={{ color: '#666' }}>⏳ Đang tải dữ liệu...</p>}

        {/* Trạng thái lỗi */}
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
            <strong>❌ {error}</strong>
            <button onClick={fetchNotes} style={{ marginLeft: '12px', cursor: 'pointer' }}>
              Thử lại
            </button>
          </div>
        )}

        {/* Danh sách rỗng */}
        {!loading && !error && notes.length === 0 && (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Chưa có ghi chú nào. Hãy thêm mới!</p>
        )}

        {/* Danh sách ghi chú */}
        {!loading && !error && notes.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notes.map((note) => (
              <li
                key={note._id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '12px',
                  backgroundColor: note.isPinned ? '#fffbeb' : '#fff',
                }}
              >
                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>
                  {note.isPinned && <span>📌 </span>}
                  {note.title}
                </h4>
                {note.content && (
                  <p style={{ margin: '0 0 8px 0', color: '#374151', whiteSpace: 'pre-wrap' }}>
                    {note.content}
                  </p>
                )}
                <small style={{ color: '#9ca3af' }}>
                  🕒 {new Date(note.createdAt).toLocaleString('vi-VN')}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NoteApp;
