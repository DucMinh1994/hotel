# Lumière Grand Hotel - 3D Virtual Tour & Hotel Booking Experience

Ứng dụng trải nghiệm thực tế ảo phòng khách sạn 5 sao cao cấp bằng công nghệ **Three.js (WebGL)**, âm thanh tương tác Web Audio API và hiệu ứng chuyển cảnh mượt mà.

---

## 🌟 Tính Năng Nổi Bật

- **Mô phỏng 3D Cửa & Sảnh Ngoài:** Trải nghiệm đứng ngoài hành lang, quẹt thẻ từ mở khóa và bước qua cửa vào trong phòng.
- **Toàn Cảnh 360° Sắc Nét:** Không gian 360 độ chân thực với các góc nhìn chi tiết.
- **Hệ Thống Hotspots Thông Minh:** Các điểm ghim 3D phát sáng trên từng đồ dùng nội thất (Giường ngủ King-Size, TV 4K, Quầy Bar, Bàn làm việc, Cửa sổ panorama...).
- **Khám Phá Phòng Tắm En-Suite:** Nhấp vào cửa phòng tắm để mở cửa bước vào không gian phòng tắm đá cẩm thạch 5 sao với đầy đủ điểm ghim thiết bị (Bồn tắm nằm, Cabin tắm kính, Bàn lavabo, Khăn tắm, Bộ mỹ phẩm).
- **Chuyển Đổi Không Gian & Đổi Phòng:** Hỗ trợ chuyển đổi giữa Phòng 301 (Deluxe Ocean Suite) và Phòng 502 (Royal Sky Suite).
- **Chế Độ Ngày ☀️ / Đêm 🌙:** Thay đổi hệ thống ánh sáng động và màu nền theo thời gian.
- **La Bàn Mini Radar:** Theo dõi hướng xoay camera 360° theo thời gian thực.
- **Bảng Tra Cứu Sản Phẩm & Lightbox:** Xem chi tiết thông số, vật liệu và ảnh chụp thực tế phóng to.
- **Quy Trình Đặt Phòng Khách Sạn:** Form đăng ký đặt phòng, tính tiền tự động và sinh mã đặt chỗ.

---

## 🚀 Cài Đặt & Chạy Cục Bộ

1. Cài đặt các gói phụ thuộc (nếu cần):
   ```bash
   npm install
   ```

2. Khởi chạy server tĩnh:
   ```bash
   npx serve .
   # hoặc
   node server.js
   ```

3. Mở trình duyệt và truy cập `http://localhost:3000`.

---

## 🛠️ Công Nghệ Sử Dụng

- **Three.js** (WebGL 3D Engine)
- **GSAP 3** (Chuyển động camera mượt mà)
- **Web Audio API** (Âm thanh mở cửa, chuông pha lê & nhạc nền thư giãn)
- **HTML5 & Vanilla CSS** (Giao diện chuẩn luxury, dark-mode & glassmorphism)
