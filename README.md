# Note App - Quản Lý Ghi Chú

> Dự án full-stack: **Node.js + Express + Mongoose** (Backend) và **React + Vite** (Frontend)

---

## Cấu trúc thư mục

```
d:/Codee/
├── backend/
│   ├── models/
│   │   └── Note.js             <- [Câu 4] Schema Mongoose
│   ├── routes/
│   │   └── noteRoutes.js       <- [Câu 4] GET & POST /api/notes
│   ├── server.js               <- Khởi động Express + kết nối MongoDB
│   ├── .env                    <- Cấu hình MONGO_URI
│   ├── .env.example            <- Hướng dẫn cấu hình
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── NoteApp.jsx         <- [Câu 5] Component React chính
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js          <- Proxy /api -> backend :5000
│   ├── index.html
│   └── package.json
├── start.ps1                   <- Script chạy cả 2 server 1 lần
└── README.md
```

---

## YÊU CẦU: Kết nối MongoDB

MongoDB CHƯA được cài trên máy. Có 2 cách giải quyết:

### Cách 1: MongoDB Atlas (Khuyến nghị - Miễn phí, không cần cài)

1. Truy cập https://cloud.mongodb.com và đăng ký tài khoản
2. Tạo Free Cluster (M0)
3. Vào Database Access -> Tạo user + mật khẩu
4. Vào Network Access -> Add IP: 0.0.0.0/0 (Allow from Anywhere)
5. Vào Clusters -> Connect -> Drivers -> Copy connection string
6. Mở file backend/.env và thay:
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/note_app?retryWrites=true&w=majority

### Cách 2: Cài MongoDB Local

Tải về tại: https://www.mongodb.com/try/download/community

---

## Cách chạy

### Chạy 1 lệnh (tự động mở 2 terminal):
  cd d:\Codee
  .\start.ps1

### Hoặc chạy thủ công (mở 2 PowerShell):

Terminal 1 - Backend:
  cd d:\Codee\backend
  npm start

Terminal 2 - Frontend:
  cd d:\Codee\frontend
  npm run dev

Sau đó mở trình duyệt: http://localhost:5173

---

## API Endpoints

| Method | URL | Mô tả |
|--------|-----|-------|
| GET    | http://localhost:5000/api/notes | Lấy tất cả ghi chú (mới nhất lên đầu) |
| POST   | http://localhost:5000/api/notes | Tạo ghi chú mới |

Body POST (JSON):
{
  "title": "Tiêu đề ghi chú",
  "content": "Nội dung ghi chú",
  "isPinned": false
}
