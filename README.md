# Youtube Learning Assistant - Chrome Extension (Frontend)

## Tổng quan học thuật (Academic Overview)

Đây là lớp giao diện (UI Layer) và là trung tâm điều phối dữ liệu (Data Orchestrator) của hệ thống. Repo này triển khai một Chrome Extension cho phép trích xuất dữ liệu thời gian thực từ DOM của YouTube, xử lý luồng công việc bất đồng bộ (Asynchronous Workflow) và quản lý giao tiếp giữa các nguồn gốc khác nhau (Cross-Origin Communication).

Dự án thể hiện khả năng tối ưu hóa trải nghiệm người dùng (UX) thông qua việc tự động hóa các tác vụ phức tạp: từ trích xuất văn bản đến hiển thị tri thức AI.

---

## Kiến trúc kết nối (System Integration)

Extension này đóng vai trò là **Client-Side Controller**, kết nối trực tiếp với hai dịch vụ Backend riêng biệt:

1. **AI Orchestration (Python - Port 8000):**
* Gửi nội dung Transcript thô sang Python AI Service.
* Nhận về bản phân tích định dạng Markdown để hiển thị cho người dùng.


2. **Data Persistence (C# - Port 5104):**
* Sau khi nhận được kết quả từ AI, Extension tự động chuyển tiếp dữ liệu (Video ID, Title, Summary) sang C# API.
* Điều này đảm bảo dữ liệu được lưu trữ đồng bộ vào MySQL mà không cần sự can thiệp thủ công.


3. **Dashboard Integration:**
* Cung cấp lối tắt truy cập trực tiếp vào Kho tri thức cá nhân (Personal Knowledge Base) được lưu trữ trên server C#.



---

## Công nghệ sử dụng (Tech Stack)

* **Core:** JavaScript (ES6+), HTML5, CSS3.
* **Chrome API:** `chrome.runtime`, `chrome.tabs`, `chrome.scripting`.
* **UI Framework:** Bootstrap 5 (cho giao diện Popup).
* **Content Scripting:** Kỹ thuật DOM Manipulation để trích xuất dữ liệu YouTube.

---

## Hướng dẫn cài đặt chi tiết (Setup Guide)

### 1. Chuẩn bị

* Trình duyệt Google Chrome hoặc các trình duyệt nhân Chromium.
* Đảm bảo hai Backend (Python & C#) đã được khởi chạy.

### 2. Cài đặt Extension vào trình duyệt

1. Tải mã nguồn về máy hoặc `git clone` repo này.
2. Mở Chrome và truy cập đường dẫn: `chrome://extensions/`.
3. Bật **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải.
4. Nhấn nút **Tải tiện ích đã giải nén (Load unpacked)**.
5. Chọn thư mục chứa mã nguồn của Repo này.

### 3. Cách sử dụng

1. Mở một video bất kỳ trên YouTube.
2. Mở phần **Hiện bản ghi lời thoại (Show Transcript)** của YouTube (Bắt buộc để Extension lấy được dữ liệu).
3. Bấm vào biểu tượng Extension và nhấn nút **Phân tích ngay**.
4. Đợi AI phản hồi và nhấn **OK** để lưu vào kho kiến thức.

---

## 📌 Các thành phần quan trọng

* `manifest.json`: Định nghĩa quyền hạn và cấu hình của Extension.
* `popup.js`: Xử lý logic gọi API đồng bộ giữa Python và C#.
* `content.js`: Trực tiếp tương tác với trang YouTube để lấy tiêu đề và transcript.

---
