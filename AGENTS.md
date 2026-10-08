# AGENT INSTRUCTIONS & WORKSPACE RULES

> **MỤC TIÊU CỐT LÕI (CORE MISSION):** Tối ưu hóa tốc độ xử lý, giải quyết vấn đề nhanh gọn. Tuyệt đối **KHÔNG** mở browser tự động để test giao diện. Toàn bộ quá trình kiểm thử phải được thực hiện **NGẦM (HEADLESS / CLI)**.

---

## 🚫 1. QUY TẮC BẮT BUỘC: BỎ QUA TEST MỞ BROWSER (NO BROWSER TESTING)

* **TUYỆT ĐỐI KHÔNG GỌI `browser_subagent`**:
  * Không mở trình duyệt web ảo, không chụp ảnh màn hình giao diện, không ghi video thao tác WebP sau khi viết code.
  * Việc mở browser subagent gây chậm trễ từ 1 - 3 phút, tiêu tốn tài nguyên và làm gián đoạn trải nghiệm của người dùng.
  * **Ngoại lệ duy nhất:** Chỉ sử dụng browser subagent khi người dùng có **yêu cầu trực tiếp rõ ràng** (ví dụ: *"hãy mở browser chụp ảnh màn hình cho tôi xem"*).

---

## ⚡ 2. KIỂM THỬ NGẦM SIÊU TỐC (HEADLESS & FAST VERIFICATION)

Mọi hoạt động kiểm tra tính đúng đắn của code phải được thực hiện ngầm bằng Terminal / CLI với tốc độ dưới 1-2 giây:

### 2.1. Kiểm tra cú pháp (Syntax Check):
* **JavaScript / Node.js:** Sử dụng `node --check <filename>` hoặc `node -c <filename>` để bắt ngay lỗi cú pháp mà không cần chạy toàn bộ ứng dụng.
* **JSON:** Sử dụng `node -e "JSON.parse(fs.readFileSync('filename'))"`.
* **HTML / CSS:** Rà soát tính đóng/mở thẻ, tính hợp lệ của class và cú pháp CSS trực tiếp trong code.
* **Python (nếu có):** Sử dụng `python -m py_compile <filename>`.

### 2.2. Kiểm tra Server & Endpoint ngầm:
* Xác minh server đang phản hồi bằng HTTP request ngầm (thời gian thực hiện <500ms):
  ```bash
  node -e "const http = require('http'); http.get('http://localhost:3000', r => console.log('Status:', r.statusCode)).on('error', e => console.error(e.message));"
  ```
  hoặc PowerShell:
  ```powershell
  Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 3
  ```

### 2.3. Kiểm tra hàm & logic nghiệp vụ:
* Chạy trực tiếp qua Node REPL / script nhỏ dạng one-liner:
  ```bash
  node -e "const myModule = require('./myModule'); console.log(myModule.myFunction());"
  ```

---

## 🛠️ 3. QUY TRÌNH LÀM VIỆC CỦA AGENT (AGENT WORKFLOW)

1. **Hiểu vấn đề (Understand):** Đọc kỹ yêu cầu người dùng, xác định chính xác các file liên quan.
2. **Thực thi chính xác (Execute):** Viết / sửa code đúng trọng tâm, giữ nguyên cấu trúc và code hiện có không liên quan.
3. **Test ngầm tốc độ cao (Headless Test):** Chạy `node --check` hoặc HTTP check ngầm qua terminal.
4. **Phản hồi ngay lập tức (Report):** Báo cáo kết quả ngắn gọn, súc tích cho người dùng kèm link clickable dẫn tới file đã sửa. Không bắt người dùng phải chờ đợi những bước không cần thiết.

---

## 📌 CRITICAL RULE FOR ALL AI AGENTS
> **NEVER spawn browser subagents or open GUI browsers for automated testing unless explicitly requested by the user. Always test headlessly via terminal commands (syntax checks, curl/HTTP requests, or unit scripts) to ensure maximum speed and instant delivery.**
